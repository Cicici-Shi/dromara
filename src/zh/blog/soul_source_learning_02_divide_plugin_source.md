---
title: Soul网关学习(2-2)Http代理之divide插件源码解析
author: 季鹏
date: 2021-01-17
tag:
  - Soul
cover: /assets/img/architecture/soul-framework.png
head:
  - name: 博客
---

# Divide 插件如何转发 http 请求

先来设想一下，网关如果收到了一个请求http://xxx.com/openapi/appname/order/findById?id=3，那么怎么将请求转发给对应的业务？

可以想象一下大概是这几个步骤：

- 1.解析 url
- 2.查看配置文件，看这个 url 是对应于哪个业务线
- 3.读配置文件，获取该业务线在网关注册的所有 api 列表
- 4.判断该用户的这个 api 请求在不在业务的 api 列表里面
- 5.进行相关的鉴权操作（用户 AK/SK 鉴权、用户 Quota/QPS 有没有超）
- 6.如果网关有负载均衡功能，那么需要获取业务具体给 API 配置的负载均衡策略
- 7.网关向具体的业务 API 发起请求
- 8.网关将收到的业务 API 的 response 发送给用户

这篇笔记主要来学习一下 suol 网关是怎么转发 http 请求的。

先看一下官方文档的相关介绍[http 用户](https://dromara.org/zh-cn/docs/soul/user-http.html)、[Divide 插件](https://dromara.org/zh-cn/docs/soul/plugin-divide.html)

官方文档里面介绍到，如果网关需要支持 http 转发，那么需要在网关的 pom 里面有以下依赖：

```
        <!--if you use http proxy start this-->
        <dependency>
            <groupId>org.dromara</groupId>
            <artifactId>soul-spring-boot-starter-plugin-divide</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>org.dromara</groupId>
            <artifactId>soul-spring-boot-starter-plugin-httpclient</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!--if you use http proxy end this-->
```

那么可以知道 http 请求的代理与`plugin-divide`,`plugin-httpclient`这两个插件有关。

## 插件链

官方文档中说到`divide`这个插件是实现 http 请求代理的核心，下面看一下`soul-plugin/soul-plugin-divide`这个模块的代码，可以看到有一个`DividePlugin`类，继承自`AbstractPlugin`，而`AbstractPlugin`实现了`SoulPlugin`接口

![DividePlugin的继承关系](https://img-blog.csdnimg.cn/2021011523120836.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

可以看到`SoulPlugin`是`DividePlugin`的父类，那么猜测一下`SoulPlugin`是所有插件的父类。全局搜索一下`SoulPlugin`果然如此，它是诸多插件的父类。

在全局搜索`SoulPlugin`的时候，发现`soul-web/src/main/java/org/dromara/soul/web/handler`里有一个类`SoulWebHandler`里面有一个属性是`List<SoulPlugin>`，猜测`SoulWebHandler`可以操作多个插件。

![SoulWebHandler里面有List<SoulPlugin>](https://img-blog.csdnimg.cn/20210115230954422.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

看一下`SoulWebHandler`的继承关系图，发现它是继承了`WebHandler`，而`WebHandler`是 spring 框架里面的一个接口。

![SoulWebHandler的继承关系图](https://img-blog.csdnimg.cn/2021011523103754.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)
由于对 WebFlux 不了解，上网快速搜索了一下 WebHandler，得知这是 WebFlux 里面一个很重要的东西，它提供了一套通用的 http 请求处理方案。

而 soul 网关的源码里面，自己实现了一个实现了`WebHandler`接口的`SoulWebHandler`类，无疑是希望框架使用 soul 实现的这套东西来处理请求。

在`soul-web/src/main/java/org/dromara/soul/web/configuration`里的`SoulConfiguration`类，它在类头上声明了注解`@Configuration`，表明它是一个配置。`SoulConfiguration`类里面向 spring 容器注入了一个名为`webHandler`的 bean，该 bean 是 SoulWebHandler 类型的。Application 会在启动的时候扫描被`@Configuration`注解的类，所以通过以下代码，`SoulWebHandler`就被注入到 spring 容器中去了。

```
    @Bean("webHandler")
    public SoulWebHandler soulWebHandler(final ObjectProvider<List<SoulPlugin>> plugins) {
        List<SoulPlugin> pluginList = plugins.getIfAvailable(Collections::emptyList);
        final List<SoulPlugin> soulPlugins = pluginList.stream()
                .sorted(Comparator.comparingInt(SoulPlugin::getOrder)).collect(Collectors.toList());
        soulPlugins.forEach(soulPlugin -> log.info("load plugin:[{}] [{}]", soulPlugin.named(), soulPlugin.getClass().getName()));
        return new SoulWebHandler(soulPlugins);
    }
```

初始化`SoulWebHandler`的时候，将排好序的插件传入其构造函数中。各个插件都有一个 order 属性，可以根据这个属性来对插件进行优先级排序。以`DividePlugin`为例，看下它的 order 属性是从一个枚举类里面来的。

```
    @Override
    public int getOrder() {
        return PluginEnum.DIVIDE.getCode();
    }
```

而各个插件的 order 的具体值是在`soul-common/src/main/java/org/dromara/soul/common/enums/PluginEnums`这个枚举类里面定义的。PluginEnum 的 code 即为各个插件的 order。

![PluginEnum的定义](https://img-blog.csdnimg.cn/20210115231323717.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)
插件的顺序为：`global -> sign -> waf -> rate-limiter -> hystrix -> resilience4j -> divide -> webClient -> …………`

每次有一个请求的时候，WebHandler 即 SoulWebHandler 的`handle`方法都会被调用，该方法里面最主要的就是初始化了一个插件链`DefaultSoulPluginChain`，并执行该插件链。

![插件链的初始化](https://img-blog.csdnimg.cn/20210115231406346.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

看一下`DefaultSoulPluginChain`的`execute`方法，里面遍历所有插件，依次调用插件的`execute`方法。

```
    @Override
    public Mono<Void> execute(final ServerWebExchange exchange) {
        return Mono.defer(() -> {
            if (this.index < plugins.size()) {
                SoulPlugin plugin = plugins.get(this.index++);
                Boolean skip = plugin.skip(exchange);
                if (skip) {
                    return this.execute(exchange);
                }
                return plugin.execute(exchange, this);
            }
            return Mono.empty();
        });
    }
```

我们看一下`DividePlugin`的`execute`方法里面具体做了什么，从源码中看到`DividePlugin`并没有 Override 父类的`execute`方法。所以我们去父类`AbstractSoulPlugin`里面看一下`execute`方法具体做了什么。可以从下图看到，获取到了 selector 和 rule，以便执行 divide 插件的 doExecute 方法。

![AbstractSoulPlugin的execute](https://img-blog.csdnimg.cn/20210115231447528.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

## 选择器与规则

下面介绍一下`选择器（Selector）`和`规则 (Rule)`两个概念。

官方文档里面介绍到，“选择器相当于是对流量的第一次筛选，规则就是最终的筛选“

看一下 soul-admin 管理后台的 divide 这个 tab，可以看到[上一篇笔记](https://blog.csdn.net/pcmmcpmorse/article/details/112646476)里面启动的 soul-example-http 服务的一些 API 被映射到了选择器和规则里面。

![soul-admin 管理后台的selector rule](https://img-blog.csdnimg.cn/20210115231526336.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

设想一下，你在网上买了东西，填收货地址的时候，大多数的交互都是让你`省->市`级联选择，极少数的交互是直接给你一个按首字母索引的全国城市列表来选择。

`选择器->规则`类似于是`省->市`，http 流量到网关的时候，网关先使用`选择器`来匹配，然后再进一步使用`规则`来匹配。这样做的好处应该是当网关有几百个下游业务(几万/几十万个 API)的时候，可以比较快速地匹配到请求应该被转发的地址。

一般情况下，可以认为一个 spring boot 是一个业务，`选择器`里面可以初步匹配业务的名字，`规则`可以匹配业务的具体 API。例如我有业务 A、业务 B 都售卖 API，那么就可以有`/businessA`、`/businessB`两个`选择器`。

上文提到，一个 http 请求过来了之后，从缓存里面获取到了与该 url 匹配的 selector 和 rule，下面看下 divide 插件是怎么根据 selector 和 rule 进行 http 请求的代理转发的。

![DividePlugin的doExecute方法](https://img-blog.csdnimg.cn/20210115231612490.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

从上图中可以看出，DividePlugin 从 selector 和 rule 中根据负载均衡策略选择并拼装成真正的 url，将真正的 url 和超时时间、重试次数这三个值放到了`ServerWebExchange`的`attribute`里面。

上文在插件链的顺序里面提到，divide 的下一个插件是 webClient。我们去`soul-plugin-httpclient/src/main/java/org/dromara/soul/plugin/httpClient/`里面看一下`WebClientPlugin`的 execute 方法。

![WebClientPlugin的execute方法](https://img-blog.csdnimg.cn/20210115231640417.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

可以从上图看到，WebClientPlugin 的 execute 方法里面，从 exchange 里面取出了 HTTP_URL、HTTP_TIME_OUT、HTTP_RETRY，并发送了 http 请求。至此，一个外部的 http 请求就被网关真正代理到业务线去了。

本文就先到此，后续将学习 soul 网关的其他机制，如果时间富余的话要学习一下 WebFlux 框架相关的知识。

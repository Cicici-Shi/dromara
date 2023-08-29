---
title: Soul Learning(2) How Does The Divide Plugin Forward Http Requests
author: jipeng
date: 2021-01-17
tag:
  - Soul
cover: /assets/img/architecture/soul-framework.png
head:
  - name: Blog
---

# How does the Divide plugin forward http requests

First to imagine, gateway if received a request to http://xxx.com/openapi/appname/order/findById?id=3, then forwards the request to the corresponding business?

Imagine these steps:

- 1. Parses the url
- 2. View the configuration file to check the service line to which the url corresponds
- 3. Read the configuration file to obtain the list of all apis registered with the gateway for the service line
- 4. Check whether the api request of the user is in the service api list
- 5. Perform related authentication operations (whether user AK/SK authentication and user Quota/QPS exceeds thresholds).
- 6. If the gateway supports load balancing, obtain the load balancing policy configured for the API
- 7. The gateway sends a request to the specific service API
- 8. The gateway sends the received service API response to the user

This note is to learn how the soul gateway forwards http requests.

Take a look at the official documentation for [http user](https://dromara.org/zh-cn/docs/soul/user-http.html), [Divide plugin](https://dromara.org/zh-cn/docs/soul /plugin-divide.html)

According to the official document, if the gateway needs to support http forwarding, it needs to have the following dependencies in the gateway pom:

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

Then you can know that the proxy of the http request is related to 'plugin-divide' and 'plugin-httpclient'.

## Plugin chain

The official documentation says that the `divide` plugin is the core of the implementation of http request proxy, look at the `soul-plugin/soul-plugin-divide` module code, you can see that there is a `DividePlugin` class, Inherits from `AbstractPlugin`, which implements the `SoulPlugin` interface

![DividePlugin inheritance relationship](https://img-blog.csdnimg.cn/2021011523120836.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

You can see that `SoulPlugin` is the parent class of `DividePlugin`, so it's speculated that `SoulPlugin` is the parent class for all plugins. A global search confirms that `SoulPlugin` indeed serves as the parent class for various plugins.

During the global search for `SoulPlugin`, it's found that there's a class `SoulWebHandler` in `soul-web/src/main/java/org/dromara/soul/web/handler` containing an attribute `List<SoulPlugin>`. It's assumed that `SoulWebHandler` could manage multiple plugins.

![SoulWebHandler with List<SoulPlugin>](https://img-blog.csdnimg.cn/20210115230954422.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

Looking at the inheritance diagram of `SoulWebHandler`, it's observed that it inherits from `WebHandler`, which is an interface in the Spring framework.

![Inheritance diagram of SoulWebHandler](https://img-blog.csdnimg.cn/2021011523103754.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

Since I'm not familiar with WebFlux, a quick online search reveals that `WebHandler` is a crucial element in WebFlux, providing a generic solution for handling HTTP requests.

In the source code of the soul gateway, there's a self-implemented class named `SoulWebHandler` that implements the `WebHandler` interface. This implementation indicates an intention to use the framework provided by Soul to handle requests.

In the `SoulConfiguration` class within `soul-web/src/main/java/org/dromara/soul/web/configuration`, the `@Configuration` annotation is used at the class header, signifying that it's a configuration class. Inside `SoulConfiguration`, a bean named `webHandler` of type `SoulWebHandler` is injected into the Spring container. During startup, the application scans classes annotated with `@Configuration`, which leads to the injection of `SoulWebHandler` into the Spring container through the provided code:

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

Upon initialization of `SoulWebHandler`, the sorted list of plugins is passed to its constructor. Each plugin has an `order` property, which can be used to prioritize plugins. Taking `DividePlugin` as an example, its `order` property value is obtained from an enumeration class:

```
    @Override
    public int getOrder() {
        return PluginEnum.DIVIDE.getCode();
    }
```

And the order of each plug-in specific value is in `soul - common/SRC/main/Java/org/dromara/soul/common/enums PluginEnums` this enumeration class defined inside. The code of PluginEnum is the order of each plug-in.

![PluginEnum definition](https://img-blog.csdnimg.cn/20210115231323717.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)
The order of plugins is as follows: `global -> sign -> waf -> rate-limiter -> hystrix -> resilience4j -> divide -> webClient -> …………`

For each incoming request, the `handle` method of `WebHandler` (SoulWebHandler) is invoked. The primary action within this method is the initialization of a plugin chain named `DefaultSoulPluginChain`, followed by the execution of this plugin chain.

![Initialization of the plugin chain](https://img-blog.csdnimg.cn/20210115231406346.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

Taking a look at the `execute` method of `DefaultSoulPluginChain`, it iterates through all the plugins, calling the `execute` method of each plugin in sequence.

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

Now, let's explore what the `execute` method within `DividePlugin` does. Since `DividePlugin` doesn't override the `execute` method of its parent class, `AbstractSoulPlugin`, we'll need to examine the implementation of the `execute` method within `AbstractSoulPlugin`. As depicted in the following diagram, the selector and rule are obtained from the cache to execute the `doExecute` method of the divide plugin.

![AbstractSoulPlugin execute](https://img-blog.csdnimg.cn/20210115231447528.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

## Selectors and rules

Let's now delve into the concepts of `Selectors` and `Rules`.

According to the official document, "The selector is equivalent to the first filter of traffic, and the rule is the final filter."

If you look at the divide tab in the soul-admin admin background, To see a note on [] (https://blog.csdn.net/pcmmcpmorse/article/details/112646476) to start the soul - example - some of the HTTP service apis are mapped to the selector and the inside of the rules.

Let's look at the divide tab in the soul-admin management backend. We can see some of the APIs of the soul-example-http service started in the [previous note](https://blog.csdn.net/pcmmcpmorse/article/details/112646476) have been mapped to selectors and rules.

![soul-admin admin background selector rule](https://img-blog.csdnimg.cn/20210115231526336.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

Imagine that you're buying something online and filling out the shipping address. Most interactions involve a `province -> city` cascade selection, with a small portion offering a national city list indexed by the first letter.

`Selector -> Rule` is analogous to `province -> city`. When HTTP traffic reaches the gateway, the selector is used for the initial match, followed by further matching using the rule. This approach proves beneficial when the gateway handles hundreds of downstream services (thousands/tens of thousands of APIs), allowing quick determination of where a request should be forwarded.

In general, a Spring Boot application represents a business entity. `Selectors` can be used to make a preliminary match based on the business name, while `Rules` can match specific APIs of that business. For instance, if there are businesses A and B both offering APIs, then `/businessA` and `/businessB` could be two selectors.

As mentioned earlier, when an HTTP request arrives, selector and rule matching is done through cache. Now let's see how the `DividePlugin` proxies the HTTP request based on the selector and rule.

![doExecute method of DividePlugin](https://img-blog.csdnimg.cn/20210115231612490.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

From the above diagram, it's evident that `DividePlugin` retrieves the selector and rule from the cache and assembles the actual URL using a load balancing strategy. The actual URL, along with timeout and retry settings, are placed in the `ServerWebExchange` attributes.

In the plugin order mentioned earlier, the next plugin after divide is `webClient`. Let's examine the `execute` method of the `WebClientPlugin` within `soul-plugin-httpclient/src/main/java/org/dromara/soul/plugin/httpClient/`.

![execute method of WebClientPlugin](https://img-blog.csdnimg.cn/20210115231640417.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BjbW1jcG1vcnNl,size_16,color_FFFFFF,t_70#pic_center)

As shown in the diagram, the `execute` method of `WebClientPlugin` extracts `HTTP_URL`, `HTTP_TIME_OUT`, and `HTTP_RETRY` from the exchange, and sends an HTTP request. At this point, the gateway has successfully forwarded the external HTTP request to the business line.

This concludes the current article. Subsequent learning will cover other mechanisms of the soul gateway. If time allows, there's also an intention to study WebFlux framework-related knowledge.
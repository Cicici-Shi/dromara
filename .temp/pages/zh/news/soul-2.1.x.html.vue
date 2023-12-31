<template><div><p><strong>Soul</strong> 网关自从去年 10 月我开源以来，经历了一年的事情，接受到了来自社区很多朋友的建议，并进行持续不断的优化，已经提供了非常丰富的功能，很多功能都是高度自定义，可视化，高度可扩展的，现在做一个归纳总结。</p>
<p><strong>插件</strong></p>
<ul>
<li>
<p>提供了系统自带的各种插件，比如签名，监控，限流，熔断，http 代理，dubbo 代理，websocket 等等。</p>
</li>
<li>
<p>支持用户快速的进行插件的自定义开发。</p>
</li>
<li>
<p>插件的所有数据，开关状态支持动态变更。</p>
</li>
</ul>
<p><strong>数据同步</strong></p>
<ul>
<li>提供了 <code v-pre>http长轮询</code>，<code v-pre>zookeeper</code>，<code v-pre>websocket</code> 三种不同的数据同步策略，让用户自由选择。</li>
<li>推荐用户使用 websocket 方式，最轻量，在集群环境下，效率更高。</li>
</ul>
<p><strong>对于用户</strong></p>
<ul>
<li>首先我们提供了便于用户接入的 client 包，用户可以把快速的把自己的项目接入到 soul 网关。</li>
<li>默认情况下，用户完全不用关心 soul 网关的选择器，规则等配置。</li>
<li>用户之前的接口完全是零侵入，不需要任何更改，只是需要把访问域名改成网关的域名即可。</li>
<li>比如 dubbo 用户，几乎就是 http 的方式完成了 http 协议到 dubbo 协议的互相转换。</li>
<li><code v-pre>soul</code> 使用的是 http 协议，那么注定它就是跨语言的，net 程序员，php 程序员等等，要和 java 进行数据交互，那么就大大的可行了。</li>
</ul>
<p>举个列子 ，比如你有一个 dubbo 接口 参数定义是一个 java bean,</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>public void insert(final DubboTest dubboTest) {
}
public class DubboTest implements Serializable {
   private String id;
   private String name;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果你使用 soul 网关要发起对它的调用，你的 http 传参数 就是在 body 里面 传一个 json 字符串 ，和普通的 http 调用无差别。</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>{"id":"123","name":"xiaoyu"}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>对于开发者(程序员)</strong></p>
<ul>
<li>随着使用者越来越多，每个公司使用情况又不一样,soul 网关在 2.1.X 版本，处处留出来更多的高度自定义扩展性，让开发者，更加方便或者有信心融入进来。</li>
<li>比如，自定义插件，过滤器，dubbo 参数解析器，iphost 解析器，返回结果等等。。这里我着重说一下自定义返回结果。<br>
我们知道，soul 网关默认的返回结果是：</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>{"code":200, "message ": "成功!","data" :"helloWorld!"}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>但是，在运用 soul 网关对你的业务系统进行调用的时候，你的业务系统可能定义的结果并不是上述结构，可能你的 字段叫 msg,这样就会造成结构不一样，给前端处理带来了困扰。我们注意到了这个事情 ：<a href="https://github.com/Dromara/soul/issues/109" target="_blank" rel="noopener noreferrer">https://github.com/Dromara/soul/issues/109<ExternalLinkIcon/></a> , 现在已经优化，用户可以定制化的来定义返回结果,具体的要看 soul 文档。</p>
<p><strong>说了这么多，吹了这么多牛逼，那么我们来看看 soul 网关到底可以在什么场景下能发挥大作用。</strong></p>
<p><strong>后台管理 web</strong></p>
<ul>
<li>首先随便微服务的流行，我们的后台都划分成很多的微服务，我相信你们每个公司都有一个后台管理系统吧，如果我没猜错的话，他们大体上是如下架构。</li>
</ul>
<figure><img src="/assets/img/architecture/soul-rpc.png" alt="soul-rpc" tabindex="0" loading="lazy"><figcaption>soul-rpc</figcaption></figure>
<ul>
<li>很简单对吧，就是有个运营管理平台的 web 项目，去调用每个微服务，来进行后台的查看等等。随着你们业务需要的加大，可能这里需要调用的微服务越来越多，你的 <code v-pre>controller</code>越来越多，现在比如你修改了 商品模块的 接口，你要发版会造成所有其他的模块也操作不了（就是你发版影响了其他模块的使用，别杠这里只是比方，不要整蓝绿发版啥的，明白意思吧）。<br>
如果有运营人员在操作其他模块，会不会吐槽你？</li>
</ul>
<p>假如你是公司架构师，我说的是假如，那么你要怎么解决这个问题呢？当然，我们把这样一个大的 web 系统，拆分成很多小 web 系统，单独的进行发布，但是这样会引入一个问题，怎么统一登陆，鉴权？（很多后台管理系统还有权限的划分） ，这个时候，<code v-pre>soul</code> 网关 就能发挥重要的作用了，下面我只是列举了一下简单的调用图。</p>
<figure><img src="/assets/img/architecture/soul-admin-1.png" alt="soul-admin" tabindex="0" loading="lazy"><figcaption>soul-admin</figcaption></figure>
<p>这样多方便，集成了网关，每个微服务注册到网关，网关根据路由规则来进行调用。自动发现服务，连运维配置 nginx 的工作都省了，把运维的工资给你，美滋滋。</p>
<h3 id="公司入口网关-开放平台" tabindex="-1"><a class="header-anchor" href="#公司入口网关-开放平台" aria-hidden="true">#</a> 公司入口网关（开放平台）</h3>
<ul>
<li>
<p>如果一个公司要做开放平台或者入口网关，鉴权，限流，监控，熔断肯定少不了。</p>
</li>
<li>
<p>如果贵公司是 dubbo 体系，开发人员写了 dubbo 服务后，还要傻乎乎的新增一个 web 项目，来提供接口给别人调用吗？</p>
</li>
<li>
<p>如果一个接口被攻击，你怎么处理呢？如果被大流量攻击，你怎么处理呢？</p>
</li>
<li>
<p>不巧，soul 在设计之初就是来干这种事情的，我们来看一下整体的架构图。</p>
</li>
</ul>
<figure><img src="/assets/img/architecture/soul-framework.png" alt="soul-framework" tabindex="0" loading="lazy"><figcaption>soul-framework</figcaption></figure>
<h2 id="零零总总还有很多其他功能" tabindex="-1"><a class="header-anchor" href="#零零总总还有很多其他功能" aria-hidden="true">#</a> 零零总总还有很多其他功能</h2>
<ul>
<li>
<p>比如支持 websocket 代理。</p>
</li>
<li>
<p>比如支持文件上传下载。</p>
</li>
<li>
<p>比如你可以自定义的开发你的插件啊。</p>
</li>
</ul>
<h2 id="最后最后" tabindex="-1"><a class="header-anchor" href="#最后最后" aria-hidden="true">#</a> 最后最后</h2>
<ul>
<li>
<p>github 地址 ：<a href="https://github.com/Dromara/soul" target="_blank" rel="noopener noreferrer">https://github.com/Dromara/soul<ExternalLinkIcon/></a></p>
</li>
<li>
<p>gitee 地址 ：<a href="https://gitee.com/dromara/soul" target="_blank" rel="noopener noreferrer">https://gitee.com/dromara/soul<ExternalLinkIcon/></a></p>
</li>
<li>
<p>文档：<a href="https://dromara.org/zh-cn/docs/soul/soul.html" target="_blank" rel="noopener noreferrer">https://dromara.org/zh-cn/docs/soul/soul.html<ExternalLinkIcon/></a></p>
</li>
<li>
<p>欢迎大家关注，如果贵公司有使用到，或者需要学习交流，或者提供代码参与开发的朋友也可以加群来进行讨论 ，qq 群（429951241）</p>
</li>
<li>
<p>最后 3.0 已经在进行开源了，3.0 是经历过 2 年双 11 大并发场景验证过的，现在一步一步将它开源出来，希望给大家带来帮助.</p>
</li>
</ul>
</div></template>



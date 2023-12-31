<template><div><p>Hmily 是一款高性能，高可靠，易使用的柔性分布式事务解决方案，目前提供了对 dubbo，spring-cloud，motan，grpc 等 rpc 框架的支持，在易用性上提供零侵入性式的 Spring-Boot, Spring-Namespace 快速集成，目标是打造金融级的一体系分布式事务解决方案。</p>
<h2 id="调整-hmily-架构-更合理的模块划分" tabindex="-1"><a class="header-anchor" href="#调整-hmily-架构-更合理的模块划分" aria-hidden="true">#</a> 调整 Hmily 架构，更合理的模块划分</h2>
<p><strong>全景图：</strong></p>
<figure><img src="/assets/img/architecture/hmily-framework.png" alt="全景图" tabindex="0" loading="lazy"><figcaption>全景图</figcaption></figure>
<p><strong>架构调整：</strong></p>
<ul>
<li>抽离核心执行模块，支持多种事务模式以及混合使用（TCC 模式，TAC 模式）</li>
<li>核心模块去除对 spring 的依赖</li>
<li>定义多种 SPI 接口的实现</li>
<li>新增 <code v-pre>hmily-rpc</code> : 聚合多种 rpc 框架的支持</li>
<li>新增 <code v-pre>hmily-spi</code> : hmily 框架自定义 spi 机制实现</li>
<li>新增 <code v-pre>hmily-bom</code> : 解决版本依赖管理冲突的问题</li>
<li>新增 <code v-pre>hmily-metrics</code> : 监控 JVM，线程，事务运行状态，耗时等信息</li>
<li>新增 <code v-pre>hmily-tcc</code> : tcc 模式的核心实现</li>
<li>新增 <code v-pre>hmily-tac</code> : tac 模式的核心实现</li>
</ul>
<p><strong>SPI 模块划分：</strong></p>
<ul>
<li>新增 <code v-pre>hmily-repository</code>: 事务日志存储模块，支持（mysql，oracle，postgresql，sqlserver，zookeeper，redis，mongodb，file）</li>
<li>新增 <code v-pre>hmily-serializer</code>: 事务日志序列化模块, 支持 （hessian，jdk，kryo，protobuf）</li>
<li>新增 <code v-pre>hmily-config</code>：配置模块，支持（本地模式，zookeeper，nacos，apollo，etcd）</li>
<li>新增 <code v-pre>hmily-tac-sqlparser</code> ：tac 模式下，sql 解析模块</li>
</ul>
<h3 id="梳理-hmily-社区-issue-解决-bug。" tabindex="-1"><a class="header-anchor" href="#梳理-hmily-社区-issue-解决-bug。" aria-hidden="true">#</a> 梳理 Hmily 社区 issue，解决 bug。</h3>
<figure><img src="/assets/img/architecture/hmily-bug.png" alt="hmily-bug" tabindex="0" loading="lazy"><figcaption>hmily-bug</figcaption></figure>
<p>如上图：在社区中，主要是梳理和解决之前社区反馈的问题，以及社区合作进行新的开发。</p>
<p><strong>解决 bug（列举几个）：</strong></p>
<ul>
<li><code v-pre>dubbo</code>框架不支持注解方式的使用（spring-boot-starter-dubbo）</li>
<li><code v-pre>motan</code>框架不支持注解方式的使用</li>
<li><code v-pre>spring-cloud</code>用户如果使用 feign 与 hystrix 整合 hmily 时候的异常问题</li>
<li>事务日志序列化异常</li>
<li>超时异常事务悬挂 bug</li>
<li>事务定时恢复 bug</li>
</ul>
<p><strong>社区完成功能（列举几个）：</strong></p>
<ul>
<li><code v-pre>build</code>：新增 travis-ci 功能</li>
<li>事务日志支持：<code v-pre>oracle</code>, <code v-pre>postgresql</code>,<code v-pre>sqlsever</code>,<code v-pre>mongo</code>,<code v-pre>zookeeper</code>,<code v-pre>file</code>,<code v-pre>redis</code></li>
<li>配置模块：新增 apollo,etcd,nacos 配置中心支持</li>
<li>demo：新增 motan-rpc 方式使用 hmily 分布式事务 demo</li>
</ul>
<h3 id="社区共建" tabindex="-1"><a class="header-anchor" href="#社区共建" aria-hidden="true">#</a> 社区共建</h3>
<p>社区奉行<code v-pre>简单</code>，<code v-pre>快乐</code>，<code v-pre>优雅</code>，和<code v-pre>谐基</code>本原则。</p>
<ul>
<li>代码准则：代码遵循 hmily-checkstyle 标准，也有很多灵活自由的空间。（talk is cheap ,show you code）</li>
<li>开放准则：希望在这里每个人都有好的思想和观点，大家一起讨论，反复 review 代码，思考解决 bug，快乐成长，绝不搞一言堂。</li>
</ul>
<h3 id="最近" tabindex="-1"><a class="header-anchor" href="#最近" aria-hidden="true">#</a> 最近</h3>
<p>会发布最新架构的 hmily-2.1.0 版本（只会支持 TCC 模式）</p>
<p><strong>配置模块</strong></p>
<ul>
<li>配置动态刷新功能，支持所有的配置中心</li>
</ul>
<p><strong>TAC 模式:</strong></p>
<ul>
<li><code v-pre>SQL-parser</code>: 正在接入<code v-pre>apache-shardingsphere</code>,<code v-pre>apache-calcite</code></li>
<li><code v-pre>SQL-revert</code>：正在开发</li>
</ul>
<h3 id="大约在冬季" tabindex="-1"><a class="header-anchor" href="#大约在冬季" aria-hidden="true">#</a> 大约在冬季</h3>
<p>很高兴来了这里季节，在这个时间点，会发布<code v-pre>hmily-2.2.0</code>版本，这个版本将完全支持<code v-pre>TAC</code>,<code v-pre>TCC</code>模式。<br>
<code v-pre>TAC(transaction auto rollback)</code> ：有了这个模式，用户再也不用担心像 TCC 那样去写反向的 cancel 方法了。大大减少了使用成本以及学习成本。<br>
<code v-pre>TCC</code>: 稳定性，可靠性得到大大加强，彻底解决事务悬挂问题。</p>
<h3 id="以后的以后" tabindex="-1"><a class="header-anchor" href="#以后的以后" aria-hidden="true">#</a> 以后的以后</h3>
<ul>
<li>更多 RPC 框架的支持：brpc 等等。</li>
<li>支持 XA 模式。</li>
</ul>
<p>......这里空起来，很多多的规划，希望你来参与建设。</p>
<ul>
<li>github：<a href="https://github.com/dromara/hmily" target="_blank" rel="noopener noreferrer">https://github.com/dromara/hmily<ExternalLinkIcon/></a></li>
<li>gitee：<a href="https://github.com/shuaiqiyu/hmily" target="_blank" rel="noopener noreferrer">https://github.com/shuaiqiyu/hmily<ExternalLinkIcon/></a></li>
<li>qq 群: 162614487</li>
</ul>
</div></template>



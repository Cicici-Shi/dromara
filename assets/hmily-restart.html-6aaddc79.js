import{_ as r}from"./hmily-framework-f32e3dc5.js";import{_ as l}from"./hmily-bug-3aaccf92.js";import{_ as a,r as n,o as s,c as d,a as e,b as i,d as t,h as c}from"./app-0b81753d.js";const u={},h=c('<p>Hmily is a flexible distributed transaction architecture with high performance, high avalibility and ease to use. At present, it provides support for Dubbo, Spring-Cloud, Motan, GRPC and other RPC frameworks. In terms of ease of use, it provides zero-intrusive rapid integration of Spring-Boot and Spring-Namespace, with the goal of building a distributed transaction solution of financial level.</p><h2 id="adjust-hmily-architecture-with-more-reasonable-module-partition" tabindex="-1"><a class="header-anchor" href="#adjust-hmily-architecture-with-more-reasonable-module-partition" aria-hidden="true">#</a> Adjust Hmily architecture with more reasonable module partition</h2><p><strong>Architecture:</strong></p><figure><img src="'+r+'" alt="全景图" tabindex="0" loading="lazy"><figcaption>全景图</figcaption></figure><p><strong>Architecture adjustment:</strong></p><ul><li>Pull out the core execution module, support a variety of transaction mode and mixed use of TCC mode, TAC mode.</li><li>The core module removes dependencies on Spring.</li><li>Define implementations of various SPI interfaces.</li><li>New <code>hmily-rpc</code> : aggregates support for various RPC frameworks.</li><li>Added <code>hmily-spi</code> : Hmily framework custom SPI mechanism implementation.</li><li>New <code>hmily-bom</code> : resolves version dependency management conflicts.</li><li>Added <code>hmily-metrics</code>: monitoring JVM, thread, transaction health, time, etc.</li><li>New <code>hmily-TCC</code> : Core implementation of TCC pattern.</li><li>Added <code>hmily-TCC</code> : Core implementation of TAC mode.</li></ul><p>**SPI module partition: **</p><ul><li>Added <code>hmily-repository</code>: transaction log storage module with support (MySQL, Oracle, PostgreSQL, SQL Server, ZooKeeper, Redis, MongoDB, File).</li><li>Added <code>hmily-serializer</code>: transaction log serializer module, support (Hessian, JDK, Kryo, Protobuf)</li><li>Added <code>hmily-config</code>: config module to support (local mode, Zookeeper, Nacos, Apollo, Etcd).</li><li>Added <code>hmily-tac-SQLParser</code>: SQL parsing module under TAC mode</li></ul><h3 id="gather-the-hmily-community-issue-and-solve-bugs" tabindex="-1"><a class="header-anchor" href="#gather-the-hmily-community-issue-and-solve-bugs" aria-hidden="true">#</a> Gather the Hmily Community Issue and solve bugs.</h3><figure><img src="'+l+'" alt="hmily-bug" tabindex="0" loading="lazy"><figcaption>hmily-bug</figcaption></figure><p>For example, in the community, it is gather the problems reported by the community, as well as to cooperate with the community for developing new version.</p><p>**Solve bug: **</p><ul><li>Dubbo framework does not support annotation (spring-boot-starter-dubbo)</li><li>The Motan framework does not support the use of annotations</li><li>Exceptions in Spring-Cloud users when integrating Hmily with Hystrix using Feign.</li><li>Transaction log serialization exception.</li><li>Timeout exception transaction suspension bug.</li><li>Transaction timing recovers bugs.</li></ul><p>**Added function: **</p><ul><li><code>build</code>: Added travis-ci feature</li><li>Transaction log support: Oracle, PostgreSQL, Sqlsever, Mongo, Zookeeper, File, Redis.</li><li>Configuration module: new configuration center support for Apollo, ETCD, and Nacos</li><li>Demo: Added Motan-RPC to use Hmily distributed transaction.</li></ul><h3 id="community-building" tabindex="-1"><a class="header-anchor" href="#community-building" aria-hidden="true">#</a> Community building</h3><ul><li><p>The community adheres to the principles of simplicity, pleasure, elegance, and harmony.</p><ul><li>Code guidelines: The code follows the HMILY-CHECKSTYLE standard, and there is plenty of room for flexibility. Talk is cheap,show you code.</li><li>Open rule: I hope everyone here can offer good ideas, we can discuss together, review code repeatedly, think about solving bugs, grow happily.</li></ul></li></ul><h3 id="recently" tabindex="-1"><a class="header-anchor" href="#recently" aria-hidden="true">#</a> Recently</h3><p>Hmily-2.1.0 of the latest architecture will be released (TCC mode only will be supported).</p><p><strong>Configuration module</strong></p><ul><li>Configuration dynamic refresh function, support all configuration centers.</li></ul><p><strong>TAC mode:</strong></p><ul><li><code>sql-parser</code>: accessing Apache-Shardingsphere, Apache-Calcite.</li><li><code>SQL-revert</code>: Under development.</li></ul><h3 id="at-last" tabindex="-1"><a class="header-anchor" href="#at-last" aria-hidden="true">#</a> At last</h3><p>Good to be here for the season, at this point in time, Hmily-2.2.0 will be released, which will fully support TAC, TCC modes.<br> TAC(Transaction Auto Rollback): With this mode, users no longer have to worry about writing reverse cancel methods like TCC. Greatly reduce the use cost and learning cost.<br> TCC : Stability, reliability has been greatly strengthened, completely solve the problem of transaction suspension.</p><ul><li>More RPC framework support: BRPC and more.</li><li>Support XA mode.</li></ul>',26),m={href:"https://github.com/dromara/hmily",target:"_blank",rel:"noopener noreferrer"},p={href:"https://github.com/shuaiqiyu/hmily",target:"_blank",rel:"noopener noreferrer"},g=e("p",null,"QQ group: 162614487",-1);function f(y,b){const o=n("ExternalLinkIcon");return s(),d("div",null,[h,e("p",null,[i("Github: "),e("a",m,[i("https://github.com/dromara/hmily"),t(o)])]),e("p",null,[i("Gitee: "),e("a",p,[i("https://github.com/shuaiqiyu/hmily"),t(o)])]),g])}const _=a(u,[["render",f],["__file","hmily-restart.html.vue"]]);export{_ as default};
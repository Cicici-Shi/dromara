import{_ as i,a as r}from"./soul-admin-1-7a924636.js";import{_ as n}from"./soul-framework-68ec47cd.js";import{_ as l,r as u,o as p,c,a as e,b as a,d as t,h as s}from"./app-0b81753d.js";const d={},h=s(`<p>It has been a year since I open sourced Soul gateway in October last year, and received many suggestions from you guys in community. It has provided very rich functions after optimization, many of functions are highly cusmized, visualized, and highly extensible, now let&#39;s make a summary.</p><h3 id="plugin" tabindex="-1"><a class="header-anchor" href="#plugin" aria-hidden="true">#</a> Plugin</h3><ul><li><p>Provides various plug-ins, such as signature, monitoring, rate limiting, circuit breaker, Http proxy, Dubbo proxy, Websocket, etc.</p></li><li><p>Support users to quickly develop plug-ins.</p></li><li><p>All plug-in data and switch state support dynamic changes.</p></li></ul><h3 id="data-synchronization" tabindex="-1"><a class="header-anchor" href="#data-synchronization" aria-hidden="true">#</a> Data Synchronization</h3><ul><li>Provides three different data synchronization strategies: Http long polling, Zookeeper, and Websocket, allowing users to choose freely.</li><li>It is recommended to use Websocket, which is the lightest and more efficient in a cluster environment.</li></ul><h3 id="for-users" tabindex="-1"><a class="header-anchor" href="#for-users" aria-hidden="true">#</a> For Users</h3><ul><li>First of all, we provide a client package that is convenient for users to access. Users can quickly register their projects to the Soul gateway.</li><li>By default, users don&#39;t need to care about Soul Gateway&#39;s selectors, rules and other configurations.</li><li>The user&#39;s previous interface is completely zero intrusion, It is only need to change to the domain name of the Soul gateway.</li><li>For Dubbo users, the conversion from Http protocol to Dubbo protocol is almost completed by Http.</li><li>Soul gataway uses the Http protocol, so it is destined to be cross-language, It is feasible for .Net programmers, PHP programmers to interact with Java program.</li></ul><p>For example, if you have a Dubbo interface, the parameter definition is a java bean,</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">insert</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token class-name">DubboTest</span> dubboTest<span class="token punctuation">)</span> <span class="token punctuation">{</span>
<span class="token punctuation">}</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DubboTest</span> <span class="token keyword">implements</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>
   <span class="token keyword">private</span> <span class="token class-name">String</span> id<span class="token punctuation">;</span>
   <span class="token keyword">private</span> <span class="token class-name">String</span> name<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If you use the Soul gateway to call this method, your Http parameter is to pass a json string in the body, which is no different from a normal http call.</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span> <span class="token property">&quot;id&quot;</span><span class="token operator">:</span> <span class="token string">&quot;123&quot;</span><span class="token punctuation">,</span> <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;xiaoyu&quot;</span> <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="for-developers" tabindex="-1"><a class="header-anchor" href="#for-developers" aria-hidden="true">#</a> For Developers</h3><ul><li>With more and more users, the situation of each company is different. Soul gateway in 2.1.X version are more extensible, making it convenient for developers .</li><li>For example, there are may things could be extensible, such as Plug-ins, Filters, Dubbo parameter parser, iphost parser, return results, etc. We know that the default return result of the soul gateway is:</li></ul><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span> <span class="token property">&quot;code&quot;</span><span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span> <span class="token property">&quot;message &quot;</span><span class="token operator">:</span> <span class="token string">&quot;成功!&quot;</span><span class="token punctuation">,</span> <span class="token property">&quot;data&quot;</span><span class="token operator">:</span> <span class="token string">&quot;helloWorld!&quot;</span> <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,14),m=e("code",null,"msg",-1),g={href:"https://github.com/Dromara/soul/issues/109",target:"_blank",rel:"noopener noreferrer"},f=s('<h3 id="what-scenarios-of-soul-gateway-are-suitable-and-what-should-you-pay-attention-to" tabindex="-1"><a class="header-anchor" href="#what-scenarios-of-soul-gateway-are-suitable-and-what-should-you-pay-attention-to" aria-hidden="true">#</a> What scenarios of Soul gateway are suitable, and what should you pay attention to?</h3><p>First of all, I think we should follow pragmatism, when you need to use it , then you have monmentum to know it. Thus, where are you need Soul?</p><h4 id="scenario1-adimistration-back-end" tabindex="-1"><a class="header-anchor" href="#scenario1-adimistration-back-end" aria-hidden="true">#</a> Scenario1: Adimistration back-end</h4><ul><li>First of all, as rising popularity of microservices, our back-end is divided into many micro-services. I believe that your companies has a back-end management system. I guess they generally have the following architecture.</li></ul><figure><img src="'+i+'" alt="soul-rpc" tabindex="0" loading="lazy"><figcaption>soul-rpc</figcaption></figure><ul><li><p>It may cause some troubles as follows:</p><ul><li><p>The developers of every microservice are developing based on this, which will become more and more cumbersome.</p></li><li><p>How to publish without downtime? If you want to publish the commodity module, all other modules will not be able to work at this time.</p></li><li><p>If a certain module interface requires a lot of requests (multiple deployments are required), and another module does not need it, how can you split it?</p></li></ul></li><li><p>Some people may say I can disassemble them into a few web projects. But this will bring new troubles, where to do load balance? Where to do unified certification?</p></li><li><p>Soul gateway solves all the above problems very well, just register your microservice to Soul gateway. You can do whatever you want. For example, the order module has 2 nodes, and you want to release a new version, you can send request to one of them in the gateway, and update the version in the other node. When the update complete, let the request go though both two nodes. So Java programmer can also do the jod of system operation engineer.</p></li><li><p>If you need unified authentication, you only need to add an authentication plug-in suitable for your business to the gateway.</p></li></ul><figure><img src="'+r+'" alt="soul-admin" tabindex="0" loading="lazy"><figcaption>soul-admin</figcaption></figure><h3 id="scenario2-company-entrance-gateway-open-platform" tabindex="-1"><a class="header-anchor" href="#scenario2-company-entrance-gateway-open-platform" aria-hidden="true">#</a> Scenario2: Company entrance gateway (open platform)</h3><ul><li><p>If a company wants to do open-platform or an entrance gateway， authentication, rate limiting, circuit breaker, monitoring are indispensable.</p></li><li><p>If your company is in Dubbo system, when developers have written the Dubbo service, there is no need to add a new web project to provide an interface.</p></li><li><p>If an interface attacked by a large amount of request, how do you deal with it?</p></li><li><p>Soul is here to solve the trouble above, this is the purpose of the design. Let’s take a look at the overall architecture diagram.</p></li></ul><figure><img src="'+n+'" alt="soul-framework" tabindex="0" loading="lazy"><figcaption>soul-framework</figcaption></figure><ul><li>Soul gateway is implemented using reactive programming. Just look at the weather vane Spring, responsive programming is definitely an important direction in the future. When I was in 2014, I wrote for loop every day. The leader told me to use lambda expressions, which would be the trend of the future. Nowadays, if you are a java programmer but don&#39;t know lambda expression, you are out.</li></ul><figure><img src="'+n+'" alt="soul-framework" tabindex="0" loading="lazy"><figcaption>soul-framework</figcaption></figure><h3 id="there-are-many-other-functions" tabindex="-1"><a class="header-anchor" href="#there-are-many-other-functions" aria-hidden="true">#</a> There are many other functions</h3><ul><li><p>Support websocket proxy.</p></li><li><p>Support file upload and download.</p></li><li><p>You can customize your plug-in development.</p></li></ul><h3 id="at-last" tabindex="-1"><a class="header-anchor" href="#at-last" aria-hidden="true">#</a> At last</h3>',15),y={href:"https://github.com/Dromara/soul",target:"_blank",rel:"noopener noreferrer"},b={href:"https://gitee.com/dromara/soul",target:"_blank",rel:"noopener noreferrer"},w={href:"https://dromara.org/zh-cn/docs/soul/soul.html",target:"_blank",rel:"noopener noreferrer"},v=e("li",null,"QQ group: 429951241",-1),k=e("li",null,"Finally, Soul3.0 has been open sourced, which has been verified in the double 11 concurrency scene for 2 years. I hope It will help you guys.",-1);function _(x,S){const o=u("ExternalLinkIcon");return p(),c("div",null,[h,e("p",null,[a("However, when using the Soul gateway to call your business system, your business system may define the result that is not confirm the above structure. Maybe your field is called "),m,a(", which will cause a different structure and bring confusion to the front-end processing. We have noticed this thing: "),e("a",g,[a("https://github.com/Dromara/soul/issues/109"),t(o)]),a(", now it has been optimized, users can customize the return results to define, the specifics depend on the Soul document.")]),f,e("ul",null,[e("li",null,[a("Github: "),e("a",y,[a("https://github.com/Dromara/soul"),t(o)])]),e("li",null,[a("Gitee: "),e("a",b,[a("https://gitee.com/dromara/soul"),t(o)])]),e("li",null,[a("Document: "),e("a",w,[a("https://dromara.org/zh-cn/docs/soul/soul.html"),t(o)])]),v,k])])}const j=l(d,[["render",_],["__file","soul-2.1.x.html.vue"]]);export{j as default};

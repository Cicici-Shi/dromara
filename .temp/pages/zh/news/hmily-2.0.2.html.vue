<template><div><h2 id="hmily-发布-2-0-2-release-版本" tabindex="-1"><a class="header-anchor" href="#hmily-发布-2-0-2-release-版本" aria-hidden="true">#</a> Hmily 发布 2.0.2-RELEASE 版本</h2>
<ul>
<li>
<p>解决 SpringCloud 使用 hystrix 配置线程池策略的问题。</p>
</li>
<li>
<p>新增对 springcloud 内嵌事务调用的问题。</p>
</li>
<li>
<p>新增 Hmily 负载均衡策略。</p>
</li>
<li>
<p>其他 bug 的修护，与代码的优化。</p>
</li>
<li>
<p>去除不必须的第三方 jar 包。</p>
</li>
<li>
<p>零侵入方式的引入。</p>
</li>
</ul>
<h2 id="hmily-对现在流行-rpc-框架以及-spring-的支持情况。" tabindex="-1"><a class="header-anchor" href="#hmily-对现在流行-rpc-框架以及-spring-的支持情况。" aria-hidden="true">#</a> Hmily 对现在流行 RPC 框架以及 Spring 的支持情况。</h2>
<ul>
<li>
<p>dubbo 2.7.0 以下所有版本。</p>
</li>
<li>
<p>Springcloud Dalston 以上版本，包括支持现在的 Finchley 与 Greenwich</p>
</li>
<li>
<p>Motan 所有版本。</p>
</li>
<li>
<p>3.0 以上所有 Spring 版本。</p>
</li>
</ul>
<h2 id="hmily-在-2-0-2-版本对使用者-rpc-集群时候负载均衡策略。" tabindex="-1"><a class="header-anchor" href="#hmily-在-2-0-2-版本对使用者-rpc-集群时候负载均衡策略。" aria-hidden="true">#</a> Hmily 在 2.0.2 版本对使用者 RPC 集群时候负载均衡策略。</h2>
<ul>
<li>hmily 提供了自己实现的负载均衡策略，只是针对加了@Hmily 的接口</li>
</ul>
<p>dubbo 集群配置,配置负载方式为：loadbalance=&quot;hmily&quot;</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token namespace">dubbo:</span>reference</span> <span class="token attr-name">timeout</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>50000<span class="token punctuation">"</span></span>
       <span class="token attr-name">interface</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.dromara.hmily.demo.dubbo.account.api.service.AccountService<span class="token punctuation">"</span></span>
             <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>accountService<span class="token punctuation">"</span></span>
                 <span class="token attr-name">retries</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>0<span class="token punctuation">"</span></span> <span class="token attr-name">check</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>false<span class="token punctuation">"</span></span> <span class="token attr-name">actives</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>20<span class="token punctuation">"</span></span> <span class="token attr-name">loadbalance</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>hmily<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Springcloud 在调用方的 yml 配置文件中新增：</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code>hmily ：
   <span class="token key atrule">ribbon</span><span class="token punctuation">:</span>
      rule
        <span class="token key atrule">enabled</span> <span class="token punctuation">:</span> <span class="token boolean important">true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="hmily-的具体使用文档" tabindex="-1"><a class="header-anchor" href="#hmily-的具体使用文档" aria-hidden="true">#</a> Hmily 的具体使用文档：</h2>
<ul>
<li>
<p>官网文档 ：<a href="https://dromara.org/website/zh-cn/docs/hmily/index.html" target="_blank" rel="noopener noreferrer">https://dromara.org/website/zh-cn/docs/hmily/index.html<ExternalLinkIcon/></a></p>
</li>
<li>
<p>github 地址: <a href="https://github.com/yu199195/hmily" target="_blank" rel="noopener noreferrer">https://github.com/yu199195/hmily<ExternalLinkIcon/></a></p>
</li>
<li>
<p>gitee 地址： <a href="https://gitee.com/dromara/hmily" target="_blank" rel="noopener noreferrer">https://gitee.com/dromara/hmily<ExternalLinkIcon/></a></p>
</li>
<li>
<p>欢迎大家 star fork ，提供优秀的代码与建议。</p>
</li>
</ul>
</div></template>



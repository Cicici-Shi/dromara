import{_ as n,o as s,c as a,h as t}from"./app-0b81753d.js";const p="/assets/img/blog6/mirco.png",e={},o=t('<h3 id="一、引言" tabindex="-1"><a class="header-anchor" href="#一、引言" aria-hidden="true">#</a> 一、引言</h3><p><strong>插件是 Soul 的灵魂。</strong></p><p>Soul 使用了插件化设计思想，实现了插件的热插拔，且极易扩展。内置丰富的插件支持，鉴权，限流，熔断，防火墙等等。</p><figure><img src="https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122021834.png" alt="image-20210122021834793" tabindex="0" loading="lazy"><figcaption>image-20210122021834793</figcaption></figure><p>Soul 是如何实现插件化设计的呢？</p><p>在探究插件化设计之前，我们需要先了解下微内核架构（又称插件化架构）。</p><h3 id="二、微内核架构" tabindex="-1"><a class="header-anchor" href="#二、微内核架构" aria-hidden="true">#</a> 二、微内核架构</h3><h4 id="_1、架构释义" tabindex="-1"><a class="header-anchor" href="#_1、架构释义" aria-hidden="true">#</a> 1、架构释义</h4><figure><img src="'+p+`" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>微内核架构也被称为插件化架构，是一种<strong>面向功能进行拆分</strong>的可扩展性架构，通常用于实现基于产品的应用。</p><p>应用逻辑被分割为独立的<strong>插件模块</strong>和<strong>核心系统</strong>，提供了可扩展性、灵活性、功能隔离和自定义处理逻辑的特性。</p><p>微内核架构的<strong>本质</strong>，是将变化封装在插件里面，从而达到快速灵活扩展的目的，而又不影响整体系统的稳定。</p><h4 id="_2、设计关键点" tabindex="-1"><a class="header-anchor" href="#_2、设计关键点" aria-hidden="true">#</a> 2、设计关键点</h4><p>核心系统设计的关键技术：</p><ul><li><p>**插件管理：**当前有哪些插件可用？如何加载这些插件？什么时候加载插件？</p><p>常见的实现方法是插件注册表机制。</p></li><li><p>**插件连接：**插件如何连接到核心系统？</p><p>通常由核心系统制定连接规范，然后插件按照规范实现，核心系统按照规范加载即可。</p><p>常见连接机制主要有：OSGi（Eclipse 使用）、消息模式、依赖注入（Spring 使用）。</p></li><li><p>**插件通信：**插件与插件、插件与核心系统如何通信？</p><p>通信必须经过核心系统，因此通常由核心系统提供插件通信机制。</p></li></ul><h3 id="三、soul-的插件化设计" tabindex="-1"><a class="header-anchor" href="#三、soul-的插件化设计" aria-hidden="true">#</a> 三、Soul 的插件化设计</h3><p>参照微内核架构来看，Soul 的 <code>soul-web</code> 模块相当于核心系统，<code>soul-plugin</code> 下的子模块相当于插件模块。</p><p><strong>插件管理方面：</strong></p><p><code>soul-bootstrap</code> 模块的 pom 文件充当插件列表， 以硬编码的方式引入各插件。</p><p>在容器启动阶段，借助 springboot 的 starter 机制自动扫描并注册插件 bean 到 Spring 容器。</p><p><strong>插件连接方面：</strong></p><p>借助 springboot 支持的多实例自动注入能力（ObjectProvider&lt;List&gt; plugins），将插件 Bean 列表注入到网关的<strong>插件链</strong>，实现插件与网关的连接。</p><p><strong>插件通信方面：</strong></p><p>先在插件链初始化阶段完成插件排序，然后在插件处理时，借助贯穿整个插件链的 ServerWebExchange 完成向下游插件的定向传参，即某种意义上的插件通信机制。</p><h3 id="四、soul-的插件化实现" tabindex="-1"><a class="header-anchor" href="#四、soul-的插件化实现" aria-hidden="true">#</a> 四、Soul 的插件化实现</h3><p>Soul 网关中定义了一条插件链，所有的插件都在这条链上依次处理。</p><p>在探究插件链之前，我们先来看看插件实现。</p><h4 id="_1、插件实现" tabindex="-1"><a class="header-anchor" href="#_1、插件实现" aria-hidden="true">#</a> 1、插件实现</h4><p>Soul 中所有插件最终均继承自 SoulPlugin，其完整继承关系如下所示：</p><figure><img src="https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122022709.jpg" alt="SoulPlugin" tabindex="0" loading="lazy"><figcaption>SoulPlugin</figcaption></figure><p>可以看到，Soul 的插件生态极其丰富，正是如此丰富的插件支撑起了 Soul 网关强大的扩展能力。</p><p>我们以常用的 DividePlugin 为例，分析插件内部所做工作。</p><p>DividePlugin 继承结构：</p><figure><img src="https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122024517.jpg" alt="DividePlugin" tabindex="0" loading="lazy"><figcaption>DividePlugin</figcaption></figure><p>DividePlugin 继承自 AbstractSoulPlugin，最终实现了 SoulPlugin 接口。</p><p>1）先关注 SoulPlugin，该插件接口结构如下：</p><figure><img src="https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122025700.png" alt="image-20210122025700589" tabindex="0" loading="lazy"><figcaption>image-20210122025700589</figcaption></figure><ul><li>execute 方法：处理方法，需要传入 exchange 交换区 和 SoulPluginChain 插件链</li><li>getOrder 方法：取得序号，用作插件排序</li><li>named 方法：获得插件名</li><li>skip 方法：判断是否跳过本次处理</li></ul><p>每次处理时，将先进行 skip 判断，不跳过则执行 excute 处理方法。</p><p>2）再来看下 AbstractSoulPlugin，该抽象类结构如下：</p><figure><img src="https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122030444.png" alt="image-20210122030444704" tabindex="0" loading="lazy"><figcaption>image-20210122030444704</figcaption></figure><p>重点关注 execute 方法，其核心代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">if</span> <span class="token punctuation">(</span>pluginData<span class="token punctuation">.</span><span class="token function">getEnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
	<span class="token comment">// 获取插件数据</span>
	<span class="token keyword">final</span> <span class="token class-name">PluginData</span> pluginData <span class="token operator">=</span> <span class="token class-name">BaseDataCache</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">obtainPluginData</span><span class="token punctuation">(</span>pluginName<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token comment">// 获取选择器数据</span>
	<span class="token keyword">final</span> <span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">SelectorData</span><span class="token punctuation">&gt;</span></span> selectors <span class="token operator">=</span> <span class="token class-name">BaseDataCache</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">obtainSelectorData</span><span class="token punctuation">(</span>pluginName<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token keyword">final</span> <span class="token class-name">SelectorData</span> selectorData <span class="token operator">=</span> <span class="token function">matchSelector</span><span class="token punctuation">(</span>exchange<span class="token punctuation">,</span> selectors<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token comment">// 获取规则</span>
	<span class="token keyword">final</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">RuleData</span><span class="token punctuation">&gt;</span></span> rules <span class="token operator">=</span> <span class="token class-name">BaseDataCache</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">obtainRuleData</span><span class="token punctuation">(</span>selectorData<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token class-name">RuleData</span> rule<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>selectorData<span class="token punctuation">.</span><span class="token function">getType</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token class-name">SelectorTypeEnum</span><span class="token punctuation">.</span><span class="token constant">FULL_FLOW</span><span class="token punctuation">.</span><span class="token function">getCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  	<span class="token comment">//get last</span>
    rule <span class="token operator">=</span> rules<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>rules<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    rule <span class="token operator">=</span> <span class="token function">matchRule</span><span class="token punctuation">(</span>exchange<span class="token punctuation">,</span> rules<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 执行具体处理</span>
  <span class="token keyword">return</span> <span class="token function">doExecute</span><span class="token punctuation">(</span>exchange<span class="token punctuation">,</span> chain<span class="token punctuation">,</span> selectorData<span class="token punctuation">,</span> rule<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// 继续执行后续插件处理</span>
<span class="token keyword">return</span> chain<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span>exchange<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取选择器数据和规则，然后传入 doExecute 方法进行具体处理，doExecute 方法为抽象方法，交由子类具体实现。</p><p>3）查看插件子类 DividePlugin，其结构如下：</p><figure><img src="https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122032336.png" alt="image-20210122032336069" tabindex="0" loading="lazy"><figcaption>image-20210122032336069</figcaption></figure><p>重点关注 doExecute 方法，以下是核心代码：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// 获取网关上下文和规则处理器</span>
<span class="token keyword">final</span> <span class="token class-name">SoulContext</span> soulContext <span class="token operator">=</span> exchange<span class="token punctuation">.</span><span class="token function">getAttribute</span><span class="token punctuation">(</span><span class="token class-name">Constants</span><span class="token punctuation">.</span><span class="token constant">CONTEXT</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">final</span> <span class="token class-name">DivideRuleHandle</span> ruleHandle <span class="token operator">=</span> <span class="token class-name">GsonUtils</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">fromJson</span><span class="token punctuation">(</span>rule<span class="token punctuation">.</span><span class="token function">getHandle</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">DivideRuleHandle</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 获取上游列表</span>
<span class="token keyword">final</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DivideUpstream</span><span class="token punctuation">&gt;</span></span> upstreamList <span class="token operator">=</span> <span class="token class-name">UpstreamCacheManager</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">findUpstreamListBySelectorId</span><span class="token punctuation">(</span>selector<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 选择待分发的目标上游</span>
<span class="token keyword">final</span> <span class="token class-name">String</span> ip <span class="token operator">=</span> <span class="token class-name">Objects</span><span class="token punctuation">.</span><span class="token function">requireNonNull</span><span class="token punctuation">(</span>exchange<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getRemoteAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getHostAddress</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">DivideUpstream</span> divideUpstream <span class="token operator">=</span> <span class="token class-name">LoadBalanceUtils</span><span class="token punctuation">.</span><span class="token function">selector</span><span class="token punctuation">(</span>upstreamList<span class="token punctuation">,</span> ruleHandle<span class="token punctuation">.</span><span class="token function">getLoadBalance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> ip<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 设置 http url</span>
<span class="token class-name">String</span> domain <span class="token operator">=</span> <span class="token function">buildDomain</span><span class="token punctuation">(</span>divideUpstream<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">String</span> realURL <span class="token operator">=</span> <span class="token function">buildRealURL</span><span class="token punctuation">(</span>domain<span class="token punctuation">,</span> soulContext<span class="token punctuation">,</span> exchange<span class="token punctuation">)</span><span class="token punctuation">;</span>
exchange<span class="token punctuation">.</span><span class="token function">getAttributes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">Constants</span><span class="token punctuation">.</span><span class="token constant">HTTP_URL</span><span class="token punctuation">,</span> realURL<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 设置 http timeout</span>
exchange<span class="token punctuation">.</span><span class="token function">getAttributes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">Constants</span><span class="token punctuation">.</span><span class="token constant">HTTP_TIME_OUT</span><span class="token punctuation">,</span> ruleHandle<span class="token punctuation">.</span><span class="token function">getTimeout</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
exchange<span class="token punctuation">.</span><span class="token function">getAttributes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">Constants</span><span class="token punctuation">.</span><span class="token constant">HTTP_RETRY</span><span class="token punctuation">,</span> ruleHandle<span class="token punctuation">.</span><span class="token function">getRetry</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">return</span> chain<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span>exchange<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>很明显，divide 插件只是完成目标上游服务的待分发，即根据选择器和规则找到对应服务，再通过负载均衡策略分配上游服务实例。</p><p>而调用上游服务的工作是由其他相应的 client 类插件完成。</p><h4 id="_2、插件链实现" tabindex="-1"><a class="header-anchor" href="#_2、插件链实现" aria-hidden="true">#</a> 2、插件链实现</h4><p>借由插件链，Soul 将众多插件整合到一起进行统一调度处理。</p><p>插件链继承结构：</p><figure><img src="https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122035121.jpg" alt="SoulPluginChain" tabindex="0" loading="lazy"><figcaption>SoulPluginChain</figcaption></figure><p>可以看到，Soul 中插件链 SoulPluginChain 仅有一个默认实现类 DefaultSoulPluginChain。</p><p>1）DefaultSoulPluginChain 类结构如下：</p><figure><img src="https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122040245.png" alt="image-20210122040245671" tabindex="0" loading="lazy"><figcaption>image-20210122040245671</figcaption></figure><p>其持有通过构造方法传入的插件链，看看 execute 方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">Mono</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Void</span><span class="token punctuation">&gt;</span></span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token class-name">ServerWebExchange</span> exchange<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 反应式编程语法：Mono.defer</span>
  	<span class="token keyword">return</span> <span class="token class-name">Mono</span><span class="token punctuation">.</span><span class="token function">defer</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>index <span class="token operator">&lt;</span> plugins<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">SoulPlugin</span> plugin <span class="token operator">=</span> plugins<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>index<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 判断是否需要调过</span>
          	<span class="token class-name">Boolean</span> skip <span class="token operator">=</span> plugin<span class="token punctuation">.</span><span class="token function">skip</span><span class="token punctuation">(</span>exchange<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>skip<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span>exchange<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
          	<span class="token comment">// 依次执行插件处理逻辑</span>
            <span class="token keyword">return</span> plugin<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span>exchange<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token class-name">Mono</span><span class="token punctuation">.</span><span class="token function">empty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>依次处理插件链上的插件，执行插件处理逻辑。</p><p>DefaultSoulPluginChain 是 SoulWebHandler 的内部类，看下 SoulWebHandler 的实现。</p><p>2）SoulWebHandler 结构如下：</p><figure><img src="https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122035525.png" alt="image-20210122035525261" tabindex="0" loading="lazy"><figcaption>image-20210122035525261</figcaption></figure><p>SoulWebHandler 是 web 请求处理的起点，在此创建并开始插件链的处理。</p><p>同 DefaultSoulPluginChain 一样，SoulWebHandler 也是持有通过构造方法传入的插件链。</p><p>看看 handle 方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">Mono</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Void</span><span class="token punctuation">&gt;</span></span> <span class="token function">handle</span><span class="token punctuation">(</span><span class="token annotation punctuation">@NonNull</span> <span class="token keyword">final</span> <span class="token class-name">ServerWebExchange</span> exchange<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">MetricsTrackerFacade</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">counterInc</span><span class="token punctuation">(</span><span class="token class-name">MetricsLabelEnum</span><span class="token punctuation">.</span><span class="token constant">REQUEST_TOTAL</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">Optional</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">HistogramMetricsTrackerDelegate</span><span class="token punctuation">&gt;</span></span> startTimer <span class="token operator">=</span> <span class="token class-name">MetricsTrackerFacade</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">histogramStartTimer</span><span class="token punctuation">(</span><span class="token class-name">MetricsLabelEnum</span><span class="token punctuation">.</span><span class="token constant">REQUEST_LATENCY</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">DefaultSoulPluginChain</span><span class="token punctuation">(</span>plugins<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span>exchange<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">subscribeOn</span><span class="token punctuation">(</span>scheduler<span class="token punctuation">)</span>
            <span class="token punctuation">.</span><span class="token function">doOnSuccess</span><span class="token punctuation">(</span>t <span class="token operator">-&gt;</span> startTimer<span class="token punctuation">.</span><span class="token function">ifPresent</span><span class="token punctuation">(</span>time <span class="token operator">-&gt;</span> <span class="token class-name">MetricsTrackerFacade</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">histogramObserveDuration</span><span class="token punctuation">(</span>time<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>handle 方法负责插件链执行指标度量的采集，通过在 DefaultSoulPluginChain 执行时加订阅实现，DefaultSoulPluginChain 在此处完成初始化。</p><p>全局查找 SoulWebHandler 构造方法，定位到 SoulConfiguration 的 soulWebHandler 方法。</p><p>3）SoulConfiguration 结构如下：</p><figure><img src="https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122042354.png" alt="image-20210122042354171" tabindex="0" loading="lazy"><figcaption>image-20210122042354171</figcaption></figure><p>SoulConfiguration 是 Soul 的核心配置类，负责自动装配网关所需的核心 bean 对象。</p><p>如装配 SoulWebHandler：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Bean</span><span class="token punctuation">(</span><span class="token string">&quot;webHandler&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token class-name">SoulWebHandler</span> <span class="token function">soulWebHandler</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token class-name">ObjectProvider</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">List</span><span class="token punctuation">&lt;</span><span class="token class-name">SoulPlugin</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> plugins<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 获取可用的插件</span>
  	<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">SoulPlugin</span><span class="token punctuation">&gt;</span></span> pluginList <span class="token operator">=</span> plugins<span class="token punctuation">.</span><span class="token function">getIfAvailable</span><span class="token punctuation">(</span><span class="token class-name">Collections</span><span class="token operator">::</span><span class="token function">emptyList</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 插件重排</span>
  	<span class="token keyword">final</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">SoulPlugin</span><span class="token punctuation">&gt;</span></span> soulPlugins <span class="token operator">=</span> pluginList<span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token punctuation">.</span><span class="token function">sorted</span><span class="token punctuation">(</span><span class="token class-name">Comparator</span><span class="token punctuation">.</span><span class="token function">comparingInt</span><span class="token punctuation">(</span><span class="token class-name">SoulPlugin</span><span class="token operator">::</span><span class="token function">getOrder</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">collect</span><span class="token punctuation">(</span><span class="token class-name">Collectors</span><span class="token punctuation">.</span><span class="token function">toList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    soulPlugins<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>soulPlugin <span class="token operator">-&gt;</span> log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;load plugin:[{}] [{}]&quot;</span><span class="token punctuation">,</span> soulPlugin<span class="token punctuation">.</span><span class="token function">named</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> soulPlugin<span class="token punctuation">.</span><span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">SoulWebHandler</span><span class="token punctuation">(</span>soulPlugins<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意此处的插件列表经过了一次重排，重排顺序参见 PluginEnum。</p><p>4）初始化 SoulWebHandler</p><p>soul-bootstrap 启动的过程中，所有插件是怎么形成 ObjectProvider&lt;List&lt;SoulPlugin&gt;&gt; plugins，然后初始化 SoulWebHandler 的呢？</p><p>SoulWebHandler 所在的配置类通过配置 @ComponentScan(&quot;org.dromara.soul&quot;)，通知 spring 扫描 org.dromara.soul 包。</p><p>借助 springboot 的 starter 机制，将 spring.factories 里指定的配置类自动加载到容器。</p><figure><img src="https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122044810.png" alt="DividePluginConfiguration" tabindex="0" loading="lazy"><figcaption>DividePluginConfiguration</figcaption></figure><p>最后，借助 spring4.3 开始支持的 ObjectProvider，实现容器内插件 bean 的集合式注入，最终形成我们看到的插件链。</p><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><p>本篇从微内核架构说起，并以此为框架分析 Soul 的插件化设计，再结合源码实现，基本理清了 Soul 中插件式设计的实现。</p><p>需要注意：</p><p>1）由 SoulConfiguration 自动装配 SoulWebHandler，此时 SoulWebHandler 持有插件列表，但未初始化插件链。</p><p>2）待调用 handle 方法处理请求时，才初始化插件链进入插件处理。</p>`,86),c=[o];function l(i,u){return s(),a("div",null,c)}const r=n(e,[["render",l],["__file","soul_source_learning_15_plugin_chain.html.vue"]]);export{r as default};

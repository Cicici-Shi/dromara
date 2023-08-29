---
title: Soul Gateway Learning Plugin Chain Implementation
author: shenxiangjun
date: 2021-01-21
tag:
  - Soul
cover: '/assets/img/blog6/mirco.png'
head:
  - name: Blog
---

### I. Introduction

** Plugins are the soul of Soul. **

Soul uses the idea of plug-in design to realize the hot plug of plug-ins, and it is very easy to expand. Built-in rich plug-in support, authentication, current limiting, fuse, firewall and so on.

![ image-20210122021834793 ](https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122021834.png)

How does Soul implement its plug-in design?

Before exploring plug-in design, we need to understand the microkernel architecture (also known as plug-in architecture).

### II. Microkernel architecture

#### 1. Interpretation of structure

![img](/assets/img/blog6/mirco.png)

Microkernel architecture, also known as plug-in architecture, is a ** Split for function ** scalable architecture that is often used to implement product-based applications.

The application logic is split into separate ** Plug-in module ** and ** Core system **, providing the features of extensibility, flexibility, functional isolation, and custom processing logic.

Microkernel architecture ** Essence ** is to encapsulate changes in plug-ins, so as to achieve the purpose of rapid and flexible expansion without affecting the stability of the overall system.

#### 2. Key points of design

Key technologies of core system design:

- What plug-ins are ** Plug-in management: ** currently available? How do I load these plugins? When does the plug-in load?

  A common implementation is the plug-in registry mechanism.

- How does ** Plug-in connection: ** the plug-in connect to the core system?

  Usually, the core system formulates the connection specification, then the plug-in is implemented according to the specification, and the core system is loaded according to the specification.

  Common connection mechanisms include OSGi (used by Eclipse), message pattern, and dependency injection (used by Spring).

- How ** Plug-in communication: ** do plug-ins communicate with each other and with the core system?

  The communication must pass through the core system, so the core system usually provides the plug-in communication mechanism.

### 3. Plug-in design of Soul

Referring to the micro-kernel architecture, Soul's `soul-web` module is equivalent to the core system, and `soul-plugin` its sub-modules are equivalent to plug-in modules.

** Plug-in management: **

The POM file for the `soul-bootstrap` module serves as a list of plug-ins, each of which is hard-coded to be introduced.

During the container startup phase, plug-in beans are automatically scanned and registered into the Spring container with the help of springboot's starter mechanism.

** Plug-in connection: **

With the help of the multi-instance automatic injection capability (ObjectProvider <List> plugins) supported by springboot, the plug-in Bean list is injected into the gateway ** Plug-in chain ** to realize the connection between the plug-in and the gateway.

** Plug-in communication: **

First, the plug-in ordering is completed in the plug-in chain initialization phase, and then, when the plug-in is processed, the directional parameter transfer to the downstream plug-in is completed with the help of Server Web Exchange which runs through the whole plug-in chain, that is, a plug-in communication mechanism in a sense.

### 4. Plug-in implementation of Soul

A chain of plug-ins is defined in the Soul Gateway, and all plug-ins are processed in turn on this chain.

Before exploring the plug-in chain, let's take a look at the plug-in implementation.

#### 1. Plug-in implementation

All plug-ins in Soul ultimately inherit from SoulPlugin, and the complete inheritance relationship is as follows:

![SoulPlugin](https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122022709.jpg)

It can be seen that Soul's plug-in ecosystem is extremely rich, and it is such a rich plug-in that supports the powerful expansion capability of Soul Gateway.

Let's take the commonly used DividePlugin as an example to analyze the internal work of the plug-in.

DividePlugin inheritance structure:

![ DividePlugin ](https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122024517.jpg)

DividePlugin inherits from AbstractSoulPlugin and finally implements the SoulPlugin interface.

1. First focus on SoulPlugin, whose interface structure is as follows:

![ image-20210122025700589 ](https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122025700.png)

- Execute method: The processing method needs to pass in the exchange exchange area and the SoulPluginChain plug-in chain
- GetOrder method: Get the sequence number, which is used for plug-in sorting
- Named method: get the plug-in name
- Skip method: determine whether to skip this processing

For each processing, the skip judgment will be performed first, and the excute processing method will be executed if it is not skipped.

2. Let's take a look at AbstractSoulPlugin. The abstract class structure is as follows:

![ image-20210122030444704 ](https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122030444.png)

Focus on the execute method, whose core code is as follows:

```java
if (pluginData.getEnable()){
	// Obtain plugin data
	final PluginData pluginData = BaseDataCache.getInstance().obtainPluginData(pluginName);
	// Obtain selector data
	final Collection<SelectorData> selectors = BaseDataCache.getInstance().obtainSelectorData(pluginName);
	final SelectorData selectorData = matchSelector(exchange, selectors);
	// Obtain rules
	final List<RuleData> rules = BaseDataCache.getInstance().obtainRuleData(selectorData.getId());
	RuleData rule;
  if (selectorData.getType() == SelectorTypeEnum.FULL_FLOW.getCode()) {
  	//get last
    rule = rules.get(rules.size() - 1);
  } else {
    rule = matchRule(exchange, rules);
  }
  // Execute specific processing
  return doExecute(exchange, chain, selectorData, rule);
}
// Continue executing subsequent plugin processing
return chain.execute(exchange);
```

Get the selector data and rules, and then pass in the doExecute method for concrete processing. The doExecute method is an abstract method, which is concretely implemented by the subclass.

3. View the plug-in subclass DividePlugin, whose structure is as follows:

![ image-20210122032336069 ](https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122032336.png)

Focusing on the doExecute method, here is the core code:

```java
// Obtain the gateway context and rule handler
final SoulContext soulContext = exchange.getAttribute(Constants.CONTEXT);
final DivideRuleHandle ruleHandle = GsonUtils.getInstance().fromJson(rule.getHandle(), DivideRuleHandle.class);
// Obtain upstream list
final List<DivideUpstream> upstreamList = UpstreamCacheManager.getInstance().findUpstreamListBySelectorId(selector.getId());
// Choose the target upstream for distribution
final String ip = Objects.requireNonNull(exchange.getRequest().getRemoteAddress()).getAddress().getHostAddress();
DivideUpstream divideUpstream = LoadBalanceUtils.selector(upstreamList, ruleHandle.getLoadBalance(), ip);
// Set the HTTP URL
String domain = buildDomain(divideUpstream);
String realURL = buildRealURL(domain, soulContext, exchange);
exchange.getAttributes().put(Constants.HTTP_URL, realURL);
// Set HTTP timeout
exchange.getAttributes().put(Constants.HTTP_TIME_OUT, ruleHandle.getTimeout());
exchange.getAttributes().put(Constants.HTTP_RETRY, ruleHandle.getRetry());
return chain.execute(exchange);
```

Obviously, the divide plug-in only completes the distribution of the target upstream service, that is, it finds the corresponding service according to the selector and rules, and then allocates the upstream service instance through the load balancing strategy.

The work of calling the upstream service is done by other corresponding client class plug-ins.

#### 2. Implementation of plug-in chain

Through the plug-in chain, Soul integrates many plug-ins together for unified scheduling.

Plug-in chain inheritance structure:

![ SoulPluginChain ](https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122035121.jpg)

As you can see, the plug-in chain SoulPluginChain in Soul has only one default implementation class, DefaultSoulPluginChain.

1. The structure of Default SoulPluginChain class is as follows:

![ image-20210122040245671 ](https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122040245.png)

Which holds the plug-in chain passed in through the constructor, look at the execute method:

```java
public Mono<Void> execute(final ServerWebExchange exchange) {
    // Reactive programming syntax: Mono.defer
  	return Mono.defer(() -> {
        if (this.index < plugins.size()) {
            SoulPlugin plugin = plugins.get(this.index++);
            // Check if skipping is needed
          	Boolean skip = plugin.skip(exchange);
            if (skip) {
                return this.execute(exchange);
            }
          	// Execute plugin processing logic sequentially
            return plugin.execute(exchange, this);
        }
        return Mono.empty();
    });
}
```

Process the plug-ins on the plug-in chain in turn and execute the plug-in processing logic.

DefaultSoulPluginChain is the inner class of SoulWebHandler. Take a look at the implementation of SoulWebHandler.

2. The SoulWeb Handler is structured as follows:

![ image-20210122035525261 ](https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122035525.png)

The SoulWeb Handler is the starting point for web request processing, where the plug-in chain is created and begins processing.

Like the DefaultSoulPluginChain, the SoulWebHandler holds the plug-in chain passed in through the constructor.

Look at the handle method:

```java
public Mono<Void> handle(@NonNull final ServerWebExchange exchange) {
    MetricsTrackerFacade.getInstance().counterInc(MetricsLabelEnum.REQUEST_TOTAL.getName());
    Optional<HistogramMetricsTrackerDelegate> startTimer = MetricsTrackerFacade.getInstance().histogramStartTimer(MetricsLabelEnum.REQUEST_LATENCY.getName());
    return new DefaultSoulPluginChain(plugins).execute(exchange).subscribeOn(scheduler)
            .doOnSuccess(t -> startTimer.ifPresent(time -> MetricsTrackerFacade.getInstance().histogramObserveDuration(time)));
}
```

The handle method is responsible for the collection of the plug-in chain execution indicator measurement. It is implemented by adding a subscription when the DefaultSoulPluginChain is executed. The DefaultSoulPluginChain is initialized here.

Find the SoulWebHandler constructor method globally and locate the soulWebHandler method of SoulConfiguration.

3. The Soul Configuration structure is as follows:

![ image-20210122042354171 ](https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122042354.png)

Soul Configuration is the core configuration class of Soul, which is responsible for automatically assembling the core bean objects required by the gateway.

If assembling the SoulWeb Handler:

```java
@Bean("webHandler")
public SoulWebHandler soulWebHandler(final ObjectProvider<List<SoulPlugin>> plugins) {
    // Obtain available plugins
  	List<SoulPlugin> pluginList = plugins.getIfAvailable(Collections::emptyList);
    // Reorder plugins
  	final List<SoulPlugin> soulPlugins = pluginList.stream()
            .sorted(Comparator.comparingInt(SoulPlugin::getOrder)).collect(Collectors.toList());
    soulPlugins.forEach(soulPlugin -> log.info("load plugin:[{}] [{}]", soulPlugin.named(), soulPlugin.getClass().getName()));
    return new SoulWebHandler(soulPlugins);
}
```

Note that the list of plug-ins here has been rearranged. See PluginEnum for the order of rearrangement.

4. Initialize SoulWeb Handler

In the process of soul-bootstrap startup, how do all plug-ins form ObjectProvider < List <SoulPlugin> > plugins, and then initialize SoulWebHandler?

The configuration class where SoulWebHandler is located notifies spring to scan the org. Dromara. Soul package by configuring @ ComponentScan ( "org. Dromara. Soul" ").

With the starter mechanism of springboot, the configuration class specified in the spring. Factories is automatically loaded into the container.

![ DividePluginConfiguration ](https://gitee.com/stephenshen/pic-bed/raw/master/img/20210122044810.png)

Finally, with the help of ObjectProvider, which is supported since Spring 4.3, we implement the collective injection of plug-in beans in the container, and finally form the plug-in chain we see.

### Sum up

This article starts from the micro-kernel architecture, and uses this framework to analyze the plug-in design of Soul, combined with the source code implementation, basically clarifies the implementation of plug-in design in Soul.

Attention is required:

1. SoulWebHandler is automatically assembled by Soul Configuration. At this time, SoulWebHandler holds the plug-in list, but the plug-in chain is not initialized.

2. When the handle method is called to process the request, the plug-in chain is initialized to enter the plug-in processing.

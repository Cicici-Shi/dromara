<template><div><h3 id="soul-网关发布-1-0-4-release-版本" tabindex="-1"><a class="header-anchor" href="#soul-网关发布-1-0-4-release-版本" aria-hidden="true">#</a> Soul 网关发布 1.0.4-RELEASE 版本</h3>
<ul>
<li>修复在 1.0.3 版本的后台管理中，出现的 bug。</li>
<li>配置信息序列化方式支持自定义扩展。默认的序列化方式由 kroy 改为了 java 序列化方式。</li>
<li>dubbo 框架支持的更改。</li>
</ul>
<h3 id="对-dubbo-用户使用的更改。" tabindex="-1"><a class="header-anchor" href="#对-dubbo-用户使用的更改。" aria-hidden="true">#</a> 对 dubbo 用户使用的更改。</h3>
<ul>
<li>
<p>在以前的版本中（1.0.2 or 1.0.3），dubbo 的参数是通过 header 头上传递，在 1.0.4 版本中是通过 body 传递</p>
</li>
<li>
<p>更新了相关的文档信息。</p>
</li>
</ul>
<h3 id="关于使用-1-0-4-版本的建议。" tabindex="-1"><a class="header-anchor" href="#关于使用-1-0-4-版本的建议。" aria-hidden="true">#</a> 关于使用 1.0.4 版本的建议。</h3>
<ul>
<li>
<p>1.0.4 版本支持用户自定义插件开发，支持正则表达式的匹配。</p>
</li>
<li>
<p>dubbo 参数传递的更改，我觉得这样会更加友好。</p>
</li>
</ul>
<h3 id="如果您之前使用的-1-0-2-版本-想要更新到-1-0-4-版本。" tabindex="-1"><a class="header-anchor" href="#如果您之前使用的-1-0-2-版本-想要更新到-1-0-4-版本。" aria-hidden="true">#</a> 如果您之前使用的 1.0.2 版本，想要更新到 1.0.4 版本。</h3>
<ul>
<li>
<p>在插件表新增 role 字段。</p>
</li>
<li>
<p>重新启动 1.0.4 版本的管理后台。</p>
</li>
<li>
<p>执行同步所有插件（因为序列化方式的更改）</p>
</li>
<li>
<p>启动 1.0.4 版本的 soul-web 服务。</p>
</li>
</ul>
<h3 id="遇到问题" tabindex="-1"><a class="header-anchor" href="#遇到问题" aria-hidden="true">#</a> 遇到问题？</h3>
<ul>
<li>
<p>添加 qq 群（429951241）</p>
</li>
<li>
<p>官网文档：<a href="https://dromara.org/website/zh-cn/docs/soul/soul.html" target="_blank" rel="noopener noreferrer">https://dromara.org/website/zh-cn/docs/soul/soul.html<ExternalLinkIcon/></a></p>
</li>
<li>
<p>github 地址: <a href="https://github.com/Dromara/soul" target="_blank" rel="noopener noreferrer">https://github.com/Dromara/soul<ExternalLinkIcon/></a></p>
</li>
<li>
<p>gitee 地址： <a href="https://gitee.com/dromara/soul" target="_blank" rel="noopener noreferrer">https://gitee.com/dromara/soul<ExternalLinkIcon/></a></p>
</li>
</ul>
</div></template>



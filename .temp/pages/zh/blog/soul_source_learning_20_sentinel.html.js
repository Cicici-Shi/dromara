export const data = JSON.parse("{\"key\":\"v-23b8cbd0\",\"path\":\"/zh/blog/soul_source_learning_20_sentinel.html\",\"title\":\"Soul网关学习Sentinel插件原理解析\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"Soul网关学习Sentinel插件原理解析\",\"author\":\"骆潇龙\",\"date\":\"2021-03-19T00:00:00.000Z\",\"tag\":[\"Soul\"],\"cover\":\"/assets/img/blog6/02.jpg\",\"comment\":false,\"description\":\"在业务网关中熔断和流量控制都是非常必要的功能。soul 在实现这部分功能时使用了不同的成熟组件，用户可以根据自己的喜好选择。本文将介绍如何在 soul 中使用阿里的 Sentinel 组件实现熔断及流控功能。本文首先会介绍熔断和流控的场景及意义。然后介绍如何在 soul 上配置使用 sentinel 插件做流控和熔断。最后从源码的层面简略分析 soul...\",\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/zh/blog/soul_source_learning_20_sentinel.html\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Soul网关学习Sentinel插件原理解析\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"在业务网关中熔断和流量控制都是非常必要的功能。soul 在实现这部分功能时使用了不同的成熟组件，用户可以根据自己的喜好选择。本文将介绍如何在 soul 中使用阿里的 Sentinel 组件实现熔断及流控功能。本文首先会介绍熔断和流控的场景及意义。然后介绍如何在 soul 上配置使用 sentinel 插件做流控和熔断。最后从源码的层面简略分析 soul...\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:image\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/assets/img/blog6/02.jpg\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"name\":\"twitter:card\",\"content\":\"summary_large_image\"}],[\"meta\",{\"name\":\"twitter:image:alt\",\"content\":\"Soul网关学习Sentinel插件原理解析\"}],[\"meta\",{\"property\":\"article:author\",\"content\":\"骆潇龙\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Soul\"}],[\"meta\",{\"property\":\"article:published_time\",\"content\":\"2021-03-19T00:00:00.000Z\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Soul网关学习Sentinel插件原理解析\\\",\\\"image\\\":[\\\"https://vuepress-theme-hope-docs-demo.netlify.app/assets/img/blog6/02.jpg\\\"],\\\"datePublished\\\":\\\"2021-03-19T00:00:00.000Z\\\",\\\"dateModified\\\":null,\\\"author\\\":[{\\\"@type\\\":\\\"Person\\\",\\\"name\\\":\\\"骆潇龙\\\"}]}\"]]},\"headers\":[{\"level\":2,\"title\":\"场景描述\",\"slug\":\"场景描述\",\"link\":\"#场景描述\",\"children\":[]},{\"level\":2,\"title\":\"流量控制\",\"slug\":\"流量控制\",\"link\":\"#流量控制\",\"children\":[]},{\"level\":2,\"title\":\"熔断\",\"slug\":\"熔断\",\"link\":\"#熔断\",\"children\":[]},{\"level\":2,\"title\":\"熔断\",\"slug\":\"熔断-1\",\"link\":\"#熔断-1\",\"children\":[]},{\"level\":2,\"title\":\"流量控制\",\"slug\":\"流量控制-1\",\"link\":\"#流量控制-1\",\"children\":[]}],\"readingTime\":{\"minutes\":14.17,\"words\":4251},\"filePathRelative\":\"zh/blog/soul_source_learning_20_sentinel.md\",\"localizedDate\":\"2021年3月19日\",\"autoDesc\":true,\"excerpt\":\"\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
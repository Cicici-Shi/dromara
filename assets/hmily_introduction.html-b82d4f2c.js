const e=JSON.parse('{"key":"v-54df0e8c","path":"/zh/blog/hmily_introduction.html","title":"Hmily：高性能异步分布式事务TCC框架","lang":"zh-CN","frontmatter":{"title":"Hmily：高性能异步分布式事务TCC框架","author":"xiaoyu","date":"2018-09-25T00:00:00.000Z","tag":["hmily","TCC"],"cover":"/assets/img/architecture/hmily-framework.png","head":[["meta",{"name":"博客"}],["link",{"rel":"alternate","hreflang":"en-us","href":"https://vuepress-theme-hope-docs-demo.netlify.app/blog/hmily_introduction.html"}],["meta",{"property":"og:url","content":"https://vuepress-theme-hope-docs-demo.netlify.app/zh/blog/hmily_introduction.html"}],["meta",{"property":"og:title","content":"Hmily：高性能异步分布式事务TCC框架"}],["meta",{"property":"og:description","content":"无缝集成 Spring,Spring boot start。; \\r无缝集成 Dubbo,SpringCloud,Motan 等 rpc 框架。; \\r多种事务日志的存储方式（redis，mongdb,mysql 等）。; \\r多种不同日志序列化方式（Kryo,protostuff,hession）。; \\r事务自动恢复。; \\r支持内嵌事务的依赖传递。; \\r代..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://vuepress-theme-hope-docs-demo.netlify.app/assets/img/architecture/hmily-framework.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:locale:alternate","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2023-08-29T09:26:08.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"Hmily：高性能异步分布式事务TCC框架"}],["meta",{"property":"article:author","content":"xiaoyu"}],["meta",{"property":"article:tag","content":"hmily"}],["meta",{"property":"article:tag","content":"TCC"}],["meta",{"property":"article:published_time","content":"2018-09-25T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-08-29T09:26:08.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Hmily：高性能异步分布式事务TCC框架\\",\\"image\\":[\\"https://vuepress-theme-hope-docs-demo.netlify.app/assets/img/architecture/hmily-framework.png\\"],\\"datePublished\\":\\"2018-09-25T00:00:00.000Z\\",\\"dateModified\\":\\"2023-08-29T09:26:08.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"xiaoyu\\"}]}"]],"description":"无缝集成 Spring,Spring boot start。; \\r无缝集成 Dubbo,SpringCloud,Motan 等 rpc 框架。; \\r多种事务日志的存储方式（redis，mongdb,mysql 等）。; \\r多种不同日志序列化方式（Kryo,protostuff,hession）。; \\r事务自动恢复。; \\r支持内嵌事务的依赖传递。; \\r代..."},"headers":[{"level":3,"title":"1.采用 disruptor 进行事务日志的异步读写（disruptor 是一个无锁，无 GC 的并发编程框架）","slug":"_1-采用-disruptor-进行事务日志的异步读写-disruptor-是一个无锁-无-gc-的并发编程框架","link":"#_1-采用-disruptor-进行事务日志的异步读写-disruptor-是一个无锁-无-gc-的并发编程框架","children":[]},{"level":3,"title":"2.异步执行 confrim,cancel 方法。","slug":"_2-异步执行-confrim-cancel-方法。","link":"#_2-异步执行-confrim-cancel-方法。","children":[]},{"level":3,"title":"这里有人可能会问：那么 cancel 方法异常，或者 confrim 方法异常怎么办呢？","slug":"这里有人可能会问-那么-cancel-方法异常-或者-confrim-方法异常怎么办呢","link":"#这里有人可能会问-那么-cancel-方法异常-或者-confrim-方法异常怎么办呢","children":[]},{"level":3,"title":"有人又会问：这里如果日志保存异常了怎么办？","slug":"有人又会问-这里如果日志保存异常了怎么办","link":"#有人又会问-这里如果日志保存异常了怎么办","children":[]},{"level":3,"title":"3.ThreadLocal 缓存的使用。","slug":"_3-threadlocal-缓存的使用。","link":"#_3-threadlocal-缓存的使用。","children":[]},{"level":3,"title":"4.GuavaCache 的使用","slug":"_4-guavacache-的使用","link":"#_4-guavacache-的使用","children":[]},{"level":3,"title":"以上 4 点造就了 Hmily 是一个异步的高性能分布式事务 TCC 框架的原因。","slug":"以上-4-点造就了-hmily-是一个异步的高性能分布式事务-tcc-框架的原因。","link":"#以上-4-点造就了-hmily-是一个异步的高性能分布式事务-tcc-框架的原因。","children":[]},{"level":3,"title":"Hmily 如何使用？（https://github.com/yu199195/hmily/tree/master/hmily-tcc-demo）","slug":"hmily-如何使用-https-github-com-yu199195-hmily-tree-master-hmily-tcc-demo","link":"#hmily-如何使用-https-github-com-yu199195-hmily-tree-master-hmily-tcc-demo","children":[]},{"level":3,"title":"1.dubbo 用户","slug":"_1-dubbo-用户","link":"#_1-dubbo-用户","children":[]},{"level":3,"title":"SpringCloud 用户","slug":"springcloud-用户","link":"#springcloud-用户","children":[]},{"level":3,"title":"Motan 用户","slug":"motan-用户","link":"#motan-用户","children":[]},{"level":3,"title":"hmily-spring-boot-start 那这个就更容易了，只需要根据你的 RPC 框架去引入不同的 jar 包。","slug":"hmily-spring-boot-start-那这个就更容易了-只需要根据你的-rpc-框架去引入不同的-jar-包。","link":"#hmily-spring-boot-start-那这个就更容易了-只需要根据你的-rpc-框架去引入不同的-jar-包。","children":[]}],"git":{"createdTime":1693287526000,"updatedTime":1693301168000,"contributors":[{"name":"Cici","email":"1901177100@qq.com","commits":2}]},"readingTime":{"minutes":7.31,"words":2194},"filePathRelative":"zh/blog/hmily_introduction.md","localizedDate":"2018年9月25日","autoDesc":true,"excerpt":""}');export{e as data};
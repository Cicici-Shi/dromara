---
title: 活动
index: false
sidebar: false
breadcrumb: false
pageInfo: false
contributors: false
editLink: false
lastUpdated: false
prev: false
next: false
comment: false
---

- [Markdown Enhance](markdown.md)

- [Page Config](page.md)

- [Function Disable](disable.md)

- [Encryption Demo](encrypt.md)

_你好， {{ msg }}_

<RedDiv>

_当前计数为： {{ count }}_

</RedDiv>

<button @click="count++">点我！</button>
<el-carousel :interval="4000" type="card" height="200px" indicator-position="outside">
<el-carousel-item v-for="item in activityItems" :key="item.title">

<div :style="{ backgroundImage: 'url(' + item.img + ')'
, height: '100%'  }" class="bg"><h3  text="2xl" justify="center" class="text">{{ item.title }}</h3>
</div>
</el-carousel-item>
</el-carousel>

<script setup>
import { h, ref, onMounted } from "vue";
// import { useThemeLocaleData } from "@vuepress/theme-default/lib/client/composables/useThemeData.js";
// import { usePageFrontmatter } from "@vuepress/client";
const activityItems = [{title:'Dromara 梦码读书会介绍',img:'/assets/img/activities/dromara-open-soul-01.jpg'},{title:'Dromara Soul 源码01期阅读分享会02',img:'/assets/img/activities/dromara-open-soul-03.jpg'},{title:'Dromara Soul源码01期阅读分享会01',img:'/assets/img/activities/dromara-open-soul-02.jpg'},]
// import { useSidebarItems } from "@vuepress/theme-default/lib/client/composables/index.js";
// const sidebarItems = useSidebarItems();
onMounted(() => {
  console.log(1);
  // const themeLocale = useThemeLocaleData();
  // const frontmatter = usePageFrontmatter();
  // const sidebarItems = computed(() =>
  //   resolveSidebarItems(frontmatter.value)
  // );
  // console.log(sidebarItems);
});
const resolveSidebarItems = (frontmatter) => {
  // get sidebar config from frontmatter > theme data
  const sidebarConfig = frontmatter.sidebar ??"auto";
  const sidebarDepth =
    frontmatter.sidebarDepth ?? 2;
  // resolve sidebar items according to the config
  if (frontmatter.home || sidebarConfig === false) {
    return [];
  }
  if (sidebarConfig === "auto") {
    return resolveAutoSidebarItems(sidebarDepth);
  }
  if (isArray(sidebarConfig)) {
    return resolveArraySidebarItems(sidebarConfig, sidebarDepth);
  }
  if (isPlainObject(sidebarConfig)) {
    return resolveMultiSidebarItems(sidebarConfig, sidebarDepth);
  }
  return [];
};
const RedDiv = (_, ctx) =>
  h(
    "div",
    {
      class: "red-div",
    },
    ctx.slots.default()
  );
const msg = "Markdown 中的 Vue";
const count = ref(0);
</script>

<style>
.red-div {
  color: red;
}
.bg {
      background-size: cover;
    background-position: center;
    position:relative;
    backdrop-filter: saturate(150%) blur(12px);
}
.text {
  background:#fff
}
</style>

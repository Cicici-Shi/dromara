<template>
  <el-button>1</el-button>
  <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item v-for="item in 6" :key="item">
      <h3 text="2xl" justify="center">{{ item }}+1</h3>
    </el-carousel-item>
  </el-carousel>
</template>
<script setup>
import { h, ref, onMounted } from "vue";
import { useThemeLocaleData } from "@vuepress/theme-default/lib/client/composables/useThemeData.js";
import { usePageFrontmatter } from "@vuepress/client";

// import { useSidebarItems } from "@vuepress/theme-default/lib/client/composables/index.js";
// const sidebarItems = useSidebarItems();
onMounted(() => {
  console.log(1);
  const themeLocale = useThemeLocaleData();
  const frontmatter = usePageFrontmatter();
  const sidebarItems = computed(() =>
    resolveSidebarItems(frontmatter.value, themeLocale.value)
  );
  console.log(sidebarItems);
});
const resolveSidebarItems = (frontmatter, themeLocale) => {
  // get sidebar config from frontmatter > theme data
  const sidebarConfig = frontmatter.sidebar ?? themeLocale.sidebar ?? "auto";
  const sidebarDepth =
    frontmatter.sidebarDepth ?? themeLocale.sidebarDepth ?? 2;
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
</style>

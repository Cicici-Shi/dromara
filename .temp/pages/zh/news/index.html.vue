<template><div><NewsActivityBlogSection :title="frontmatter.title"/></div></template>


<script setup lang="ts">
import NewsActivityBlogSection from "@NewsActivityBlogSection";
import {  usePageFrontmatter } from "@vuepress/client";
import type { DefaultThemePageFrontmatter } from "@vuepress/theme-default/lib/shared/index.js";
import { ref, onBeforeMount } from "vue";

const frontmatter = usePageFrontmatter<DefaultThemePageFrontmatter>();

</script>
<style scoped lang="scss">
.theme-hope-content {
  margin: 0;
  padding: 0;
  max-width: none;
  position: relative;
  z-index: 1;
  top: -161px;
  @media (min-width: 1440px) {
    padding-left: 16rem;
  }
}
</style>
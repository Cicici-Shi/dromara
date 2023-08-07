<template>
  <div class="news-activity-blog-section">
    <div class="news-activity-blog-container">
      <h1 class="title">{{ title }}</h1>
      <p class="description">{{ option.DESC }}</p>
    </div>
    <main class="news-activity-blog-main">
      <h2 class="tag">Tag</h2>

      <div class="buttons">
        <template v-for="item in TAGS" :keys="item">
          <button
            :class="{ selected: currentTag === item, 'tag-button': true }"
            @click="currentTag = item"
          >
            {{ item }}
          </button>
        </template>
      </div>
      <div class="cards">
        <div v-for="obj in option.CARDS" class="card">
          <img class="cover" :src="obj.cover" :alt="obj.name" />
          <div class="tag-items">
            <div v-for="tag in obj.tags" class="tag-item">#{{ tag }}</div>
          </div>
          <a class="title">{{ obj.name }}</a>
          <p class="desc">{{ obj.desc }}</p>
          <div class="author">
            <img
              class="avatar"
              :src="`https://www.github.com/${obj.github_name}.png`"
              :alt="obj.github_name"
            />
            <div class="author-info">
              <div class="author-name">{{ obj.author_name }}</div>
              <div class="time">{{ obj.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
});

import { ref, watchEffect } from "vue";
import enActivityOption from "./enActivity";
import enBlogOption from "./enBlog";
import enNewsOption from "./enNews";
import zhActivityOption from "./zhActivity";
import zhBlogOption from "./zhBlog";
import zhNewsOption from "./zhNews";

let option = ref({});
let currentTag = ref("All");

const options = {
  News: enNewsOption,
  新闻: zhNewsOption,
  Activity: enActivityOption,
  活动: zhActivityOption,
  Blog: enBlogOption,
  博客: zhBlogOption,
};
watchEffect(() => {
  option.value = options[props.title];
});

const TAGS = [
  "All",
  "DreamCode",
  "Dromara",
  "GateWay",
  "himly",
  "Reactor",
  "Soul",
  "TCC",
];
</script>

<style scoped lang="scss">
.news-activity-blog-section {
  padding-top: var(--navbar-height);
}
.news-activity-blog-container {
  height: 422px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 24px;

  background: url(/assets/img/bg-blog.png) no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem;
  @media (min-width: 960px) {
    padding-left: 5rem;
  }
  h1 {
    margin: 0;
    color: #171b25;
    font-size: 44px;
    font-weight: 900;
  }
  .description {
    max-width: 700px;
    padding-right: 52%;
    color: #61687c;
    font-size: 16px;
    line-height: 28px;
  }
}
.news-activity-blog-main {
  padding: 80px 2vw;
  .tag {
    font-weight: 700;
    border: none;
  }
  .buttons {
    display: flex;
    padding-right: 0px;
    align-items: center;
    gap: 16px;
    margin-bottom: 36px;
  }
  .tag-button {
    display: flex;
    padding: 16px 30px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 6px;
    border: 1px solid #e5e6eb;
    background: #fff;
    color: #4e5969;
    cursor: pointer;
    &.selected {
      border: 1px solid #2d74ff;
      background: #eaf1ff;
      color: #2d74ff;
    }
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    @media (max-width: 600px) {
      grid-template-columns: 1fr;
      gap: 0;
    }
    @media (min-width: 840px) and (max-width: 1439px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .card {
    display: flex;
    padding: 16px;
    flex-direction: column;
    gap: 16px;
    border-radius: 8px;
    background: #fff;
  }
  .cover {
    height: 190px;
    align-self: stretch;
    border-radius: 8px;
  }

  .tag-items {
    display: flex;
    gap: 10px;
    color: #2d74ff;
    font-size: 14px;
  }
  .title {
    color: #3e3232;
    font-size: 18px;
    font-weight: 700;
  }
  .desc {
    color: #61687c;
    font-size: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }
  .author {
    display: flex;
    gap: 10px;
    height: 72px;
    padding: 13px 16px;
    align-items: center;
    align-self: stretch;
    border-radius: 12px;
    background: #f2f4f7;
  }
  .avatar {
    width: 44px;
    border-radius: 12px;
  }
  // .author-info {
  //   flex-direction: column;
  // }
}
</style>

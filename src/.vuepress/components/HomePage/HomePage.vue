<template>
  <div class="home-page">
    <div class="wrapper">
      <div class="vp-hero-mask">
        <div class="vp-hero-info">
          <h1 id="main-title">Dromara</h1>
          <p class="vp-description">{{ homeOption.DESCRIPTION }}</p>
          <p class="vp-actions">
            <a
              :href="
                lang === 'zh-CN' || lang === '/zh/'
                  ? '/zh/projects/'
                  : '/projects/'
              "
              class="vp-action primary"
              >{{ homeOption.QUICK_START }}</a
            >
            <a href="https://gitee.com/dromara" class="vp-action">Gitee</a>
            <a href="https://github.com/dromara" class="vp-action">GitHub</a>
          </p>
        </div>
      </div>
      <div class="feature-wrapper">
        <div class="feature">
          <div class="feature-container">
            <div class="feature-title">
              <img src="/assets/img/open.png" alt="open" />
              <h2>{{ homeOption.OPEN }}</h2>
            </div>
            <p class="home-description">{{ homeOption.OPEN_DESCRIPTION }}</p>
          </div>
          <div class="feature-container">
            <div class="feature-title">
              <img src="/assets/img/vision.png" alt="vision" />
              <h2>{{ homeOption.VISION }}</h2>
            </div>
            <p class="home-description">
              {{ homeOption.VISION_DESCRIPTION }}
            </p>
          </div>
          <div class="feature-container">
            <div class="feature-title">
              <img src="/assets/img/slogan.png" alt="slogan" />
              <h2>{{ homeOption.SLOGAN }}</h2>
            </div>
            <p class="home-description">
              {{ homeOption.SLOGAN_DESCRIPTION }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="project">
      <h2 class="header">{{ homeOption.PROJECT }}</h2>
      <p class="more">{{ homeOption.MORE_PROJECTS + '&nbsp;&nbsp;>' }}</p>
      <div class="project-container">
        <img class="project-img" src="/assets/img/projects.png" alt="project" />
        <div class="projects">
          <template v-for="item in homeOption.PROJECT_DETAILS" :key="item.name">
            <div class="project-item">
              <div class="top-text">{{ item.name }}</div>
              <div class="bottom-text">{{ item.description }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="community">
      <h2 class="header">{{ homeOption.COMMUNITY }}</h2>
      <div class="feature-wrapper">
        <div class="feature">
          <template
            v-for="section in homeOption.COMMUNITY_ITEM"
            :key="section.category"
          >
            <div class="feature-container">
              <div class="feature-title">
                <img :src="section.icon" />
                <h2>{{ section.category }}</h2>
              </div>
              <template v-for="item in section.details" :key="item.title">
                <div class="community-item">
                  <div class="content">
                    <div class="title">{{ item.title }}</div>
                    <div class="time">{{ item.time }}</div>
                  </div>
                  <div class="icon-container">
                    <div class="icon">></div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch, ref, reactive } from 'vue';
import { type HomeOption } from './types';
import { useSiteLocaleData } from '@vuepress/client';
import enHomeOption from './en';
import zhHomeOption from './zh';

const siteLocaleData = useSiteLocaleData();
const lang = ref(siteLocaleData.value.lang);

let homeOption: HomeOption = reactive({
  QUICK_START: '',
  DESCRIPTION: '',
  OPEN: '',
  OPEN_DESCRIPTION: '',
  VISION: '',
  VISION_DESCRIPTION: '',
  SLOGAN: '',
  SLOGAN_DESCRIPTION: '',
  PROJECT: '',
  MORE_PROJECTS: '',
  PROJECT_DETAILS: [],
  COMMUNITY: '',
  COMMUNITY_ITEM: []
});

watch(
  () => siteLocaleData.value.lang,
  (newLang) => {
    lang.value = newLang;
    if (lang.value === 'zh-CN' || lang.value === '/zh/') {
      homeOption = zhHomeOption;
    } else {
      homeOption = enHomeOption;
    }
  },
  {
    immediate: true
  }
);
</script>
<style scoped lang="scss">
.home-page {
  padding-top: var(--navbar-height);
  background: #f9fbff;
  .wrapper {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - var(--navbar-height));
  }
  h2 {
    border-bottom: none;
  }
  .vp-hero-mask {
    background: url(/assets/img/bg-image.png) no-repeat;

    background-size: cover;
    background-position: center;
    @media (min-width: 960px) {
      padding-left: 5rem;
    }
  }
  .vp-hero-info {
    padding: 100px 24px;
    #main-title {
      margin: 0.5rem 0;
      background: linear-gradient(120deg, #0a7bf4, #096dd9, #7509d9 100%);
      -webkit-background-clip: text;
      background-clip: text;
      font-weight: bold;
      font-size: 3.6rem;
      -webkit-text-fill-color: transparent;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
        'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica,
        Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';

      @media (max-width: 959px) {
        font-size: 2.5rem;
        text-align: center;
      }
      @media (max-width: 719px) {
        font-size: 2.25rem;
        text-align: center;
      }
      @media (max-width: 419px) {
        margin: 0;
        font-size: 1.9rem;
      }
    }
  }

  .vp-description,
  .vp-actions {
    max-width: 35rem;
    color: #3a5169;
    font-weight: 500;
    font-size: 1.6rem;
    line-height: 1.3;
    margin: 1.8rem 0;
    @media (max-width: 959px) {
      margin: 1.5rem auto;
      text-align: center;
    }
    @media (max-width: 719px) {
      font-size: 1.4rem;
    }

    @media (max-width: 419px) {
      font-size: 1.2rem;
    }
  }

  .vp-action {
    display: inline-block;
    overflow: hidden;
    min-width: 4rem;
    margin: 0.5rem;
    padding: 0.5em 1.5rem;
    border-radius: 2rem;
    background: #f8f8f8;
    color: #2c3e50;
    font-size: 1.2rem;
    text-align: center;
    transition: color 0.3s ease, color 0.3s ease, transform 0.3s ease;
    &:hover {
      border-color: #eceef1;
      background: #eceef1;
    }

    &.primary {
      border-color: #096dd9;
      background: #096dd9;
      color: #fff;
      &:hover {
        border-color: #0a7bf4;
        background: #0a7bf4;
      }
    }
    @media (max-width: 419px) {
      font-size: 1rem;
    }
  }

  .feature-wrapper {
    padding: 0 60px;
  }
  .feature {
    margin: -80px 0 20px;
    display: flex;
    justify-content: space-between;
    border-radius: 6px;
    box-shadow: 0px 4px 32px 0px rgba(64, 93, 149, 0.05);
    background-color: rgba(255, 255, 255, 0.9);
    box-sizing: border-box;
    min-height: 210px;
    @media (max-width: 800px) {
      flex-direction: column;
    }
    .feature-container {
      margin: 20px 42px;
      display: flex;
      flex-direction: column;
      background-color: rgba(255, 255, 255, 0.9);
      img {
        margin: 0 20px 10px 0;
      }

      @media (min-width: 800px) {
        width: 30%;
      }
      .feature-title {
        display: flex;
        align-items: center;
      }
      .home-description {
        margin: 0;
      }
    }
  }
  .project {
    background: url(/assets/img/project-bg.png) no-repeat;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 0;
  }
  .project-container {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    @media (max-width: 991px) {
      flex-direction: column;
    }

    .project-img {
      width: 30rem;
      @media (max-width: 568px) {
        width: 20rem;
      }
    }
    .projects {
      display: grid;
      padding: 10px 25px 30px;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(4, 100px);
      gap: 10px;
      min-width: 380px;
      .project-item {
        background-color: #fff;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid #f1f2f5;
        color: #414960;

        .top-text {
          font-size: 18px;
        }

        .bottom-text {
          font-size: 16px;
        }
        &:hover {
          color: #2e64fe;
          cursor: pointer;
          box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.06),
            0px 0px 10px 0px rgba(0, 0, 0, 0.04);
        }
      }
    }
  }
  .header {
    text-align: center;
    font-weight: 700;
  }
  .more {
    color: #2e64fe;
    margin-top: 0;
    padding: 5px 10px;
    cursor: pointer;
    &:hover {
      display: inline-block;
      background: #e8f0fe;
      border-radius: 5px;
    }
  }
  .community {
    padding: 20px 0;
    .feature {
      margin: 0;
      box-shadow: none;
      background: none;
      display: grid;
      gap: 16px;
      grid: auto-flow/repeat(var(--devsite-columns, 3), 1fr);

      @media (max-width: 991px) {
        --devsite-columns: 2;
      }
      @media (max-width: 568px) {
        display: block;
      }
    }
    .feature-container {
      border: 1px solid #f1f2f5;
      margin: 30px 0;
      padding: 10px 20px;
      min-width: 220px;
      width: auto;
      h2 {
        font-size: 32px;
        font-weight: 700;
      }
    }
    .community-item {
      display: flex;
      align-items: center;
      padding: 10px;
      cursor: pointer;
      &:hover {
        color: blue;
      }
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .title {
      font-size: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .time {
      font-size: 14px;
    }
    .icon-container {
      flex: 0;
      margin-left: 10px;
    }

    .icon {
      font-size: 20px;
    }
  }
}
@media (max-width: 991px) {
  html {
    font-size: 55%;
    scroll-padding-top: 8rem;
  }

  .home h3 {
    font-size: 4rem;
  }
}
</style>

<template>
  <div class="projects-page">
    <div class="project-container">
      <h1 class="title">{{ projectsOption.PROJECTS }}</h1>
      <p class="description">
        {{ projectsOption.DESCRIPTION }}
      </p>
    </div>
    <main class="project-main">
      <div
        v-for="item in projectItem"
        :key="item.groupName"
        class="project-group"
      >
        <h2 class="group-name">{{ item.groupName }}</h2>
        <div class="project-card">
          <div class="project" v-for="obj in item.projects">
            <div class="project-header">
              <img
                v-if="!isImageMissing(obj.name)"
                class="project-title"
                :src="`/assets/img/logo/${obj.name}.png`"
                :alt="obj.name"
              />
              <div v-else class="project-title text">
                {{ convertToUpperCamelCase(obj.name) }}
              </div>
              <div class="gitstar">
                <template v-if="lang == 'zh-CN' || lang == '/zh/'">
                  <a
                    v-if="!noGiteeProjects.includes(obj.name)"
                    :href="`https://gitee.com/dromara/${obj.name}/stargazers`"
                    target="_blank"
                    ><img
                      :src="`https://gitee.com/dromara/${obj.name}/badge/star.svg?theme=gvp`"
                  /></a>
                </template>
                <template v-else>
                  <a
                    class="github-button"
                    :href="`https://github.com/dromara/${obj.name}/stargazers`"
                    data-icon="octicon-star"
                    data-size="large"
                    data-show-count="true"
                  >
                  </a>
                </template>
              </div>
            </div>
            <div class="project-content">{{ obj.description }}</div>
            <div class="project-buttons">
              <a class="project-button primary" :href="obj.website">
                {{ projectsOption.START_UP }}
              </a>
              <a
                v-if="!noGiteeProjects.includes(obj.name)"
                class="project-button"
                :href="`https://gitee.com/dromara/${obj.name}`"
                >Gitee</a
              >
              <a
                class="project-button"
                :href="`https://github.com/dromara/${obj.name}`"
                >Github</a
              >
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useSiteLocaleData } from "@vuepress/client";
import { ref, watch } from "vue";
import enProjectsOption from "./en";
import zhProjectsOption from "./zh";

let projectsOption = ref({});
const siteLocaleData = useSiteLocaleData();
let lang = ref(siteLocaleData.value.lang);

watch(
  () => siteLocaleData.value.lang,
  (newLang) => {
    lang.value = newLang;
    if (lang.value == "zh-CN" || lang.value == "/zh/") {
      projectsOption.value = zhProjectsOption;
    } else {
      projectsOption.value = enProjectsOption;
    }
  },
  {
    immediate: true,
  }
);

const isImageMissing = (name) => {
  const missingImages = ["jinx", "athena", "open-capacity-platform", "hodor"];
  return missingImages.includes(name);
};
const convertToUpperCamelCase = (name) => {
  return name
    .replace(/-([a-z])/g, (letter) => letter.toUpperCase())
    .replace(/^([a-z])/, (letter) => letter.toUpperCase());
};
const noGiteeProjects = ["jinx", "athena"];
let projectItem = ref([
  {
    groupName: projectsOption.value.DISTRIBUTED_TRANSACTION,
    projects: [
      {
        name: "hmily",
        website: "https://dromara.org/zh/projects/hmily/overview/",
        description: projectsOption.value.HMILY_DESC,
      },
      {
        name: "Raincat",
        website: "https://dromara.org/zh/projects/raincat/overview/",
        description: projectsOption.value.RAINCAT_DESC,
      },
      {
        name: "myth",
        website: "https://dromara.org/zh/projects/myth/overview/",
        description: projectsOption.value.MYTH_DESC,
      },
    ],
  },
  {
    groupName: projectsOption.value.POPULAR_TOOLS,
    projects: [
      {
        name: "hutool",
        website: "https://hutool.cn/",
        description: projectsOption.value.HUTOOL_DESC,
      },
      {
        name: "forest",
        website: "https://forest.dtflyx.com/",
        description: projectsOption.value.FOREST_DESC,
      },
      {
        name: "liteFlow",
        website: "https://yomahub.com/liteflow/",
        description: projectsOption.value.LITEFLOW_DESC,
      },
      {
        name: "dynamic-tp",
        website: "https://juejin.cn/column/7053801521502224392",
        description: projectsOption.value.DYNAMIC_TP_DESC,
      },
      {
        name: "easy-es",
        website: "https://easy-es.cn/",
        description: projectsOption.value.EASY_ES_DESC,
      },
      {
        name: "go-view",
        website: "http://www.mtruning.club:81/",
        description: projectsOption.value.GO_VIEW_DESC,
      },
      {
        name: "image-combiner",
        website: "http://dromara.gitee.io/image-combiner",
        description: projectsOption.value.IMAGE_COMBINER_DESC,
      },
      {
        name: "jinx",
        website: "https://dromara.org/zh/projects/jinx/overview",
        description: projectsOption.value.JINX_DESC,
      },
      {
        name: "electron-egg",
        website: "https://www.yuque.com/u34495/mivcfg",
        description: projectsOption.value.ELECTRON_EGG_DESC,
      },
      {
        name: "northstar",
        website: "https://www.quantit.tech/",
        description: projectsOption.value.NORTHSTAR_DESC,
      },
      {
        name: "easy_trans",
        website: "http://easy-trans.fhs-opensource.top/",
        description: projectsOption.value.EASY_TRANS_DESC,
      },
      {
        name: "fast-request",
        website: "https://dromara.org/fast-request",
        description: projectsOption.value.FAST_REQUEST_DESC,
      },
      {
        name: "redisfront",
        website: "https://www.redisfront.com/",
        description: projectsOption.value.REDISFRONT_DESC,
      },
    ],
  },
  {
    groupName: "企业级认证",
    projects: [
      {
        name: "sa-token",
        website: "http://sa-token.dev33.cn/",
        description: projectsOption.value.SA_TOKEN_DESC,
      },
      {
        name: "MaxKey",
        website: "https://maxkey.top/",
        description: projectsOption.value.MAXKEY_DESC,
      },
      {
        name: "sureness",
        website: "https://dromara.org/sureness",
        description: projectsOption.value.SURENESS_DESC,
      },
    ],
  },
  {
    groupName: "运维管控",
    projects: [
      {
        name: "Jpom",
        website: "https://jpom.io/",
        description: projectsOption.value.JPOM_DESC,
      },
      {
        name: "hertzbeat",
        website: "https://hertzbeat.com/",
        description: projectsOption.value.HERTZBEAT_DESC,
      },
    ],
  },
  {
    groupName: "分布式日志",
    projects: [
      {
        name: "TLog",
        website: "https://yomahub.com/tlog/",
        description: projectsOption.value.TLOG_DESC,
      },
    ],
  },
  {
    groupName: "Agent监控",
    projects: [
      {
        name: "cubic",
        website: "https://cubic.jiagoujishu.com/",
        description: projectsOption.value.CUBIC_DESC,
      },
      {
        name: "athena",
        website: "https://dromara.org/zh/projects/raincat/overview/",
        description: projectsOption.value.ATHENA_DESC,
      },
    ],
  },
  {
    groupName: "微服务",
    projects: [
      {
        name: "koalas-rpc",
        website: "https://github.com/dromara/koalas-rpc",
        description: projectsOption.value.KOALAS_RPC_DESC,
      },
      {
        name: "mendmix",
        website: "https://www.jeesuite.com/",
        description: projectsOption.value.MENDMIX_DESC,
      },
      {
        name: "lamp-cloud",
        website: "https://tangyh.top/",
        description: projectsOption.value.LAMP_CLOUD_DESC,
      },
      {
        name: "dante-cloud",
        website: "https://www.herodotus.cn/",
        description: projectsOption.value.DANTE_CLOUD_DESC,
      },
      {
        name: "open-capacity-platform",
        website: "https://gitee.com/dromara/open-capacity-platform/",
        description: projectsOption.value.OPEN_CAPACITY_PLATFORM_DESC,
      },
    ],
  },
  {
    groupName: "分布式调度",
    projects: [
      {
        name: "hodor",
        website: "https://dromara.org/zh/projects/hodor/overview",
        description: projectsOption.value.HODOR_DESC,
      },
    ],
  },
]);
</script>

<style scoped lang="scss">
.projects-page {
  padding-top: var(--navbar-height);
  .project-container {
    height: 422px;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 24px;

    background: url(/assets/img/bg-projects.png) no-repeat;
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
  .project-main {
    background-color: #f9fbff;
    padding: 30px 10vw;
    @media (min-width: 1440px) {
      padding: 30px 2vw;
    }
    .project-group {
      padding: 50px 0 30px;
    }
    .group-name {
      font-weight: 700;
      margin: 0;
      border: none;
    }
    .project-card {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      @media (max-width: 820px) {
        grid-template-columns: 1fr;
        gap: 0;
      }
      @media (min-width: 1220px) and (max-width: 1439px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .project {
      display: flex;
      min-width: 343px;
      padding: 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      border-radius: 8px;
      background: #fff;
    }
    .project-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .project-title {
      width: 100px;
      height: 50px;
      object-fit: contain;
      &.text {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 500;
        white-space: nowrap;
      }
    }

    .project-buttons {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      .project-button {
        display: inline-block;
        width: 110px;
        height: 30px;
        line-height: 30px;
        color: #2e64fe;
        background-color: #f8fbff;
        border-radius: 4px;
        text-align: center;
        text-decoration: none;
        &.primary {
          background-color: #2274de;
          color: #fff;
        }
      }
    }
  }
}
</style>

<template>
  <div class="projects">
    <div class="project-container">
      <h1 class="title">Projects</h1>
      <p class="description">
        在Dromara，我们的项目是我们的创新成果，我们乐于与您分享和交流。您可以在我们的项目中找到您感兴趣的作品，也可以在Gitee或GitHub上查看我们的源码。
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
                class="project-title"
                :src="`/assets/img/logo/${obj.name}.png`"
                :alt="obj.name"
              />
              <div class="gitstar"></div>
            </div>
            <div class="project-content">{{ obj.description }}</div>
            <div class="project-buttons">
              <a class="project-button primary" :href="obj.website">开始</a>
              <a
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
const projectItem = [
  {
    groupName: "分布式事务",
    projects: [
      {
        name: "hmily",
        website: "https://dromara.org/zh/projects/hmily/overview/",
        description: "柔性分布式事务解决方案",
      },
      {
        name: "raincat",
        website: "https://dromara.org/zh/projects/raincat/overview/",
        description: "强一致性分布式事务解决方案",
      },
      {
        name: "myth",
        website: "https://dromara.org/zh/projects/myth/overview/",
        description: "可靠消息分布式事务解决方案",
      },
    ],
  },
];
</script>

<style scoped lang="scss">
.projects {
  padding-top: var(--navbar-height);
  .project-container {
    height: 422px;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 24px;

    background: url(/assets/img/bg-pro.png) no-repeat;
    background-size: cover;
    background-position: center;
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
      padding-right: 30vw;
      color: #61687c;
      font-size: 16px;
      line-height: 28px;
    }
  }
  .project-main {
    background-color: #f9fbff;
    padding: 30px 10vw;
    .group-name {
      font-weight: 700;
      margin: 0;
      border: none;
      padding: 50px 0 30px;
    }
    .project-card {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      @media (max-width: 568px) {
        flex-direction: column;
      }
    }
    .project {
      display: flex;
      width: 380px;
      padding: 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      border-radius: 8px;
      background: #fff;
      img {
        width: 82px;
        height: 42px;
        object-fit: contain;
      }
    }
    .project-buttons {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .project-button {
        display: inline-block;
        width: 110px;
        height: 30px;
        line-height: 30px;
        color: #2e64fe;
        background-color: #f8fbff;
        border-radius: 4px;
        // border: none;
        // outline: none;
        text-align: center;
        &.primary {
          background-color: #2274de;
          color: #fff;
        }
      }
    }
  }
}
</style>

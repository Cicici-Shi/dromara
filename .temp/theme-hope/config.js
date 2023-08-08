import { defineClientConfig } from "@vuepress/client";
import { VPLink } from "D:/code/dromara website/dromara/node_modules/.pnpm/vuepress-shared@2.0.0-beta.234_vuepress@2.0.0-beta.66/node_modules/vuepress-shared/lib/client/index.js";

import { HopeIcon, Layout, NotFound, useScrollPromise, injectDarkmode, setupDarkmode, setupSidebarItems } from "D:/code/dromara website/dromara/node_modules/.pnpm/vuepress-theme-hope@2.0.0-beta.234_sass-loader@13.3.2_vuepress@2.0.0-beta.66/node_modules/vuepress-theme-hope/lib/client/export.js";

import { defineAutoCatalogIconComponent } from "D:/code/dromara website/dromara/node_modules/.pnpm/vuepress-plugin-auto-catalog@2.0.0-beta.234_sass-loader@13.3.2_vuepress@2.0.0-beta.66/node_modules/vuepress-plugin-auto-catalog/lib/client/index.js"
import Slide from "D:/code/dromara website/dromara/node_modules/.pnpm/vuepress-plugin-md-enhance@2.0.0-beta.234_sass-loader@13.3.2_vuepress@2.0.0-beta.66/node_modules/vuepress-plugin-md-enhance/lib/client/SlidePage.js";

import "D:/code/dromara website/dromara/node_modules/.pnpm/vuepress-theme-hope@2.0.0-beta.234_sass-loader@13.3.2_vuepress@2.0.0-beta.66/node_modules/vuepress-theme-hope/lib/client/styles/index.scss";

defineAutoCatalogIconComponent(HopeIcon);

export default defineClientConfig({
  enhance: ({ app, router }) => {
    const { scrollBehavior } = router.options;

    router.options.scrollBehavior = async (...args) => {
      await useScrollPromise().wait();

      return scrollBehavior(...args);
    };

    // inject global properties
    injectDarkmode(app);

    // provide HopeIcon as global component
    app.component("HopeIcon", HopeIcon);
    // provide VPLink as global component
    app.component("VPLink", VPLink);


  },
  setup: () => {
    setupDarkmode();
    setupSidebarItems();

  },
  layouts: {
    Layout,
    NotFound,
    Slide,
  }
});
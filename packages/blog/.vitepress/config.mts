import { defineConfig } from "vitepress";
import UnoCSS from "unocss/vite";
import sidebar from "./router/sidebar.json";
import unocssConfig from "./unocss.config.ts";
import configHead from './configHead.ts'
// 导入 RSS 插件
import rssPlugin from '../../plugin-rss/index.ts';

// 从 package.json 获取站点信息
const packageInfo = {
  author: 'Yoran Wu',
  siteUrl: 'https://wyc7758775.github.io/yoran-secret/' // 替换为你的实际站点URL
};

export default defineConfig({
  title: " Yoran Wu",
  description: " 个人学习总结记录",
  base: "/yoran-secret/",
  head: configHead as any,
  themeConfig: {
    nav: [
      { text: "Yoran", link: "/" },
      { text: "Posts", link: sidebar[0].items[0].link },
      { text: "Observer", link: "/observing" },
      { text: "Gallery", link: "/gallery" },
    ],
    sidebar: sidebar
  },
  vite: {
    plugins: [
      UnoCSS(unocssConfig),
      // 添加 RSS 插件
      (rssPlugin as any)({
        baseUrl: packageInfo.siteUrl,
        title: 'Yoran Wu 的博客',
        description: '个人学习总结记录',
        author: {
          name: packageInfo.author,
          email: '295563358@qq.com' // 替换为你的邮箱
        },
        contentDir: 'posts'
      })
    ],
    assetsInclude: ["**/assets/**"],
    resolve: {
      alias: {
        "@assets": "/Users/wuyucun/programmer/font-end/packages/blog/assets",
      },
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name]-[hash][extname]",
        },
      },
    },
  },
});

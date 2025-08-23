import { defineConfig } from "vitepress";
import UnoCSS from "unocss/vite";
import sidebar from "./router/sidebar.json";
import unocssConfig from "./unocss.config.ts";
import configHead from './configHead.ts'

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
    sidebar: sidebar,
    socialLinks: [{ icon: "github", link: "https://github.com/wyc7758775" }],
  },
  vite: {
    plugins: [UnoCSS(unocssConfig)],
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

import { defineConfig } from "vitepress";
import UnoCSS from "unocss/vite";
import sidebar from "./router/sidebar.json";
import unocssConfig from "./unocss.config.ts";

export default defineConfig({
  title: " Yoran wu",
  description: " 个人学习总结记录，有很多错误，现阶段也就这样了",
  base: "/yoran-secret/",
  head: [
    // 使用动态路径
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/yoran-secret/profile.svg",
      },
    ],
    [
      "link",
      {
        rel: "dns-prefetch preload",
        href: "//cdn.jsdelivr.net",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "//cdn.jsdelivr.net/npm/element-plus/dist/index.css",
      },
    ],
    [
      "script",
      {
        src: "//cdn.jsdelivr.net/npm/element-plus",
      },
    ],
    [
      "script",
      {
        src: "//unpkg.com/@element-plus/icons-vue",
      },
    ],
    // 添加referrer meta标签以解决图片403问题
    [
      "meta",
      {
        name: "referrer",
        content: "no-referrer",
      },
    ],
  ],
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

import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'
// 导入 RSS 插件
import rssPlugin from '../../plugin-rss/index.ts'
import configHead from './configHead.ts'
// 导入 HTML Hash 插件
import sidebar from './router/sidebar.json'
import unocssConfig from './unocss.config.ts'

// 从 package.json 获取站点信息
const packageInfo = {
  author: 'Yoran Wu',
  siteUrl: 'https://wyc7758775.github.io/yoran-secret/', // 替换为你的实际站点URL
}

export default defineConfig({
  title: ' Yoran Wu',
  description: ' 个人学习总结记录',
  base: '/yoran-secret/',
  head: configHead as any,
  themeConfig: {
    logo: {
      src: '/pikachu-logo.svg',
      alt: 'Yoran',
    },
    nav: [
      { text: 'Yoran', link: '/' },
      { text: 'Observer', link: '/observing', activeMatch: '/observer' },
      { text: 'Posts', link: sidebar[0].items[0].link, activeMatch: '/posts' },
      { text: 'Gallery', link: '/gallery' },
    ],
    sidebar,
    socialLinks: [{ icon: 'github', link: 'https://github.com/wyc7758775' }],
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: tag => tag === 'font',
      },
    },
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
          email: '295563358@qq.com', // 替换为你的邮箱
        },
        contentDir: ['posts', 'life'],
      }),
    ],
    assetsInclude: ['**/assets/**'],
    resolve: {
      alias: {
        '@assets': new URL('../assets', import.meta.url).pathname,
      },
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  },
})

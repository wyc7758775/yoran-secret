import { defineConfig } from 'vitepress'
import UnoCSS from 'unocss/vite'
import documentsRouter from './router/documentsRouter.json'


export default defineConfig({
  title: " Yoran秘密空间",
  description: " 个人学习总结记录，有很多错误，现阶段也就这样了",
  base: "/yoran-secret/",
    head: [
    // 使用动态路径
    ['link', {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/yoran-secret/assets/profile.svg'
    }]
  ],
  themeConfig: {
    nav: [
      { text: 'Yoran', link: '/' },
      { text: 'Posts', link: documentsRouter[0].items[0].link },
      { text: 'Gallery', link: '/gallery' }
    ],

    sidebar: documentsRouter,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wyc7758775' }
    ]
  },
  vite: {
    plugins: [
      UnoCSS({
        configFile: './unocss.config.ts'
      }) as any
    ],
    assetsInclude: ['**/assets/gallery/**'],
    resolve: {
      alias: {
        '@assets': '/Users/wuyucun/programmer/font-end/packages/docs/assets'
      },
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})

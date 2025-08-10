import { defineConfig } from 'vitepress'
import UnoCSS from 'unocss/vite'
import documentsRouter from './router/documentsRouter.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: " Yoran秘密空间",
  description: " 个人学习总结记录，有很多错误，现阶段也就这样了",
  base: "/yoran-secret/",
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/assets/profile.svg' }]
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
      UnoCSS() as any
    ],
     // 修改assetsInclude配置，确保正确匹配gallery目录
    assetsInclude: ['assets/gallery/**/*'],
    // 指定public目录，VitePress会自动复制该目录下的文件到dist
    publicDir: 'assets',
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})

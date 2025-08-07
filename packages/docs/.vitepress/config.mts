import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: " 生活记录",
  description: " 个人学习总结记录，有很多错误，现阶段也就这样了",
  base: '/yoran-secret/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: ' 架构师', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'JavaScript Core',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wyc7758775' }
    ]
  }
})

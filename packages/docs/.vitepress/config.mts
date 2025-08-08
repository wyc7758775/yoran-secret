import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: " Yoran秘密空间",
  description: " 个人学习总结记录，有很多错误，现阶段也就这样了",
  base: "/yoran-secret/",
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/assets/profile.svg' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Yoran', link: '/' },
      { text: ' Posts', link: '/markdown-examples' }
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

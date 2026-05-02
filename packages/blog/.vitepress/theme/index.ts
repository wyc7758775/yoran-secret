import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './main.css'
import 'virtual:uno.css'
import GiscusComment from '../../pages/components/GiscusComment.vue'

export default {
  ...DefaultTheme,
  async enhanceApp(ctx: any) {
    DefaultTheme.enhanceApp(ctx)

    // 禁用浏览器自动恢复滚动位置，避免返回时先闪现旧页面顶部内容
    if (typeof history !== 'undefined') {
      history.scrollRestoration = 'manual'
    }
  },
  Layout: () => {
    const layout = DefaultTheme.Layout()
    return h(layout, null, {
      'doc-after': () => h(GiscusComment, { mapping: 'pathname' }),
    })
  },
}

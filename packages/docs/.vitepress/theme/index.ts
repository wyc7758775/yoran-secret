import { App } from 'vue'
import DefaultTheme from 'vitepress/theme'
import 'element-plus/dist/index.css'
// import 'element-plus/theme-chalk/dark/css-vars.css'

// import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import ElementPlus from 'element-plus'
import * as icons from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const useElementPlusComps = (app: App) => {
  // element-plus 图标
  let k: keyof typeof icons
  for (k in icons) {
    app.component(k, icons[k])
  }

  // element-plus 组件
  app.use(ElementPlus, {
    locale: zhCn
  })
}
export default {
  ...DefaultTheme,
  async enhanceApp(ctx: any) {
    DefaultTheme.enhanceApp(ctx)
    useElementPlusComps(ctx.app)
  }
}

import { App } from 'vue'
import DefaultTheme from 'vitepress/theme'
import 'element-plus/dist/index.css'
// 只导入实际使用的组件
import { ElImage, ElIcon, ElDialog, vLoading } from 'element-plus'
// 只导入实际使用的图标
import { ArrowLeft } from '@element-plus/icons-vue'
import './main.css'

const useElementPlusComps = (app: App) => {
  // 注册实际使用的组件
  app.use(ElImage)
  app.use(ElIcon)
  app.use(ElDialog)
  // 注册v-loading指令
  app.use(vLoading.directive)
  // 注册v-loading指令的组件
  app.component('v-loading', vLoading)
  // 注册实际使用的图标
  app.component('ArrowLeft', ArrowLeft)
}

export default {
  ...DefaultTheme,
  async enhanceApp(ctx: any) {
    DefaultTheme.enhanceApp(ctx)
    useElementPlusComps(ctx.app)
  }
}

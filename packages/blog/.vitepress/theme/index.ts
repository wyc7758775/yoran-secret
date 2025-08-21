import DefaultTheme from 'vitepress/theme'
import './main.css'
// 全局导入 UnoCSS，确保在所有页面生效
import 'virtual:uno.css'

// 只保留必要的自定义 CSS，移除 Element Plus 相关配置

export default {
  ...DefaultTheme,
  async enhanceApp(ctx: any) {
    DefaultTheme.enhanceApp(ctx)
  }
}

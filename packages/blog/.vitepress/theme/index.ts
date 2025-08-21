import DefaultTheme from 'vitepress/theme'
import './main.css'

// 只保留必要的自定义 CSS，移除 Element Plus 相关配置

export default {
  ...DefaultTheme,
  async enhanceApp(ctx: any) {
    DefaultTheme.enhanceApp(ctx)
    // 移除 Element Plus 组件和图标的注册
  }
}

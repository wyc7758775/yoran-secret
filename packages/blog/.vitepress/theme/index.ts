import DefaultTheme from 'vitepress/theme'
import 'element-plus/dist/index.css'
import './main.css'


export default {
  ...DefaultTheme,
  async enhanceApp(ctx: any) {
    DefaultTheme.enhanceApp(ctx)
  }
}

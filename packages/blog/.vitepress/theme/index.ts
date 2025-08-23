import DefaultTheme from 'vitepress/theme'
import './main.css'
import 'virtual:uno.css'

export default {
  ...DefaultTheme,
  async enhanceApp(ctx: any) {
    DefaultTheme.enhanceApp(ctx)
  }
}

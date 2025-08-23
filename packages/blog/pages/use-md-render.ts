import MarkdownIt from "markdown-it";
import hljs from "markdown-it-highlightjs";
import "github-markdown-css";

// 创建一个函数来动态加载高亮样式
function loadHighlightStyle(isDark: boolean) {
  // 确保只在客户端环境执行
  if (typeof document === 'undefined') return;

  // 清除现有的高亮样式
  const existingStyle = document.getElementById('highlight-style');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // 创建新的样式元素
  const style = document.createElement('link');
  style.id = 'highlight-style';
  style.rel = 'stylesheet';
  // 根据主题选择不同的样式
  style.href = isDark 
    ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css'
    : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-light.min.css';
  document.head.appendChild(style);
}

// 初始化 MarkdownIt 实例（这部分可以在服务器端执行）
const md: ReturnType<typeof MarkdownIt> = new MarkdownIt({
  html: true, // 允许 HTML 标签（仅信任内容时启用）
  linkify: true, // 自动转换链接
  typographer: true, // 优化排版
  highlight: (str: string, lang: string) => {
    if (lang && (hljs as any).getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          (hljs as any).highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
}).use(hljs);

// 监听主题变化
let themeChangeListener: (mutations: MutationRecord[]) => void;

// 创建一个 composable 函数来提供主题感知的渲染功能
export default function useMdRender() {
  // 只在客户端环境初始化主题监听
  if (typeof document !== 'undefined' && !themeChangeListener) {
    // 初始化时加载默认主题样式
    const isDark = document.documentElement.classList.contains('dark');
    loadHighlightStyle(isDark);

    themeChangeListener = (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          loadHighlightStyle(isDark);
        }
      });
    };
    
    // 添加 MutationObserver 来监听主题变化
    const observer = new MutationObserver(themeChangeListener);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
  
  const mdRender = (markdownContent: string) => {
    return (md as any).render(markdownContent);
  }
  
  return {
    mdRender
  }
}
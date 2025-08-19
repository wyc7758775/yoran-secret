import MarkdownIt from "markdown-it";
import hljs from "markdown-it-highlightjs";
import "github-markdown-css"; // GitHub 风格样式
import "highlight.js/styles/atom-one-light.css"; // 代码高亮主题

const md = new MarkdownIt({
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

export default function useMdRender() {
  const mdRender = (markdownContent: string) => {
    return (md as any).render(markdownContent);
  }
  return {
    mdRender
  }
}

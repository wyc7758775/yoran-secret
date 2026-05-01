# Change: 优化 Markdown 文章图片加载体验

## Why
当前博客中 Markdown 文章内的图片通过 `markdown-it` 渲染为原生 `<img>` 标签。由于浏览器无法预先获知图片尺寸，图片加载时采用从上到下的渐进式渲染，导致下方内容被向下推移，产生明显的布局偏移（CLS）。这影响了阅读体验的流畅性。

## What Changes
- 修改 `packages/blog/pages/use-md-render.ts` 中的 `markdown-it` 图片渲染规则，将 `<img>` 包装在带特定 class 的容器中
- 在 `packages/blog/.vitepress/theme/main.css` 中添加图片占位与模糊过渡的 CSS 动画
- 在 `packages/blog/pages/ObserverDetail.vue` 中添加图片 `load` 事件监听，加载完成后触发清晰过渡
- 确保 Gallery.vue 和 Observing.vue 中的图片不受影响（仅聚焦 Markdown 文章内图片）

## Impact
- Affected specs: `markdown-image-rendering`
- Affected code:
  - `packages/blog/pages/use-md-render.ts`
  - `packages/blog/.vitepress/theme/main.css`
  - `packages/blog/pages/ObserverDetail.vue`

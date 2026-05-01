# Project: Yoran Blog

## Overview
基于 VitePress 的个人博客站点，使用 pnpm workspace 管理。核心包为 `packages/blog`。

## Module Boundaries
- `packages/blog/.vitepress/theme/` — 主题样式和布局
- `packages/blog/.vitepress/plugins/` — 构建期插件和运行时工具
- `packages/blog/pages/` — 自定义 Vue 页面组件
- `packages/blog/posts/` — 技术博客 Markdown 文章
- `packages/blog/life/` — 生活随笔 Markdown 文章

## Key Conventions
- Markdown 文章中的图片通过 `markdown-it` 渲染为原生 `<img>` 标签
- `ObserverDetail.vue` 使用 `v-html` 输出渲染后的 Markdown 内容
- 样式覆盖集中在 `.vitepress/theme/main.css`
- 构建插件使用 CommonJS，运行时代码使用 ESM

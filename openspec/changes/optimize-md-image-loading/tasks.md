## 1. Implementation
- [x] 1.1 修改 `use-md-render.ts`，自定义 markdown-it image token 渲染规则，输出带 `.md-img-wrapper` 容器和 `.md-img` 类的图片结构
- [x] 1.2 在 `main.css` 中添加 `.md-img-wrapper` 占位样式和 `.md-img` 模糊到清晰的过渡动画
- [x] 1.3 在 `ObserverDetail.vue` 中为渲染后的 Markdown 内容中的图片绑定 `load` 事件，加载完成后添加 `.loaded` 类
- [ ] 1.4 验证效果：确认图片加载前预占空间、无内容跳动，加载过程有模糊到清晰的平滑过渡

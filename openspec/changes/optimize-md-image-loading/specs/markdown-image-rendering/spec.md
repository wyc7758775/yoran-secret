## MODIFIED Requirements

### Requirement: Markdown 文章图片渲染
系统 SHALL 正确渲染 Markdown 文章中的图片，确保视觉体验流畅，避免布局偏移。

#### Scenario: 用户阅读包含图片的 Markdown 文章
- **WHEN** 用户打开一篇包含图片的 Markdown 文章
- **THEN** 图片在加载前应预占最小高度空间（背景色占位），避免内容向下跳动
- **AND** 图片初始状态为模糊（`filter: blur(10px)`）且略带放大（`scale(1.02)`）
- **AND** 图片加载完成后应在 500ms 内平滑过渡到清晰状态（`filter: blur(0)`、`scale(1)`、`opacity: 1`）
- **AND** 过渡完成后图片应显示其自然尺寸
- **AND** 图片容器应占满文章宽度（`width: 100%`），并带有圆角（`border-radius: 8px`）

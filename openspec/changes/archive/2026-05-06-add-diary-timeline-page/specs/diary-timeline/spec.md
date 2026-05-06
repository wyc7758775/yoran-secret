## ADDED Requirements

### Requirement: 日记本数据源管理
系统 SHALL 提供独立的 `diary/` 目录用于存放日记类 Markdown 文章，与 `life/` 数据源完全分离。

#### Scenario: 构建时扫描 diary 目录
- **WHEN** 执行 `pnpm run blog:diary`
- **THEN** 构建插件 SHALL 扫描 `packages/blog/diary/` 目录下的所有 `.md` 文件
- **AND** 提取每篇文章的 `caption`（文件名）、`firstImage`（第一张图片）、`previewText`（正文纯文本前200字符）、`createTime`（格式化日期）、`src`（文章路径）
- **AND** 输出到 `packages/blog/.vitepress/router/diary.js`

### Requirement: 时间轴聊天气泡列表页
系统 SHALL 提供 `/diary` 页面，以时间轴 + 聊天气泡卡片的形式展示日记文章列表。

#### Scenario: 桌面端时间轴布局
- **WHEN** 用户在桌面端访问 `/diary`
- **THEN** 页面 SHALL 显示中间竖线时间轴，日期节点居中
- **AND** 卡片在竖线两侧交替排列（一左一右）
- **AND** 每张卡片以聊天气泡样式呈现：圆角背景、阴影、包含文章图片、标题和预览文字
- **AND** 点击卡片 SHALL 跳转到文章详情页

#### Scenario: 移动端适配
- **WHEN** 用户在移动端（< 768px）访问 `/diary`
- **THEN** 时间轴 SHALL 移至左侧
- **AND** 卡片 SHALL 单列排列，全部位于时间轴右侧
- **AND** 卡片内容和交互功能保持完整

### Requirement: 文章详情页（无目录）
系统 SHALL 提供 `/diary-detail` 页面用于展示单篇日记文章全文，样式与 Observer 文章详情一致，但不显示目录侧边栏。

#### Scenario: 查看日记详情
- **WHEN** 用户点击日记卡片或访问 `/diary-detail?src=<文章路径>`
- **THEN** 页面 SHALL 渲染 Markdown 文章全文，使用 `markdown-it` + `highlight.js` 渲染
- **AND** 图片 SHALL 支持点击放大查看
- **AND** 页面 SHALL 显示 Giscus 评论
- **AND** 页面 SHALL 不包含目录侧边栏（TOC）
- **AND** 页面 SHALL 包含回到顶部按钮
- **AND** 加载过程中 SHALL 显示骨架屏

### Requirement: 导航入口
系统 SHALL 在顶部导航栏提供 Diary 入口，使用户可以快速访问日记本页面。

#### Scenario: 点击导航进入日记本
- **WHEN** 用户点击顶部导航栏的 "Diary"
- **THEN** 页面 SHALL 导航到 `/diary`

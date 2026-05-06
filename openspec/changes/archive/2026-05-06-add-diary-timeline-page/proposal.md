# Change: 添加日记本时间轴页面

## Why

博客现有 Observer 页面以列表/网格形式展示生活随笔（life/），用户希望新增一个完全独立的"日记本"入口，数据源与 life/ 分开管理。以时间轴 + 聊天气泡的形式呈现每日碎碎念和总结，增强日记感的浏览体验。

## What Changes

- 新建 `packages/blog/diary/` 目录作为独立数据源，存放日记类 Markdown 文章
- 新建 `build-diary-plugin.js` 构建插件，扫描 `diary/` 生成 `diary.js` 路由数据
- 新增 `previewText` 字段，提取文章正文纯文本预览
- 新建 `Diary.vue` 时间轴列表页：中间竖线、左右交替聊天气泡卡片
- 新建 `DiaryDetail.vue` 详情页：复用 ObserverDetail 样式，去掉目录侧边栏
- 新增 Diary 导航入口和相关页面路由

## Impact

- Affected specs: `diary-timeline`（新增 capability）
- Affected code:
  - `packages/blog/.vitepress/plugins/build-diary-plugin.js`（新增）
  - `packages/blog/.vitepress/router/diary.js`（新增）
  - `packages/blog/.vitepress/config.mts`
  - `packages/blog/pages/Diary.vue`（新增）
  - `packages/blog/pages/DiaryDetail.vue`（新增）
  - `packages/blog/diary.md`（新增）
  - `packages/blog/diary-detail.md`（新增）
  - `packages/blog/diary/`（新增）
  - `package.json`

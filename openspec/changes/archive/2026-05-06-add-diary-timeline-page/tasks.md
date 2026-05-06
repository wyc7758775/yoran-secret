## 1. Implementation

- [x] 1.1 新建 `packages/blog/diary/` 空目录
- [x] 1.2 新建 `build-diary-plugin.js`，复用 build-life-plugin.js 核心逻辑，扫描 `diary/` 生成 `diary.js`
- [x] 1.3 修改根 `package.json` 添加 `blog:diary` 脚本
- [x] 1.4 运行 `pnpm run blog:diary` 生成初始 `diary.js`
- [x] 1.5 新建 `packages/blog/pages/Diary.vue` 时间轴聊天气泡列表页
- [x] 1.6 新建 `packages/blog/pages/DiaryDetail.vue` 无目录详情页
- [x] 1.7 新建 `packages/blog/diary.md` 和 `diary-detail.md` 入口文件
- [x] 1.8 修改 `config.mts` 导航栏添加 Diary 入口
- [x] 1.9 在 `diary/` 下放置一篇测试文章，重新生成数据
- [x] 1.10 浏览器验证：时间轴渲染、卡片样式、跳转详情、暗色模式、移动端

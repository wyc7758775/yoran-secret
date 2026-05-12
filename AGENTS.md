# AGENTS.md

> 本文件面向 AI 编程助手。如果你正在阅读此文件，说明你对本项目一无所知。以下信息均基于项目实际内容，请勿假设。

---

## 项目概览

本项目是一个基于 **pnpm workspace** 的前端 monorepo，名为 `font-end`，包含以下三个子包：

| 包路径 | 包名 | 说明 |
|--------|------|------|
| `packages/blog` | `yoran-blog` | 基于 VitePress 的个人博客站点，是项目核心产出 |
| `packages/vue-study` | `study-vue3-api` | Vue 3 + TypeScript + Vite 的 API 学习演示项目 |
| `packages/plugin-rss` | `plugin-rss` | 为博客生成 RSS 订阅源的自定义 VitePress 插件 |

博客站点由 GitHub Actions 自动构建并部署到 GitHub Pages（`gh-pages` 分支）。

---

## 技术栈

- **包管理器**: pnpm 9.2.0（workspace 模式）
- **运行时**: Node.js 24.3.0
- **博客框架**: VitePress `^2.0.0-alpha.12`
- **前端框架**: Vue `^3.5.13`
- **构建工具**: Vite `^6.2.0`
- **语言**: TypeScript `~5.7.3`
- **UI 组件库**: Element Plus `^2.9.6`
- **CSS 工具**: UnoCSS `^66.4.1`（使用 `presetUno` + `presetAttributify`）
- **图标**: `@element-plus/icons-vue`
- **RSS 生成**: `feed` `^5.1.0`
- **Frontmatter 解析**: `gray-matter` `^4.0.3`
- **代码规范**: ESLint 9.x，根目录使用 `@antfu/eslint-config`（支持 Vue + TypeScript）

---

## 目录结构

```
.
├── package.json              # 根 package.json，仅定义 workspace 脚本和公共依赖
├── pnpm-workspace.yaml       # pnpm workspace 配置：packages/*
├── tsconfig.json             # 根 TypeScript 配置（ES2020, ESNext, strict）
├── eslint.config.mjs         # 根 ESLint 配置（Antfu 配置）
├── global.d.ts               # 全局类型声明
├── packages/
│   ├── blog/                 # VitePress 博客
│   │   ├── .vitepress/
│   │   │   ├── config.mts        # VitePress 主配置
│   │   │   ├── configHead.ts     # <head> 标签注入（CDN、字体、referrer 等）
│   │   │   ├── theme/
│   │   │   │   ├── index.ts      # 自定义主题入口（继承 DefaultTheme）
│   │   │   │   └── main.css      # 自定义样式（覆盖 VitePress / Element Plus）
│   │   │   ├── plugins/          # 构建期 Node.js 脚本（CommonJS）
│   │   │   │   ├── build-sidebar-plugin.js      # 扫描 posts/ 生成 sidebar.json
│   │   │   │   ├── build-gallery-plugin.js      # 扫描 assets/gallery/ 生成 gallery.js
│   │   │   │   ├── build-observer-plugin.js     # 扫描 observer/ 生成 observer.js
│   │   │   │   ├── build-video-cover-plugin.js  # 调用 B 站 API 生成视频封面数据
│   │   │   │   ├── import-images.ts             # Vite glob 导入 gallery 图片
│   │   │   │   └── resolve-image-url.ts         # 图片路径处理工具
│   │   │   ├── router/           # 构建插件生成的路由数据（需提交到仓库）
│   │   │   │   ├── sidebar.json
│   │   │   │   ├── gallery.js
│   │   │   │   ├── observer.js
│   │   │   │   ├── video.js
│   │   │   │   └── video-cover.js
│   │   │   └── unocss.config.ts  # UnoCSS 配置（shortcuts、presets）
│   │   ├── pages/                # 自定义 Vue 页面组件（Home、Gallery、Observing 等）
│   │   ├── posts/                # 技术博客 Markdown 文章（按目录分类）
│   │   ├── observer/             # 观察、复盘、读书、生活随笔 Markdown 文章
│   │   ├── diary/                # 日记本 Markdown 文章（时间轴页面数据源）
│   │   ├── assets/               # 静态资源（gallery 图片、posts 图片）
│   │   ├── public/               # VitePress public 目录（profile.svg 等）
│   │   └── index.md              # 博客首页（引入 Home.vue）
│   ├── vue-study/              # Vue 3 API 学习项目
│   │   ├── src/
│   │   │   ├── main.ts           # 应用入口
│   │   │   ├── App.vue           # 根组件（切换 API 示例 / 文件预览）
│   │   │   ├── components/       # 按类别组织的 Vue 3 API 演示组件
│   │   │   │   ├── 响应式API/、进阶性API/、内置指令/、内置组件/
│   │   │   │   ├── 依赖注入/、生命周期钩子 API.vue、虚拟滚动.vue 等
│   │   │   ├── hooks/            # 自定义 composables / hooks
│   │   │   └── assets/           # 图标等静态资源
│   │   ├── vite.config.ts        # Vite 配置（Vue + Vue DevTools）
│   │   ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│   │   └── .eslintrc.js          # 独立 ESLint 配置（Vue3 + TS + 无分号规则）
│   └── plugin-rss/             # RSS 插件
│       ├── index.ts              # 主插件实现（ESM，生成 rss.xml）
│       └── package.json          # type: "module"
└── .github/workflows/deploy.yml    # GitHub Actions 部署流水线
```

---

## 构建与开发命令

所有命令均在**项目根目录**执行，通过 `pnpm run -C <package>` 透传：

```bash
# 安装依赖
pnpm install

# --- 博客相关 ---
pnpm run blog:dev          # 启动 VitePress 开发服务器
pnpm run blog:build        # 构建博客（输出到 packages/blog/.vitepress/dist）
pnpm run blog:router       # 运行 sidebar 构建插件（扫描 posts/ 生成 sidebar.json）
pnpm run blog:gallery      # 运行 gallery 构建插件（扫描 assets/gallery/ 生成 gallery.js）
pnpm run blog:observer     # 运行 Observer 构建插件（扫描 observer/ 生成 observer.js）
pnpm run blog:life         # 兼容别名，等同于 blog:observer
pnpm run blog:diary        # 运行 diary 构建插件（扫描 diary/ 生成 diary.js）
pnpm run blog:video:cover  # 运行视频封面构建插件（调用 B 站 API 生成 video-cover.js）
pnpm run blog:plugin       # 依次执行以上全部插件（router + gallery + observer + diary + video:cover）

# --- Vue Study 相关 ---
pnpm run vs:dev            # 启动 Vue Study 开发服务器（Vite）

# --- 代码规范 ---
# 根目录 ESLint（博客包内也可直接运行 npm run lint）
npx eslint .               # 检查整个工作区
```

> **重要**：在构建博客之前，必须先运行 `pnpm run blog:plugin` 生成最新的路由数据文件，否则 sidebar、gallery、observer 等页面可能显示旧数据。

---

## 部署流程

通过 `.github/workflows/deploy.yml` 自动化部署：

1. 触发条件：`main` 分支的 `push`
2. 使用 pnpm 9.2.0 + Node.js 24.3.0
3. 执行 `pnpm install`
4. 执行 `pnpm run blog:plugin` 生成路由数据
5. 执行 `pnpm run blog:build` 构建静态站点
6. 使用 `peaceiris/actions-gh-pages@v3` 将 `packages/blog/.vitepress/dist` 部署到 `gh-pages` 分支

部署目标地址：`https://wyc7758775.github.io/yoran-secret/`

---

## 代码组织约定

### 博客 (`packages/blog`)

- **文章管理**：技术资料放在 `posts/<分类>/` 下；观点、复盘、读书和生活随笔放在 `observer/` 下，均为 Markdown 格式。
- **路由生成**：sidebar 不是手写维护的，而是通过 `build-sidebar-plugin.js` 扫描 `posts/` 目录自动生成 `sidebar.json`。
- **自定义页面**：首页 (`index.md`)、图库页 (`gallery.md`)、观察者页 (`observing.md`) 均使用 VitePress 的 `layout` frontmatter，并在 Markdown 中嵌入自定义 Vue 组件（`pages/*.vue`）。
- **样式策略**：
  - 使用 UnoCSS 原子类（`virtual:uno.css`）
  - 在 `.vitepress/theme/main.css` 中覆盖 VitePress 默认样式和 Element Plus 样式
  - `:root { font-size: 13px; }` 设置了全局基准字号
- **图片处理**：
  - gallery 图片存放在 `assets/gallery/`
  - 存在 `import-images.ts` 使用 `import.meta.glob` 做静态导入，以便 Vite 正确打包
  - `resolve-image-url.ts` 处理路径拼接，兼容 `base` 路径
  - **Obsidian 同步注意**：从 Obsidian 同步笔记到 `observer/` 时，笔记中的本地图片必须放在 `public/obsidian-sync/<文章名>/` 目录下，并在 Markdown 中使用 `/obsidian-sync/<文章名>/图片名.png` 的绝对路径引用。**禁止**在 Markdown 中直接写 `/yoran-secret/obsidian-sync/...`（会导致 VitePress 构建时 Rollup 解析失败）。VitePress 会自动在编译时为 `/obsidian-sync/...` 加上 `base` 路径。同步后必须执行 `pnpm run blog:observer` 重新生成 `observer.js`。

### Vue Study (`packages/vue-study`)

- 标准 Vite + Vue 3 项目结构。
- 组件按功能分类存放，目录名使用中文（如 `响应式API`、`进阶性API`、`内置指令`、`内置组件`、`依赖注入`）。
- `index.vue` 是主要的 API 示例汇总页，使用 `ElTabs` + `ElCollapse` 组织。
- 没有使用 Vue Router，仅在 `App.vue` 中通过 `v-if` 切换两个视图（API 示例 / 文件预览）。

### RSS 插件 (`packages/plugin-rss`)

- 独立的 ESM 包（`type: "module"`）。
- 在 VitePress 构建的 `generateBundle` 阶段扫描 `posts/` 目录的 Markdown 文件，解析 frontmatter，生成 `rss.xml` 并注入到输出 bundle。

---

## 代码风格指南

- **语言**：项目内注释、文档、脚本输出以**中文**为主。
- **分号**：`vue-study` 包内 ESLint 强制**不使用分号**（`semi: ['error', 'never']`）。
- **模块格式**：
  - 根目录和 `plugin-rss` 使用 ESM。
  - `packages/blog` 的 `package.json` 显式设置 `"type": "commonjs"`，因此其构建插件使用 CommonJS（`require`）。
- **TypeScript**：
  - 严格模式开启（`strict: true`）
  - `vue-study` 额外开启 `noUnusedLocals`、`noUnusedParameters` 等严格检查
- **ESLint 范围**：
  - 根目录 `eslint.config.mjs` 使用 `@antfu/eslint-config`，忽略 `**/*.d.ts`、`dist/`、`node_modules/`。
  - `vue-study` 保留独立的 `.eslintrc.js`（Vue3 + TS 推荐规则）。

---

## 测试策略

**当前项目中没有任何测试。**

- 根 `package.json` 的 `test` 脚本仅为占位符：`echo "Error: no test specified" && exit 1`
- 两个子包的 `test` 脚本也是同样的占位符。
- 质量保障完全依赖 ESLint 和 TypeScript 编译检查。

---

## 安全与注意事项

1. **绝对路径硬编码**：`packages/blog/.vitepress/config.mts` 中 `resolve.alias['@assets']` 硬编码了开发者本机的绝对路径 `/Users/wuyucun/programmer/font-end/packages/blog/assets`。这会导致在其他机器或 CI 环境下构建失败。
2. **CDN 依赖**：博客通过 CDN（jsdelivr、unpkg）加载 Element Plus 及其图标库，以及 Google Fonts。若 CDN 不可用，样式和功能将受影响。
3. **B 站 API 调用**：`build-video-cover-plugin.js` 在构建时会调用第三方 API（`apiv2.magecorn.com`）获取 B 站视频封面。该 API 的稳定性不受项目控制，且构建时会发起外部网络请求。
4. **无环境变量管理**：`.gitignore` 中忽略了 `.env` 文件，但项目中并未使用任何环境变量文件，配置均硬编码在源码中（如站点 URL、邮箱、API 地址）。
5. **XSS 注意**：`vue-study` 中有 `v-html-xss-demo.vue` 组件，专门演示 `v-html` 的 XSS 风险，说明开发者有意识关注此问题。

---

## 关键配置文件速查

| 文件 | 作用 |
|------|------|
| `pnpm-workspace.yaml` | 定义 workspace：`- "packages/*"` |
| `packages/blog/.vitepress/config.mts` | VitePress 站点配置、导航、vite 插件（UnoCSS、RSS） |
| `packages/blog/.vitepress/configHead.ts` | HTML `<head>` 注入：favicon、CDN 样式/脚本、字体、referrer |
| `packages/blog/.vitepress/unocss.config.ts` | UnoCSS shortcuts 和 presets |
| `packages/vue-study/vite.config.ts` | Vite 配置：Vue 插件 + Vue DevTools |
| `.github/workflows/deploy.yml` | CI/CD：构建 + 部署到 GitHub Pages |

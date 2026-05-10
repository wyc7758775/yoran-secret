# 附件：Smart Commit Skill 完整内容

这是《AI Coding 时代，失效的不是 Git，而是 Git 工作流》的附件页。

它不出现在博客菜单里，只能通过文章里的附件链接，或者直接访问当前路由打开。

````md
---
name: smart-commit
description: 智能分析 git diff，根据业务意图将更改分为多个 commit，生成简洁 commit message，并在推送后输出面向人类阅读的 Change Report。
voice:
  - 上传当前代码到远程仓库
  - 智能提交代码
  - 分批提交更改
  - 创建 PR
  - smart commit pr
  - smart commit
license: MIT
metadata:
  author: user
  version: "2.0.0"
---

# Smart Commit

此 skill 帮助代理智能地将代码更改分批提交，并把一次推送的业务意图、变更范围、验证结果和风险集中成一份 Change Report。

**重要：执行此 skill 时，直接分析、提交并推送，无需询问用户确认。**

默认行为：
- 如果当前分支是 `main` / `master` / `release`，自动进入 PR 模式，先创建 `codex/<简短任务名>` 分支
- 如果当前分支已经是功能分支，则提交并推送当前分支
- 若用户提到 `PR`、`Pull Request`、`创建 PR`、`走 PR 流程`，无论当前在哪个分支，都进入 PR 模式
- 只有用户明确要求“直接推当前分支”时，才跳过 PR 模式

## 工作流程

### 1. 获取当前更改
- 检查 git 状态：`git status`
- 获取完整差异：`git diff`（工作树）和 `git diff --staged`（已暂存）
- 识别未跟踪文件；明显的临时目录或构建产物（如 `tmp/`、`dist/`、`.vitepress/dist/`、`node_modules/`）不要自动加入提交
- 如果有未暂存的有效更改，自动暂存相关文件

### 2. 分析更改内容

分析文件变更，优先按**业务意图**分组，其次才按文件或技术类型分组。常见分组维度：
- **业务意图**：这组变更在解决同一个用户问题、产品问题或工程问题
- **功能模块**：相同功能模块的文件分为一组
- **变更类型**：
  - ✨ 新功能 (feat)
  - 🐛 修复 bug (fix)
  - 📝 文档 (docs)
  - 🎨 样式 (style)
  - ♻️ 重构 (refactor)
  - ⚡ 性能 (perf)
  - ✅ 测试 (test)
  - 🔧 构建/工具 (chore)
  - 🚀 部署 (deploy)
  - 💄 `ui` - UI 样式更新
- **文件关联**：具有依赖关系的文件应放在一起

分组时同时记录每组的：
- `Intent`：为什么要改
- `Change Set`：实际改了什么
- `Validation`：应该如何验证，或已经执行了什么验证
- `Risk`：可能影响哪里

### 3. 生成 Commit Messages

commit message 保持短小、可扫读，不要把完整业务意图塞进每一条 commit。完整说明放到最后的 Change Report。

使用以下格式：

```
<图标> <类型>(<范围>): <简短描述>

Change-Set: <本组变更的短标识，可选>
```

常用图标与类型映射：
- ✨ `feat` - 新功能
- 🐛 `fix` - 修复 bug
- 📝 `docs` - 文档
- 🎨 `style` - 样式（不影响功能）
- ♻️ `refactor` - 重构（既不是新功能也不是修复）
- ⚡ `perf` - 性能优化
- ✅ `test` - 测试
- 🔧 `chore` - 构建过程或辅助工具变动
- 🚀 `deploy` - 部署
- 💄 `ui` - UI 样式更新

### 4. 执行分批提交（全自动）

对于每个分组：
1. 添加相关文件：`git add <files>`
2. 创建提交：`git commit -m "<message>"`
3. 继续下一个分组

### 5. 推送到远程

所有 commit 创建完成后：
1. 获取当前分支名：`git branch --show-current`
2. 直接推送到远程：`git push origin <branch-name>`
3. 输出 Change Report，而不是只输出 commit 列表

### 5B. PR 模式

当用户要求走 PR 流程时：
1. 检查当前分支；如果在 `main` / `master` / `release` 上，先创建新分支，分支名使用 `codex/<简短任务名>`
2. 分批提交后推送新分支：`git push -u origin <branch-name>`
3. 生成 Change Report 作为 PR body
4. 如果本机安装了 GitHub CLI、已登录，并且当前登录账号明确就是目标仓库账号，执行：
   `gh pr create --base main --head <branch-name> --title "<简短标题>" --body-file <临时 PR 描述文件>`
5. 如果没有 `gh`、`gh` 未登录，或用户存在多个 GitHub 账号导致当前登录身份不确定，不要要求用户登录，也不要卡住流程。直接输出 GitHub Compare URL、PR title 和完整 PR body，并明确告诉用户：
   - PR title 填到 GitHub 的标题输入框
   - PR body / Change Report 粘贴到 GitHub 的 description 输入框
   - 这不是让用户自己构思内容，只是因为当前环境无法自动写入 GitHub PR 表单
6. 如果可以操作浏览器页面，并且用户已经打开 GitHub 创建 PR 页面，优先自动把 PR title 和 PR body 填进网页表单；不能自动填写时，必须给出一段完整、可复制的粘贴包

PR title 使用本次变更的整体意图，不要简单复用某一条 commit message。

### 6. 输出 Change Report

每次 smart commit 完成后，必须在最终回复中输出一份面向人类阅读的 Change Report。它是本次推送的真正审阅入口。

格式：

```
Change Report

Intent:
本次推送整体想解决什么问题。

Change Set:
- 按业务意图列出本次推送包含的几组变更
- 每组说明影响的模块和关键文件

Validation:
- 已执行的验证命令及结果
- 未执行的验证需要说明原因

Risk:
- 可能受影响的功能
- 需要人工重点看的地方

Commits:
- <hash> <message>
```

原则：
- 人应该主要看 Change Report，不需要逐条阅读十几条 commit
- commit 是代码账本，Change Report 是协作说明书
- 如果用户要开 PR，Change Report 可以直接作为 PR 描述草稿
- PR 模式下，Change Report 必须进入 PR 描述；最终回复中同时给出 PR URL 或 Compare URL

## 重要约束

- **全自动执行**：无需用户确认，直接分析、提交、推送
- **保护主分支**：默认不要直接向 `main` / `master` / `release` 推送；先创建功能分支，再走 PR
- **每次只处理一个分组**：按顺序处理每个分组
- **不要合并不相关的更改**：如果某些更改不属于任何逻辑分组，单独处理
- **不要提交临时文件**：未跟踪的临时目录、构建产物和缓存文件默认忽略
- **原子性提交**：每个 commit 应该只包含一个逻辑变更
- **清晰的描述**：commit 描述应该简洁，Change Report 承载完整上下文
- **避免形式主义**：不要为每条 commit 编写冗长模板；超过 3 条 commit 时，更要把意图汇总到 Change Report

## 示例

假设有以下更改：
- `src/app/page.tsx` - 添加新功能组件
- `src/app/lib/utils.ts` - 添加新工具函数
- `README.md` - 更新文档
- `src/styles/globals.css` - 样式调整

分析后直接执行：
1. `git add src/app/page.tsx src/app/lib/utils.ts && git commit -m "✨ feat(app): 添加新功能"`
2. `git add README.md && git commit -m "📝 docs: 更新 README"`
3. `git add src/styles/globals.css && git commit -m "🎨 style: 调整全局样式"`
4. `git push origin main`
5. 输出：

```
Change Report

Intent:
完成应用新功能的最小可用实现，并补齐使用说明和样式表现。

Change Set:
- app 功能：新增页面组件和工具函数
- docs：更新 README
- style：调整全局样式

Validation:
- 未执行自动化验证；当前任务仅完成提交推送

Risk:
- 新工具函数调用方较少，重点检查边界输入
- 全局样式可能影响其他页面

Commits:
- <hash> ✨ feat(app): 添加新功能
- <hash> 📝 docs: 更新 README
- <hash> 🎨 style: 调整全局样式
```

````

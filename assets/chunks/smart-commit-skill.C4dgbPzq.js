const n=`# Smart Commit Skill

这是我在 zettlab-mini-nas 项目里沉淀出来的提交与 PR 工作流 skill。它解决的不是“怎么写 git 命令”，而是 AI 代理在真实项目里如何把改动拆清楚、验证讲清楚、推送后把协作上下文交代完整。

## 使用场景

- 一次任务改动横跨多个模块，需要按业务意图拆成多条 commit。
- 工作区里同时存在根仓库和子仓库，需要分仓库提交、分仓库写 PR 标题和描述。
- 提交前需要把临时验证文件、构建产物、本地诊断脚本排除在业务 diff 之外。
- Zettlab App 这类有固定 PR 模板、自检项、fingerprint 检查和发版通道判断的项目。
- 需要代理自己完成提交、推送、PR 描述整理、Reviewer message，而不是只把命令丢回给人。

## 存在价值

Smart Commit 把“提交代码”升级成一次可审阅的交付。它会先理解 diff 背后的业务意图，再决定怎么分组、怎么命名 commit、怎么写 Change Report。这样人看到的不是零散提交，而是一份包含 Intent、Change Set、Validation、Risk 和 Commits 的协作说明。

它的价值主要有三点：

1. 降低 AI 代理误提交的风险：临时文件、缓存、无关改动默认不进提交。
2. 保住仓库协作规范：多仓库边界、PR 模板、App 自检、fingerprint 这些规则被写进流程里。
3. 减少人工收尾成本：推送后直接得到可以放进 PR 或同步给 reviewer 的 Change Report。

## 完整 Skill 内容

\`\`\`\`md
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
  version: "2.1.3"
---

# Smart Commit

此 skill 帮助代理智能地将代码更改分批提交，并把一次推送的业务意图、变更范围、验证结果和风险集中成一份 Change Report。

**重要：执行此 skill 时，直接分析、提交并推送，无需询问用户确认。**

默认行为：
- 如果当前分支是 \`main\` / \`master\` / \`release\`，自动进入 PR 模式，先创建 \`codex/<简短任务名>\` 分支
- 如果当前分支已经是功能分支，则提交并推送当前分支
- 若用户提到 \`PR\`、\`Pull Request\`、\`创建 PR\`、\`走 PR 流程\`，无论当前在哪个分支，都进入 PR 模式
- 只有用户明确要求“直接推当前分支”时，才跳过 PR 模式

## 多仓库工作区模式

当用户要求“各个仓库提交到远程 feat 分支”“多仓库提交”“汇总 PR 描述”或类似任务时，按多仓库工作区模式执行：

1. 先在当前工作区发现根仓库和一层子仓库：\`find . -maxdepth 2 -name .git -type d -prune\`
2. 对每个仓库分别执行 \`git status --short --branch\`，只提交有实际改动的仓库；干净仓库在最终表格里标记为“无改动，未提交”
3. 如果根仓库看到某个独立 Git 子仓库目录是未跟踪项，不要把它加入根仓库提交，避免误变成 gitlink/submodule
4. 对每个有改动的仓库独立分析 diff，按业务意图分批 \`git add\`、\`git diff --cached --check\`、\`git commit\`
5. 推送到该仓库当前的 feat 分支；如果当前已在 feat 分支，使用 \`git push origin <branch>\`；如果在主分支且有改动，先创建 \`codex/<简短任务名>\` 分支再推送
6. 最终必须输出一张多仓库汇总表，列出：仓库、分支、提交 hash、提交内容、验证、推送结果、剩余状态
7. 最终必须给出一份可直接粘贴到 PR description 的汇总描述，按仓库或业务意图组织，而不是只列 commit
8. 如果 \`gh\` 未登录或账号不确定，给 Compare URL 或 PR new URL + 完整 PR 描述，不要卡住发布流程
9. 如果是 Zettlab / Zelltab 公司项目，并且用户要“PR 链接 + 描述 + @人”的汇总，使用一行一个仓库的格式：\`<PR URL> <具体功能点列表> <@reviewer>\`。功能点要具体，不要压缩成泛称；例如 App 可写“头像上传、邮箱/手机号变更、登录设备管理、生物识别、OTA 红点、JPush 通知封装”。

## 产品 / 发版公告 PR 文案模式

当用户说明 PR “主要给产品看”、关联“自动发版的发布说明”、要求“产品语言”“更新公告怎么写”或类似语义时，PR 描述必须改用产品公告口吻：

- 使用 \`1. 2. 3.\` 的编号结构，每点是一个用户可感知的变化或产品能力，不写工程分组标题
- 每点标题用动词开头，例如“优化...”“提升...”“补充...”“支持...”
- 正文只讲用户体验、产品边界和发布价值，不写代码文件、接口、测试命令、commit、Validation、Risk、实现细节
- 如果需要附自动发版发布说明，单独给一段 1-2 句的短文案，可直接粘贴到发版系统
- 除非用户明确要求工程审阅版，否则不要在产品 PR 描述里放 \`Validation\` / \`Risk\` / \`Change Set\`

推荐格式：

\`\`\`md
## 本次更新

1. 优化「...」体验
   用一句产品语言说明用户会感受到什么改善。

2. 提升「...」稳定性
   说明在什么场景下体验更稳定、更清晰或更一致。

3. 补充「...」能力说明
   说明这为后续产品能力或发版节奏提供什么准备。

## 自动发版发布说明

用一到两句话概括本次用户可感知变化，不写技术验证和风险。
\`\`\`

## 工作流程

### 1. 获取当前更改
- 检查 git 状态：\`git status\`
- 获取完整差异：\`git diff\`（工作树）和 \`git diff --staged\`（已暂存）
- 识别未跟踪文件；明显的临时目录或构建产物（如 \`tmp/\`、\`dist/\`、\`.vitepress/dist/\`、\`node_modules/\`）不要自动加入提交
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
  - 💄 \`ui\` - UI 样式更新
- **文件关联**：具有依赖关系的文件应放在一起

分组时同时记录每组的：
- \`Intent\`：为什么要改
- \`Change Set\`：实际改了什么
- \`Validation\`：应该如何验证，或已经执行了什么验证
- \`Risk\`：可能影响哪里

### 3. 生成 Commit Messages

commit message 保持短小、可扫读，不要把完整业务意图塞进每一条 commit。完整说明放到最后的 Change Report。

使用以下格式：

\`\`\`
<图标> <类型>(<范围>): <简短描述>

Change-Set: <本组变更的短标识，可选>
\`\`\`

常用图标与类型映射：
- ✨ \`feat\` - 新功能
- 🐛 \`fix\` - 修复 bug
- 📝 \`docs\` - 文档
- 🎨 \`style\` - 样式（不影响功能）
- ♻️ \`refactor\` - 重构（既不是新功能也不是修复）
- ⚡ \`perf\` - 性能优化
- ✅ \`test\` - 测试
- 🔧 \`chore\` - 构建过程或辅助工具变动
- 🚀 \`deploy\` - 部署
- 💄 \`ui\` - UI 样式更新

### 4. 执行分批提交（全自动）

对于每个分组：
1. 添加相关文件：\`git add <files>\`
2. 创建提交：\`git commit -m "<message>"\`
3. 继续下一个分组

### 5. 推送到远程

所有 commit 创建完成后：
1. 获取当前分支名：\`git branch --show-current\`
2. 直接推送到远程：\`git push origin <branch-name>\`
3. 输出 Change Report，而不是只输出 commit 列表

### 5B. PR 模式

当用户要求走 PR 流程时：
1. 检查当前分支；如果在 \`main\` / \`master\` / \`release\` 上，先创建新分支，分支名使用 \`codex/<简短任务名>\`
2. 分批提交后推送新分支：\`git push -u origin <branch-name>\`
3. 生成 Change Report 作为 PR body
4. 如果本机安装了 GitHub CLI、已登录，并且当前登录账号明确就是目标仓库账号，执行：
   \`gh pr create --base main --head <branch-name> --title "<简短标题>" --body-file <临时 PR 描述文件>\`
5. 如果没有 \`gh\`、\`gh\` 未登录，或用户存在多个 GitHub 账号导致当前登录身份不确定，不要要求用户登录，也不要卡住流程。直接输出 GitHub Compare URL、PR title 和完整 PR body，并明确告诉用户：
   - PR title 填到 GitHub 的标题输入框
   - PR body / Change Report 粘贴到 GitHub 的 description 输入框
   - 这不是让用户自己构思内容，只是因为当前环境无法自动写入 GitHub PR 表单
6. 如果可以操作浏览器页面，并且用户已经打开 GitHub 创建 PR 页面，优先自动把 PR title 和 PR body 填进网页表单；不能自动填写时，必须给出一段完整、可复制的粘贴包

PR title 使用本次变更的整体意图，不要简单复用某一条 commit message。

### 5C. Zettlab / Zelltab 公司项目上传前 PR 粘贴包（强制）

本节只适用于 Zettlab / Zelltab 公司项目，例如仓库名、远程地址或工作区路径包含 \`zettlab\` / \`zelltab\`，或用户明确说明这是公司项目。非公司项目继续使用通用 Change Report / PR body，不强制注入本节的 reviewer message 或 App checklist。

在 Zettlab / Zelltab 公司项目中，每次推送 / 上传前，除非用户明确说“只提交不需要 PR 文案”，否则必须准备以下内容：

1. \`PR title\`：一句话说明整体业务目标
2. \`PR description\`：可直接粘贴到 GitHub description
3. \`Reviewer message\`：如果涉及多个仓库，按一行一个仓库输出 \`<PR URL> <具体功能点列表> <@reviewer>\`；如果 PR URL 查不到，给 Compare URL / PR new URL，并标注“待创建 PR”
4. \`Validation\`：列出已跑和未跑的检查，未跑必须说明原因
5. \`App checklist\`：只要涉及 \`zettlab-app\`，PR description 必须合并下面模板；没有涉及 App 时不强行添加

只要本次涉及 \`zettlab-app\`，提交 / 推送前必须实际运行：

\`\`\`bash
npx @expo/fingerprint fingerprint:generate | jq -r .hash
\`\`\`

然后读取 \`.expo-fingerprint\` 对比。\`PR description\` 的发版通道自检里必须写明 fingerprint 是否一致；如果不一致，不要只留下空 checkbox，要把生成值和仓库记录值写出来，并标注这次不能默认走 OTA，需要 release owner 判断是否走原生发版。

多仓库 PR 文案必须按仓库分开输出，不能把多个仓库合成一个总 PR title / description。每个有提交或需要开 PR 的仓库都要单独给：

\`\`\`md
<repo name>

PR title:
...

PR description:
...
\`\`\`

如果仓库已有 PR 模板或用户贴了 PR 模板，\`PR description\` 必须继承模板的固定段落和顺序，只把本次内容填进去；不要为了 Change Report 简化而删掉模板段落。对 \`zettlab-app\`，必须保留下面这些段落：

- \`## Summary\`
- \`## Linear\`
- \`## 本地自检（必填）\`
- \`## 国际化自检（涉及用户可见文案时必填）\`
- \`## 发版通道自检（必填）\`
- \`## Test plan\`

App PR checklist 模板：

\`\`\`md
## Summary
-

## Linear
<!-- ZET-xxx -->

## 本地自检（必填）

- [ ] 已运行 \`npm run quality:pr\`
- [ ] 如果本 PR 只改文档 / 注释 / 测试，已说明为什么不需要跑完整 App 自检：

## 国际化自检（涉及用户可见文案时必填）

- [ ] 本 PR 没有新增或修改用户可见文案
- [ ] 本 PR 新增 / 修改的用户可见文案已接入 i18n
- [ ] 已补齐 concrete language：\`zh-CN\`、\`zh-TW\`、\`en\`、\`ja\`、\`ko\`、\`de\`、\`fr\`、\`es\`、\`it\`
- [ ] React 组件内文案使用 \`useTranslation(namespace)\`；非 React 环境才使用 \`tr()\` / runtime i18n

新增 / 修改的 i18n key：

- 无

## 发版通道自检（必填）

> 这条 checklist 决定 PR 合并后走 **OTA 热更** 还是必须等 **新底包发版**。
> 详见 [.claude/skills/app-hot-update](.claude/skills/app-hot-update/SKILL.md) 和 [.claude/skills/app-release](.claude/skills/app-release/SKILL.md)。

- [ ] 我没有动 \`ios/\` / \`android/\` / \`Podfile*\` / \`patches/\`
- [ ] 我没有改 \`app.json\` / \`app.config.ts\` 的 \`plugins\` / \`ios.*\` / \`android.*\` / \`version\` / 权限描述
- [ ] 我没有新增 / 升级 \`package.json\` 里带原生代码的库（如 \`react-native-*\` / \`expo-*\` 模块）
- [ ] 我已经本地跑过 \`npx @expo/fingerprint fingerprint:generate | jq -r .hash\`，跟仓库根的 \`.expo-fingerprint\` 一致

**任意一条打 ❌ → 这次合并后必须打 \`v*.*.*\` tag 走原生发版**（mobile-ci.yml），不能依赖 OTA。

## Test plan
- [ ]
\`\`\`

### 6. 输出 Change Report

每次 smart commit 完成后，必须在最终回复中输出一份面向人类阅读的 Change Report。它是本次推送的真正审阅入口。

格式：

\`\`\`
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
\`\`\`

原则：
- 人应该主要看 Change Report，不需要逐条阅读十几条 commit
- commit 是代码账本，Change Report 是协作说明书
- 如果用户要开 PR，Change Report 可以直接作为 PR 描述草稿
- PR 模式下，Change Report 必须进入 PR 描述；最终回复中同时给出 PR URL 或 Compare URL

## 重要约束

- **全自动执行**：无需用户确认，直接分析、提交、推送
- **保护主分支**：默认不要直接向 \`main\` / \`master\` / \`release\` 推送；先创建功能分支，再走 PR
- **每次只处理一个分组**：按顺序处理每个分组
- **不要合并不相关的更改**：如果某些更改不属于任何逻辑分组，单独处理
- **不要提交临时文件**：未跟踪的临时目录、构建产物和缓存文件默认忽略
- **原子性提交**：每个 commit 应该只包含一个逻辑变更
- **清晰的描述**：commit 描述应该简洁，Change Report 承载完整上下文
- **避免形式主义**：不要为每条 commit 编写冗长模板；超过 3 条 commit 时，更要把意图汇总到 Change Report

## 示例

假设有以下更改：
- \`src/app/page.tsx\` - 添加新功能组件
- \`src/app/lib/utils.ts\` - 添加新工具函数
- \`README.md\` - 更新文档
- \`src/styles/globals.css\` - 样式调整

分析后直接执行：
1. \`git add src/app/page.tsx src/app/lib/utils.ts && git commit -m "✨ feat(app): 添加新功能"\`
2. \`git add README.md && git commit -m "📝 docs: 更新 README"\`
3. \`git add src/styles/globals.css && git commit -m "🎨 style: 调整全局样式"\`
4. \`git push origin main\`
5. 输出：

\`\`\`
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
\`\`\`
\`\`\`\`
`;export{n as default};

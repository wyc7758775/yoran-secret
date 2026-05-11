import{_ as i,c as a,o as n,af as l}from"./chunks/framework.CUUTeRCn.js";const r=JSON.parse('{"title":"附件：Smart Commit Skill 完整内容","description":"","frontmatter":{},"headers":[],"relativePath":"attachments/smart-commit-skill.md","filePath":"attachments/smart-commit-skill.md"}'),h={name:"attachments/smart-commit-skill.md"};function p(k,s,t,E,e,g){return n(),a("div",null,s[0]||(s[0]=[l(`<h1 id="附件-smart-commit-skill-完整内容" tabindex="-1">附件：Smart Commit Skill 完整内容 <a class="header-anchor" href="#附件-smart-commit-skill-完整内容" aria-label="Permalink to “附件：Smart Commit Skill 完整内容”">​</a></h1><p>这是《AI Coding 时代，失效的不是 Git，而是 Git 工作流》的附件页。</p><p>它不出现在博客菜单里，只能通过文章里的附件链接，或者直接访问当前路由打开。</p><div class="language-md"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">---</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">name: smart-commit</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">description: 智能分析 git diff，根据业务意图将更改分为多个 commit，生成简洁 commit message，并在推送后输出面向人类阅读的 Change Report。</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">voice:</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 上传当前代码到远程仓库</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 智能提交代码</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 分批提交更改</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 创建 PR</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> smart commit pr</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> smart commit</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">license: MIT</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">metadata:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  author: user</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  version: &quot;2.0.0&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">---</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;"># Smart Commit</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">此 skill 帮助代理智能地将代码更改分批提交，并把一次推送的业务意图、变更范围、验证结果和风险集中成一份 Change Report。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**重要：执行此 skill 时，直接分析、提交并推送，无需询问用户确认。**</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">默认行为：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 如果当前分支是 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`main\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> / </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`master\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> / </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`release\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">，自动进入 PR 模式，先创建 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`codex/&lt;简短任务名&gt;\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 分支</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 如果当前分支已经是功能分支，则提交并推送当前分支</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 若用户提到 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`PR\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`Pull Request\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`创建 PR\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`走 PR 流程\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">，无论当前在哪个分支，都进入 PR 模式</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 只有用户明确要求“直接推当前分支”时，才跳过 PR 模式</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 工作流程</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 1. 获取当前更改</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 检查 git 状态：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`git status\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 获取完整差异：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`git diff\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">（工作树）和 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`git diff --staged\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">（已暂存）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 识别未跟踪文件；明显的临时目录或构建产物（如 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`tmp/\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`dist/\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`.vitepress/dist/\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`node_modules/\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">）不要自动加入提交</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 如果有未暂存的有效更改，自动暂存相关文件</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 2. 分析更改内容</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">分析文件变更，优先按</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**业务意图**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">分组，其次才按文件或技术类型分组。常见分组维度：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **业务意图**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：这组变更在解决同一个用户问题、产品问题或工程问题</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **功能模块**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：相同功能模块的文件分为一组</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **变更类型**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ✨ 新功能 (feat)</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 🐛 修复 bug (fix)</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 📝 文档 (docs)</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 🎨 样式 (style)</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ♻️ 重构 (refactor)</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ⚡ 性能 (perf)</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ✅ 测试 (test)</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 🔧 构建/工具 (chore)</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 🚀 部署 (deploy)</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">  -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 💄 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`ui\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - UI 样式更新</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **文件关联**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：具有依赖关系的文件应放在一起</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">分组时同时记录每组的：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`Intent\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：为什么要改</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`Change Set\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：实际改了什么</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`Validation\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：应该如何验证，或已经执行了什么验证</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`Risk\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：可能影响哪里</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 3. 生成 Commit Messages</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">commit message 保持短小、可扫读，不要把完整业务意图塞进每一条 commit。完整说明放到最后的 Change Report。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">使用以下格式：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\`\`\`</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;图标&gt; &lt;类型&gt;(&lt;范围&gt;): &lt;简短描述&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Change-Set: &lt;本组变更的短标识，可选&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\`\`\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">常用图标与类型映射：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ✨ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`feat\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 新功能</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 🐛 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`fix\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 修复 bug</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 📝 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`docs\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 文档</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 🎨 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`style\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 样式（不影响功能）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ♻️ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`refactor\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 重构（既不是新功能也不是修复）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ⚡ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`perf\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 性能优化</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ✅ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`test\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 测试</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 🔧 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`chore\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 构建过程或辅助工具变动</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 🚀 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`deploy\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 部署</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 💄 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`ui\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - UI 样式更新</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 4. 执行分批提交（全自动）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">对于每个分组：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">1.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 添加相关文件：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`git add &lt;files&gt;\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">2.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 创建提交：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`git commit -m &quot;&lt;message&gt;&quot;\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">3.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 继续下一个分组</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 5. 推送到远程</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">所有 commit 创建完成后：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">1.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 获取当前分支名：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`git branch --show-current\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">2.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 直接推送到远程：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`git push origin &lt;branch-name&gt;\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">3.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 输出 Change Report，而不是只输出 commit 列表</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 5B. PR 模式</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">当用户要求走 PR 流程时：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">1.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 检查当前分支；如果在 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`main\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> / </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`master\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> / </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`release\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 上，先创建新分支，分支名使用 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`codex/&lt;简短任务名&gt;\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">2.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 分批提交后推送新分支：</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`git push -u origin &lt;branch-name&gt;\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">3.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 生成 Change Report 作为 PR body</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">4.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 如果本机安装了 GitHub CLI、已登录，并且当前登录账号明确就是目标仓库账号，执行：</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">   \`gh pr create --base main --head &lt;branch-name&gt; --title &quot;&lt;简短标题&gt;&quot; --body-file &lt;临时 PR 描述文件&gt;\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">5.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 如果没有 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`gh\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`gh\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 未登录，或用户存在多个 GitHub 账号导致当前登录身份不确定，不要要求用户登录，也不要卡住流程。直接输出 GitHub Compare URL、PR title 和完整 PR body，并明确告诉用户：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> PR title 填到 GitHub 的标题输入框</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> PR body / Change Report 粘贴到 GitHub 的 description 输入框</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">   -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 这不是让用户自己构思内容，只是因为当前环境无法自动写入 GitHub PR 表单</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">6.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 如果可以操作浏览器页面，并且用户已经打开 GitHub 创建 PR 页面，优先自动把 PR title 和 PR body 填进网页表单；不能自动填写时，必须给出一段完整、可复制的粘贴包</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PR title 使用本次变更的整体意图，不要简单复用某一条 commit message。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### 6. 输出 Change Report</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">每次 smart commit 完成后，必须在最终回复中输出一份面向人类阅读的 Change Report。它是本次推送的真正审阅入口。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">格式：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\`\`\`</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Change Report</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Intent:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">本次推送整体想解决什么问题。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Change Set:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- 按业务意图列出本次推送包含的几组变更</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- 每组说明影响的模块和关键文件</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Validation:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- 已执行的验证命令及结果</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- 未执行的验证需要说明原因</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Risk:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- 可能受影响的功能</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- 需要人工重点看的地方</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Commits:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- &lt;hash&gt; &lt;message&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\`\`\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">原则：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 人应该主要看 Change Report，不需要逐条阅读十几条 commit</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> commit 是代码账本，Change Report 是协作说明书</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 如果用户要开 PR，Change Report 可以直接作为 PR 描述草稿</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> PR 模式下，Change Report 必须进入 PR 描述；最终回复中同时给出 PR URL 或 Compare URL</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 重要约束</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **全自动执行**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：无需用户确认，直接分析、提交、推送</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **保护主分支**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：默认不要直接向 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`main\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> / </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`master\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> / </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`release\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 推送；先创建功能分支，再走 PR</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **每次只处理一个分组**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：按顺序处理每个分组</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **不要合并不相关的更改**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：如果某些更改不属于任何逻辑分组，单独处理</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **不要提交临时文件**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：未跟踪的临时目录、构建产物和缓存文件默认忽略</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **原子性提交**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：每个 commit 应该只包含一个逻辑变更</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **清晰的描述**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：commit 描述应该简洁，Change Report 承载完整上下文</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **避免形式主义**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：不要为每条 commit 编写冗长模板；超过 3 条 commit 时，更要把意图汇总到 Change Report</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 示例</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">假设有以下更改：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`src/app/page.tsx\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 添加新功能组件</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`src/app/lib/utils.ts\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 添加新工具函数</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`README.md\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 更新文档</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`src/styles/globals.css\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> - 样式调整</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">分析后直接执行：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">1.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`git add src/app/page.tsx src/app/lib/utils.ts &amp;&amp; git commit -m &quot;✨ feat(app): 添加新功能&quot;\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">2.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`git add README.md &amp;&amp; git commit -m &quot;📝 docs: 更新 README&quot;\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">3.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`git add src/styles/globals.css &amp;&amp; git commit -m &quot;🎨 style: 调整全局样式&quot;\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">4.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \`git push origin main\`</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">5.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 输出：</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\`\`\`</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Change Report</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Intent:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">完成应用新功能的最小可用实现，并补齐使用说明和样式表现。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Change Set:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- app 功能：新增页面组件和工具函数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- docs：更新 README</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- style：调整全局样式</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Validation:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- 未执行自动化验证；当前任务仅完成提交推送</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Risk:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- 新工具函数调用方较少，重点检查边界输入</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- 全局样式可能影响其他页面</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Commits:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- &lt;hash&gt; ✨ feat(app): 添加新功能</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- &lt;hash&gt; 📝 docs: 更新 README</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">- &lt;hash&gt; 🎨 style: 调整全局样式</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\`\`\`</span></span></code></pre></div>`,4)]))}const y=i(h,[["render",p]]);export{r as __pageData,y as default};

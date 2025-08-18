import{_ as s,c as n,o as e,bf as i}from"./chunks/framework.DQ2dnf0b.js";const b=JSON.parse('{"title":"Vim 编辑补充使用","description":"","frontmatter":{},"headers":[],"relativePath":"life/Vim 编辑补充使用.md","filePath":"life/Vim 编辑补充使用.md"}'),p={name:"life/Vim 编辑补充使用.md"};function l(t,a,o,c,d,r){return e(),n("div",null,a[0]||(a[0]=[i(`<h1 id="vim-编辑补充使用" tabindex="-1">Vim 编辑补充使用 <a class="header-anchor" href="#vim-编辑补充使用" aria-label="Permalink to “Vim 编辑补充使用”">​</a></h1><h2 id="成为做一个键盘侠" tabindex="-1">成为做一个键盘侠 <a class="header-anchor" href="#成为做一个键盘侠" aria-label="Permalink to “成为做一个键盘侠”">​</a></h2><p>掘金上面有一个大佬发过类似这样的标题,可以自行搜索关键字 &#39;<code>键盘侠</code>&#39; 这篇文章很详细的描述了从 code 的配置到如果在终端中快速打开项目的方法.以下都是在 Mac 环境下面进行,windows 应该也有对应的方法.</p><p>这里只做一个简述</p><h3 id="在命令行中快速启动-vscode-并打开对应的项目" tabindex="-1">在命令行中快速启动 vscode 并打开对应的项目 <a class="header-anchor" href="#在命令行中快速启动-vscode-并打开对应的项目" aria-label="Permalink to “在命令行中快速启动 vscode 并打开对应的项目”">​</a></h3><ol><li><p>配置 path,让 vscode 能够和终端进行联动 <code>shift + command + p </code>输入 path</p><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43dd2615c25f4ec3899d39c86c7492af~tplv-k3u1fbpfcp-zoom-1.image" alt=""></p></li><li><p>打开终端输入</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">code</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 文件名字或者文件夹</span></span></code></pre></div></li></ol><p>这个时候即使你的 vsCode 是关闭的状态也可以直接在上面打开对应的文件.</p><blockquote><p>不用使用双引号包住文件名或者文件夹</p></blockquote><h3 id="idea-中快速打开项目" tabindex="-1">Idea 中快速打开项目 <a class="header-anchor" href="#idea-中快速打开项目" aria-label="Permalink to “Idea 中快速打开项目”">​</a></h3><p>我一般是打开了这个软件就不会再启动了. 不过 idea 也可以.</p><ol><li>首先打开 idea 进行<code>Tool -&gt; Create Command-line Lanucher</code>, 会出现如下弹窗,点击确定即可.</li></ol><p><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3211e2da60a1498fb39e26d9fa1f7fb4~tplv-k3u1fbpfcp-watermark.image?" alt="截屏2021-12-22 12.44.19.png"> 2. 在终端中输入</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">idea</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 文件名或者文件夹</span></span></code></pre></div><h3 id="nvim" tabindex="-1">nvim <a class="header-anchor" href="#nvim" aria-label="Permalink to “nvim”">​</a></h3><p>推荐直接使用下面这个大佬的配置,能够实现<code>开箱即用</code>. <a href="https://github.com/ayamir/nvimdots" target="_blank" rel="noreferrer">ayamir/nvimdots: A well configured and structured Neovim. (github.com)</a></p><p>nvim-tree.lua</p><h2 id="打开了项目之后" tabindex="-1">打开了项目之后 <a class="header-anchor" href="#打开了项目之后" aria-label="Permalink to “打开了项目之后”">​</a></h2><p>打开了项目之后,推荐直接使用 vim 模拟器,vsCode 和 idea 中都有对应的模拟器.前者就叫<code>vim</code>,后者叫<code>IdeaVim</code>.</p><p>两者的基本使用没有差别.</p><p>vsCode 的 vim 可以直接通过快捷键<code>shift + command + e</code> 跳转到目录树上面进行控制,再配合<code>o</code>键打开打开文件的目的.</p><p>而 Idea 我是没有找到快捷键通过 vim 来控制目录树的.直接使用方向键 + 火车键来控制.而且感觉 idea 光标移动速度比 VSCode 顺畅很多.这样是我从 VSCode 迁移到 Idea.</p><h4 id="vscode-中-vim-的配置" tabindex="-1">VSCode 中 vim 的配置 <a class="header-anchor" href="#vscode-中-vim-的配置" aria-label="Permalink to “VSCode 中 vim 的配置”">​</a></h4><pre><code>\`\`\`bash
&quot;vim.useSystemClipboard&quot;: true,
&quot;vim.foldfix&quot;: true,
&quot;vim.smartRelativeLine&quot;: true,
&quot;vim.showMarksInGutter&quot;: true,
\`\`\`
</code></pre><p>对应的功能是:</p><ol><li>使用系统级别的复制粘贴</li><li>关闭移动到闭合的代码块上是否展开</li><li>是否相对位置,如图</li></ol><p><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee5965b0a9174d508809201e731e834c~tplv-k3u1fbpfcp-watermark.image?" alt="截屏2021-12-22 13.00.44.png"></p><blockquote><p>很多人都喜欢改键,比如说把<code>ESC</code>改成<code>jj</code>.但是对于我而言,倒是觉得默认的就挺好的.而且熟练使用默认的话,能够随时在新环境中不通过配置就可以顺畅的上手</p></blockquote><h4 id="idea-中-vim-的配置" tabindex="-1">Idea 中 vim 的配置 <a class="header-anchor" href="#idea-中-vim-的配置" aria-label="Permalink to “Idea 中 vim 的配置”">​</a></h4><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;vim.useSystemClipboard&quot;: true,</span></span>
<span class="line"><span>}</span></span></code></pre></div><h3 id="idea-中-vim-插件的配置" tabindex="-1">Idea 中 vim 插件的配置 <a class="header-anchor" href="#idea-中-vim-插件的配置" aria-label="Permalink to “Idea 中 vim 插件的配置”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>&quot; 显示当前模式</span></span>
<span class="line"><span>set showmode</span></span>
<span class="line"><span>&quot; 共享系统粘贴板</span></span>
<span class="line"><span>set clipborad=unamed</span></span>
<span class="line"><span>&quot; 打开行号</span></span>
<span class="line"><span>set number</span></span>
<span class="line"><span>&quot; 打开相对行号</span></span>
<span class="line"><span>&quot; set relativenumber</span></span>
<span class="line"><span>&quot; 设置命令历史记录条数</span></span>
<span class="line"><span>set history=2000</span></span>
<span class="line"><span>&quot; 关闭兼容vi</span></span>
<span class="line"><span>set nocompatible</span></span>
<span class="line"><span>&quot; 开启语法高亮功能</span></span>
<span class="line"><span>syntax enable</span></span>
<span class="line"><span>&quot; 允许用指定语法高亮配色方案替换默认方案</span></span>
<span class="line"><span>syntax on</span></span>
<span class="line"><span>&quot; 模式搜索实时预览,增量搜索</span></span>
<span class="line"><span>set incsearch</span></span>
<span class="line"><span>&quot; 设置搜索高亮</span></span>
<span class="line"><span>set hlsearch</span></span>
<span class="line"><span>&quot; 忽略大小写 (该命令配合smartcase使用较好，否则不要开启)</span></span>
<span class="line"><span>set ignorecase</span></span>
<span class="line"><span>&quot; 模式查找时智能忽略大小写</span></span>
<span class="line"><span>set smartcase</span></span>
<span class="line"><span>&quot; vim自身命令行模式智能补全</span></span>
<span class="line"><span>set wildmenu</span></span>
<span class="line"><span>&quot; 总是显示状态栏</span></span>
<span class="line"><span>set laststatus=2</span></span>
<span class="line"><span>&quot; 显示光标当前位置</span></span>
<span class="line"><span>set ruler</span></span>
<span class="line"><span>&quot; 高亮显示当前行/列</span></span>
<span class="line"><span>set cursorline</span></span>
<span class="line"><span>&quot;set cursorcolumn</span></span>
<span class="line"><span>&quot; 禁止折行</span></span>
<span class="line"><span>set nowrap</span></span>
<span class="line"><span>&quot; 将制表符扩展为空格</span></span>
<span class="line"><span>set expandtab</span></span>
<span class="line"><span>&quot; 设置编辑时制表符占用空格数</span></span>
<span class="line"><span>set tabstop=8</span></span>
<span class="line"><span>&quot; 设置格式化时制表符占用空格数</span></span>
<span class="line"><span>set shiftwidth=4</span></span>
<span class="line"><span>&quot; 让 vim 把连续数量的空格视为一个制表符</span></span>
<span class="line"><span>set softtabstop=4</span></span>
<span class="line"><span>&quot; 基于缩进或语法进行代码折叠</span></span>
<span class="line"><span>set foldmethod=indent</span></span>
<span class="line"><span>set foldmethod=syntax</span></span>
<span class="line"><span>&quot; 启动 vim 时关闭折叠代码</span></span>
<span class="line"><span>set nofoldenable</span></span></code></pre></div><h3 id="各种教程中-leader-键的意识" tabindex="-1">各种教程中 leader 键的意识 <a class="header-anchor" href="#各种教程中-leader-键的意识" aria-label="Permalink to “各种教程中 leader 键的意识”">​</a></h3><p>这个是自可以由用户自定义的的映射按键。</p><ol><li>设置 leader 快捷键，就是说，现在的;就代表了 leader 键</li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>let mapleader=&quot;;&quot;</span></span></code></pre></div><ol><li>配置 leader 快捷键映射软件自带的快捷键使用</li></ol><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>nmap &lt;Leader&gt;t &lt;C-]&gt;</span></span></code></pre></div><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>就是说使用leader + t 代替原本ctril/command +] 的快捷键。</span></span></code></pre></div><h3 id="idea-vim-配置" tabindex="-1">idea vim 配置 <a class="header-anchor" href="#idea-vim-配置" aria-label="Permalink to “idea vim 配置”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>:set clipboard=unnamedplus,unnamed</span></span>
<span class="line"><span>:set cursorcolumn</span></span>
<span class="line"><span>:set number relativenumber</span></span>
<span class="line"><span>:set rulerset wrap</span></span>
<span class="line"><span>:set fdm=marker</span></span>
<span class="line"><span>:set keep-english-in-normal-and-restore-in-insert</span></span>
<span class="line"><span>:set surround</span></span>
<span class="line"><span>:set easymotion</span></span>
<span class="line"><span>:set commentary</span></span>
<span class="line"><span>&quot; 标签页后退 ---标签页前进是gt</span></span>
<span class="line"><span>nmap gn gt</span></span>
<span class="line"><span>nmap gp gT</span></span>
<span class="line"><span>&quot; 移动相关</span></span>
<span class="line"><span>&quot; 前一个缓冲区</span></span>
<span class="line"><span>nnoremap &lt;silent&gt; [b :w&lt;CR&gt;:bprevious&lt;CR&gt;</span></span>
<span class="line"><span>&quot; 后一个缓冲区</span></span>
<span class="line"><span>nnoremap &lt;silent&gt; ]b :w&lt;CR&gt;:bnext&lt;CR&gt;</span></span>
<span class="line"><span>map &lt;C-j&gt; &lt;C-W&gt;j</span></span>
<span class="line"><span>map &lt;C-k&gt; &lt;C-W&gt;k</span></span>
<span class="line"><span>map &lt;C-h&gt; &lt;C-W&gt;h</span></span>
<span class="line"><span>map &lt;C-l&gt; &lt;C-W&gt;l</span></span></code></pre></div><h3 id="idea-的配置文件" tabindex="-1">idea 的配置文件 <a class="header-anchor" href="#idea-的配置文件" aria-label="Permalink to “idea 的配置文件”">​</a></h3><p><a href="https://blog.csdn.net/qq_31424825/article/details/100050445" target="_blank" rel="noreferrer">IDEA 2019 配置与使用 CheckStyle_王子様：你当像鸟飞往你的山~~-CSDN 博客_idea 配置 checkstyle</a></p><h2 id="其他问题" tabindex="-1">其他问题 <a class="header-anchor" href="#其他问题" aria-label="Permalink to “其他问题”">​</a></h2><h3 id="_1-mac-中苹果连续滚动太慢的问题" tabindex="-1">1.mac 中苹果连续滚动太慢的问题 <a class="header-anchor" href="#_1-mac-中苹果连续滚动太慢的问题" aria-label="Permalink to “1.mac 中苹果连续滚动太慢的问题”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>$ defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false         # For VS Code</span></span>
<span class="line"><span>$ defaults write com.microsoft.VSCodeInsiders ApplePressAndHoldEnabled -bool false # For VS Code Insider</span></span>
<span class="line"><span>$ defaults delete -g ApplePressAndHoldEnabled</span></span></code></pre></div><p>然后配置系统设置中的键盘 \b 按键重复，和重复前延迟</p><blockquote><p>全部拉到满，会感觉到使用别的东西也非常的丝滑</p></blockquote><p><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b5b6e43ce3f48ab83f3f33b56d284d6~tplv-k3u1fbpfcp-zoom-1.image" alt=""></p><p>不过这个配置的话还是不够快，可以在终端输入如下命令行：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>defaults write NSGlobalDomain KeyRepeat -int 1</span></span></code></pre></div><blockquote><p>听说 0 是最快的，不过 1 感觉还好</p></blockquote>`,51)]))}const m=s(p,[["render",l]]);export{b as __pageData,m as default};

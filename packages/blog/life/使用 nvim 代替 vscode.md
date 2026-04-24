# 使用 nvim 代替 vscode

标题党，目标是为了表达 nvim 的好用，而且 vscode 本质是和 nvim 不冲突的，我们有 VsCodeVim 插件可以帮我们在 vscode 中使用 nvim 的功能。

## 1. Neovim 是什么

在此之前,我一直都是使用 VSCODE 或者 WEB STORM 编辑器的. 他们确实好用方便. 直到我得了腱鞘炎之后. 不得不寻求减少使用鼠标的方案.

在我之前的文章中也描述过这一过程. 我从使用 VSCODE 自带的快捷键到使用 Vim 模拟器之后. 我对于这种能够全键盘完成自己工作的操作方式越发的着迷.

它足够的装 🐮,让我这样这种每天工作就是搬砖的底层码农也有一种自己已经是程序员的感觉.

由此,我才迸发了使用 vim 实现更多的念头.

自然而然的接触到了 neovim. 说它是 vim 的分支或者升级版都可以. 它的所有操作都可以通过键盘来实现,分屏、修改、新增、函数跳转、重构、断点 debug、内置终端. 最重要的是可以完美的潜入到编辑器当中.比如说 VS Code.这个极大的降低了开发者使用 neovim 的心里门槛.

简单来说,neovim 搭配各种插件可以最大限度的实现你平时使用 VSCode 的功能.

## 2. 我们为什么需要 Neovim

客观原因, 想要减轻一下手腕负担,毕竟都要去医院检查了, 到了必须要重视的时候了.

至于很多大佬说的使用类`vim`这种编码方式可以提高工作的效率. 就我自己的体验而言,这个真没有.或许它让我极大的减少了使用鼠标的次数,极大的提高我敲字母的速度.但是这些一直都不是限制提高我工作效率的主要原因.

主要原因,是对于需求的理解,对于语言的熟悉度,对于 API 调用的熟悉度,对于编程思维逻辑的转化程度,更准确的说,是对设计模式在实际业务开发中合理的使用.

> 对于我这种菜鸟而言, 在使用 vim 之前, 思维的方式都还没跟上我敲键盘的速度 😂, 所以我编码的速度再快也没有用

其次, 通过键盘来操作,会带来快感.而且随着你熟练度的不停提升. 而且这个快感能够持续的时间很长,长到我使用了将近了两个月之后,每每想到要写代码的时候,还是会有兴奋感.

更重要的是,neovim 自己从头开始配置的话,你会熟悉每一个功能,每一个自己设置的 hot keybindings.这种如臂使指的感觉会更加强烈.

最后,相比 vim, neovim 更强的性能和更现代化的 lua 配置语言,当然这些是事实, neovim 带来的异步任务特性从逻辑上必然是会提升体验的,还有浮窗功能. 当然听说 vim 现在也有很多更新.但是我并不关心.

毕竟仅仅是 neovim 的颜值就可以不再看 vim 一眼了. 如下:

![截屏2022-04-03 21.25.09.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/698622af8676414e8e9b5f3fbbcbb407~tplv-k3u1fbpfcp-watermark.image?)

颜值才是第一生产力

总的来说:

1. 还不错的颜值
2. 极客
3. 装 🐮
4. 如臂使指的快感

## 3. 如何配置 Neovim

我逛遍了整个中文社区,只推荐在两个地方看如何从头配置 Neovim.

一个掘金上面有一本且唯一一本小册也从头配置起了 neovim. 另一个在知乎上面搜索 「Neovim IDE 搭建系列」即可.

当然也可以直接使用网上大佬的配置.

但是这些大佬的配置, 对于不熟悉`lua`的人来说,确实是够抽象的. 就算能够成功运行,也是一脸的懵逼.就达不到如臂指使的程度了,所以还是推荐有时间有精力的话,跟着教程自己从头配置一遍.

不得不说,确实很可能会消耗你不少的时间的.但是给你带来的影响,甚至会跟随你的整个职业生涯的.

> 只要是处理文字就有可能需要`vim`

系统的看可以去看掘金小册中 neovim 的教程,整个掘金就一个. 或者去看知乎上面. 这里就不画蛇添注了,只做一个简单的过程概要.

我当前的配置环境:

环境: MacOS Monterey 12.3

终端工具: iterm2

软件管理工具: HomeBrew

> 其实大差不差的,即使是在 windows 平台也是需要配置 wsl2 来进行环境的配置.配置逻辑基本相同

### 3.1 安装第三方终端

这里选择了使用人数最多的,有了疑问也容易搜索到. iterm2. 使用`homebrew`进行软件管理

```bash
  brew install iterm2
```

### 3.2 安装 neoviem

```bash
  brew install neovim
```

homebrew 的使用具体可以查看我的另外一篇文章

一般来说安装`neovim`是不会出问题的.但是要安装`neovim`的前置环境会劝退一批人.

你需要安装好`nodejs`、`python`环境, `nodejs`自不用说, 很多 neovim 的插件都是依托于`python3`环境的.

```bash
  brew install python3
  pip3 install neovim --upgrade
```

安装`python`模块之后,我们可以在终端中输入`nvim`就能够自动的进入到 nvim 的主页面. 此时输入`:CheckHealth`它就会自动检测你当天环境是否已经成功配置成功了.

当你看到全部是 OK 的时候,就表明已经配置成功了 . 即使出现了`ERROR`也不用害怕,它下面会给出建议,让你干啥你就干啥就好.

每个人电脑当前环境不一样,网络状况不一样,有时候确实会出现不一样的问题,这就需要你自己善于使用搜索功能了.在这里我推荐`reddit`中的`r/neovim`社区.

以下是我自己碰到的问题:

#### 3.2.1 安装 pip 失败,提示: SyntaxError: invalid syntax

使用`bootstrap`教程

```bash
curl 'https://bootstrap.pypa.io/get-pip.py' > get-pip.py
```

接着使用`python3`执行该脚本

```bash
sudo python3 get-pip.py
```

静等它执行完成,随后在命令好中输入:

```bash
pip --version
```

出现如下截图说明,你的`pip`已经安装成功

![截屏2022-04-04 15.26.48.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/504d04f0f5b643deb6d93bee1bff2c8e~tplv-k3u1fbpfcp-watermark.image?)

有了`pip`,就可以执行`pip install neovim`,让 pyhon3 和 neovim 产生关联

#### 3.2.2 ERROR: This script does not work on Python 2.7 The minimum supported Python version is 3.6. Please use https://bootstrap.pypa.io/pip/2.7/get-pip.py instead

顾名思义,就是使用 pyhon2.7 版本不支持, 请下载https://bootstrap.pypa.io/pip/2.7/get-pip.py

#### 3.2.3 Ruby provider (optional)的/usr/local/bin/neovim-ruby-host --version

运行如下命令可以解决:

```bash
gem install msgpack
```

### 3.3 快速启动 neovim

```bash
cd ~ && vim .zshrc
```

然后找到空白地区,键入:

```bash
# neovim
alias vim='nvim'
alias vi='nvim'
```

之后你就可以直接在 shell 中输入`vi`或者`vim`就是使用的 neovim 了

### 3.4 创建 neovim 配置文件

```bash
mkdir ~/.config/nvim
vi ~/.config/nvim/init.vim
```

配置文件结果如下:

![截屏2022-04-04 15.47.39.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b33a5c044c4346e4b8193667eea3c2da~tplv-k3u1fbpfcp-watermark.image?)

- init.lua 是所有功能的初始化
- lua -> 配置文件下详情
  - lsp -> 提供代码识别功能,和 vscode 通用一套.
  - plugin-config -> 其他各种花里胡哨的配置, 功能性的、UI 类型的都在里面
  - basic.lua -> vim 基本配置文件
  - colorscheme.lua -> 其实属于 plugin-config 中的一员,但是主题是高频使用所以单独拎出
  - keybindings.lua -> 键位绑定
  - plufins.lua -> 插件引入入口
  - ginit.vim -> 我的终端模拟器`neovide`配置文件
  - pugin -> 自动生成
  - 更具具体的配置内容,可以自己网上搜索

### 3.5 配置字体

字体是终端一切漂亮图标的基础. nerd font

地址在这里 https://www.nerdfonts.com/font-downloads. 找一个自己喜欢的就行. nerd font 是这些字体的超集.

需要注意的是, neovim 的配置文件和终端模拟器都需要配置对应的字体

## 4. 终端模拟器之选

### 4.1 iterm2

优点: 网上的资料最多. 而且提供了可视化的 UI 配置. 配置起来也是最简单.功能也是最简单的.如果要使用`thmux`的话,甚至是有内置的.

缺点: 卡, 分屏多几个就卡得不行不行的, 即使配置了 GPU 加速也没有任何作用,现在已放弃.

### 4.2 alacrittty

A fast, cross-platform, OpenGL terminal emulator

优点: 快,简单

缺点: 太简单,没有 tab, 你一次只能打开一个终端.

我的配置文件如下:

```yml
# Spread additional padding evenly around the terminal content.
dynamic_padding: true
# window customization
window:
dimensions:
  columns: 140
  lines: 38
# padding:
#   x: 0
#   y: 0

decorations: none

# Background opacity
opacity: 0.95

# mouse
mouse:
hide_when_typing: true

scrolling:
history: 10000
multiplier: 3

# Font configuration
font:
normal:
  family: "SauceCodePro Nerd Font"
style: "常规体"
bold:
  family: "SauceCodePro Nerd Font"
  style: "粗体"
italic:
  family: "SauceCodePro Nerd Font"
  style: "斜体"
bold_italic:
  family: "SauceCodePro Nerd Font"
  style: "粗斜体"
# Point size
size: 14.0
offset:
  x: 0
  y: 5
glyph_offset:
  x: 0
  y: 0
use_thin_strokes: true

#
#builtin_box_drawing: true

# If `true`, bold text is drawn using the bright color variants.
draw_bold_text_with_bright_colors: true
```

文件放置于 `.config/alacritty/alacritty.yml`

### 4.3 kitty

优点: 快、使用过程中没有出现性能问题. 可以配置项很多.
缺点: 配置文件全英文,官方文档全英文,足够复杂
网上说之前说中文输入有问题,我是没有碰到. 而且也是快,没有性能问题. 现在完全作为顶替 iterm2 的存在
配置文件, 基本使用默认配置,改了如下:

```ini
font_family      BlexMono NF
adjust_column_width -1
background_opacity 0.9
hide_window_decorations yes
```

第一个是为了连体字

第二个是 kitty 默认字体渲染间距偏宽,-1 就正好

第三个背景来一点透明

第四个隐藏顶部 title

### 4.4 Neovide

各种使用下来感觉就是 alacritty 的升级版.升级在了那些骚操作上面.我现在的开发项目的主力.
简单, 动画很流畅.掌控感有爽快感.

配置文件:

```bash
set guifont=BlexMono\ NF:h14
set listchars=tab:>~,trail:.

let g:neovide_refresh_rate=60
let g:neovide_no_idle=v:false
let g:neovide_fullscreen=v:false
let g:neovide_cursor_animation_length=0.13
let g:neovide_remember_window_size=v:true
let g:neovide_cursor_trail_length=0.5
let g:neovide_cursor_antialiasing=v:true
let g:neovide_cursor_vfx_mode = "torpedo"
let g:neovide_cursor_vfx_opacity=200.0
let g:neovide_cursor_vfx_particle_lifetime=1.2
let g:neovide_cursor_vfx_particle_density=7.0
let g:neovide_cursor_vfx_particle_speed=10.0
let g:neovide_cursor_vfx_particle_phase=1.5
let g:neovide_cursor_vfx_particle_curl=1.0
```

### 4.5 warp

划时代的终端模拟器. 这个划时代在我看来,体现在它的颜值上面.这玩意儿是真的好看啊. 终端模拟器的颜值怎么会这么好看.

**优点:**

1. 在使用 nvim 的过程中,没有碰到性能的问题
2. 超高的颜值
3. 悬浮弹窗式的提示

缺点

## 5. enjoy!

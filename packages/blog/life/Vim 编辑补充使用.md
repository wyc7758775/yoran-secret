# Vim 编辑补充使用

## 成为做一个键盘侠

掘金上面有一个大佬发过类似这样的标题,可以自行搜索关键字 '`键盘侠`'
这篇文章很详细的描述了从 code 的配置到如果在终端中快速打开项目的方法.以下都是在 Mac 环境下面进行,windows 应该也有对应的方法.

这里只做一个简述

### 在命令行中快速启动 vscode 并打开对应的项目

1. 配置 path,让 vscode 能够和终端进行联动
   `shift + command + p `输入 path

   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43dd2615c25f4ec3899d39c86c7492af~tplv-k3u1fbpfcp-zoom-1.image)

2. 打开终端输入

   ```bash
   code 文件名字或者文件夹
   ```

这个时候即使你的 vsCode 是关闭的状态也可以直接在上面打开对应的文件.

> 不用使用双引号包住文件名或者文件夹

### Idea 中快速打开项目

我一般是打开了这个软件就不会再启动了. 不过 idea 也可以.

1. 首先打开 idea 进行`Tool -> Create Command-line Lanucher`, 会出现如下弹窗,点击确定即可.

![截屏2021-12-22 12.44.19.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3211e2da60a1498fb39e26d9fa1f7fb4~tplv-k3u1fbpfcp-watermark.image?) 2. 在终端中输入

```bash
idea 文件名或者文件夹
```

### nvim

推荐直接使用下面这个大佬的配置,能够实现`开箱即用`.
[ayamir/nvimdots: A well configured and structured Neovim. (github.com)](https://github.com/ayamir/nvimdots)

nvim-tree.lua

## 打开了项目之后

打开了项目之后,推荐直接使用 vim 模拟器,vsCode 和 idea 中都有对应的模拟器.前者就叫`vim`,后者叫`IdeaVim`.

两者的基本使用没有差别.

vsCode 的 vim 可以直接通过快捷键`shift + command + e` 跳转到目录树上面进行控制,再配合`o`键打开打开文件的目的.

而 Idea 我是没有找到快捷键通过 vim 来控制目录树的.直接使用方向键 + 火车键来控制.而且感觉 idea 光标移动速度比 VSCode 顺畅很多.这样是我从 VSCode 迁移到 Idea.

#### VSCode 中 vim 的配置

    ```bash
    "vim.useSystemClipboard": true,
    "vim.foldfix": true,
    "vim.smartRelativeLine": true,
    "vim.showMarksInGutter": true,
    ```

对应的功能是:

1. 使用系统级别的复制粘贴
2. 关闭移动到闭合的代码块上是否展开
3. 是否相对位置,如图

![截屏2021-12-22 13.00.44.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee5965b0a9174d508809201e731e834c~tplv-k3u1fbpfcp-watermark.image?)

> 很多人都喜欢改键,比如说把`ESC`改成`jj`.但是对于我而言,倒是觉得默认的就挺好的.而且熟练使用默认的话,能够随时在新环境中不通过配置就可以顺畅的上手

#### Idea 中 vim 的配置

```
{
  "vim.useSystemClipboard": true,
}
```

### Idea 中 vim 插件的配置

```
" 显示当前模式
set showmode
" 共享系统粘贴板
set clipborad=unamed
" 打开行号
set number
" 打开相对行号
" set relativenumber
" 设置命令历史记录条数
set history=2000
" 关闭兼容vi
set nocompatible
" 开启语法高亮功能
syntax enable
" 允许用指定语法高亮配色方案替换默认方案
syntax on
" 模式搜索实时预览,增量搜索
set incsearch
" 设置搜索高亮
set hlsearch
" 忽略大小写 (该命令配合smartcase使用较好，否则不要开启)
set ignorecase
" 模式查找时智能忽略大小写
set smartcase
" vim自身命令行模式智能补全
set wildmenu
" 总是显示状态栏
set laststatus=2
" 显示光标当前位置
set ruler
" 高亮显示当前行/列
set cursorline
"set cursorcolumn
" 禁止折行
set nowrap
" 将制表符扩展为空格
set expandtab
" 设置编辑时制表符占用空格数
set tabstop=8
" 设置格式化时制表符占用空格数
set shiftwidth=4
" 让 vim 把连续数量的空格视为一个制表符
set softtabstop=4
" 基于缩进或语法进行代码折叠
set foldmethod=indent
set foldmethod=syntax
" 启动 vim 时关闭折叠代码
set nofoldenable
```

### 各种教程中 leader 键的意识

这个是自可以由用户自定义的的映射按键。

1.  设置 leader 快捷键，就是说，现在的;就代表了 leader 键

```
let mapleader=";"
```

1.  配置 leader 快捷键映射软件自带的快捷键使用

```
nmap <Leader>t <C-]>
```

```
就是说使用leader + t 代替原本ctril/command +] 的快捷键。
```

### idea vim 配置

```
:set clipboard=unnamedplus,unnamed
:set cursorcolumn
:set number relativenumber
:set rulerset wrap
:set fdm=marker
:set keep-english-in-normal-and-restore-in-insert
:set surround
:set easymotion
:set commentary
" 标签页后退 ---标签页前进是gt
nmap gn gt
nmap gp gT
" 移动相关
" 前一个缓冲区
nnoremap <silent> [b :w<CR>:bprevious<CR>
" 后一个缓冲区
nnoremap <silent> ]b :w<CR>:bnext<CR>
map <C-j> <C-W>j
map <C-k> <C-W>k
map <C-h> <C-W>h
map <C-l> <C-W>l
```

### idea 的配置文件

[IDEA 2019 配置与使用 CheckStyle\_王子様：你当像鸟飞往你的山~~-CSDN 博客\_idea 配置 checkstyle](https://blog.csdn.net/qq_31424825/article/details/100050445)

## 其他问题

### 1.mac 中苹果连续滚动太慢的问题

```
$ defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false         # For VS Code
$ defaults write com.microsoft.VSCodeInsiders ApplePressAndHoldEnabled -bool false # For VS Code Insider
$ defaults delete -g ApplePressAndHoldEnabled
```

然后配置系统设置中的键盘  按键重复，和重复前延迟

> 全部拉到满，会感觉到使用别的东西也非常的丝滑

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b5b6e43ce3f48ab83f3f33b56d284d6~tplv-k3u1fbpfcp-zoom-1.image)

不过这个配置的话还是不够快，可以在终端输入如下命令行：

```
defaults write NSGlobalDomain KeyRepeat -int 1
```

> 听说 0 是最快的，不过 1 感觉还好

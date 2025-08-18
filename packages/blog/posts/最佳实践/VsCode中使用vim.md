# VsCode 中使用 vim 插件

## 一、vim 是什么

它把我们平时操作的动作抽象拆分为三种类型，插入模式、可视化模式、普通模式。

## 二、使用 vim 的动机是什么

第一次听到的能够不使用鼠标，使用键盘就可以操作电脑，符合小时候对于电脑大佬的刻板印象。对不起，是我不成熟了。

## 三、在 vscode 中的配置

```json
"vim.easymotion": true,
// 启用系统粘贴板作为vim寄存器
"vim.useSystemClipboard": true,
// 由vim接管ctrl+any的按键，而不是vscode
"vim.useCtrlKeys": true,
// 突出显示与当前搜索匹配的所有文本
"vim.hlsearch": true,
// 下面定义的按键将交由vscode进行处理，而不是vscode-vim插件
"vim.handleKeys": {
  "<C-a>": false,
  "<C-f>": false,
  "<C-n>": false
},
"vim.leader": "<space>",
"vim.normalModeKeyBindings": [
  {
    "before": ["<leader>", "f"],
    "commands": ["revealInExplorer"]
  },
  {
    "before": ["J"],
    "after": ["5", "j"]
  },
  {
    "before": ["K"],
    "after": ["5", "k"]
  },
  // rename 重命名
  {
    "before": ["<Leader>", "r", "n"],
    "commands": ["editor.action.rename"]
  },
  {
    "before": ["<Leader>", "f", "d"],
    "commands": ["editor.action.formatDocument"]
  }
],
"vim.insertModeKeyBindings": [
  {
    "before": ["j", "k"],
    "after": ["<Esc>"]
  }
],
"vim.sneak": true
```

## 四、关键快捷键

**移动可视窗(光标也可以跟着移动):**

| Ctrl + d（control + d） | 向下滚动半屏                                      |
| ----------------------- | ------------------------------------------------- |
| Ctrl + u（control + u)  | 向上滚动半屏                                      |
| zt                      | 将当前行置于屏幕顶部附近                          |
| zz                      | 将当前行置于屏幕中央                              |
| zb                      | 将当前行置于屏幕底部                              |
| H/M/L                   | 跳转到屏幕的顶部/中间/底部                        |
| （）{}                  | 跳转到上一个句子/下一个句子/上一个段落/下一个段落 |

一些使用 VSCode 开发中常用的操作：

**函数定义之类：**

| gd                    | 进入函数定义       |
| --------------------- | ------------------ |
| Ctrl+o（control + o） | 从函数定义中返回   |
| gd                    | 查看函数参数等信息 |

**切换标签页：**

| gt  | 切换到下一个标签页  |
| --- | ------------------- |
| gT  | 切换到上一个标签页  |
| 4gt | 切换到第 4 个标签页 |

**切换分栏：**

| Ctrl + 1 | 第一个分栏 |
| -------- | ---------- |
| Ctrl + 2 | 第二个分栏 |

> 其他： 可以使用 Ctrl + 0 来将光标从编辑器跳转到文件栏，在文件栏可以使用 j 和 k 进行移动，可以使用 Space 展开或者关闭文件夹，使用 l 可以将光标选中的文件在编辑器中打开。

### 4.3 vim-surround

|             |                                       |
| ----------- | ------------------------------------- |
| `ds "`      | `"Hello world!"` => `Hello world!`    |
| `cs "(`     | `"Hello world!"` => `(Hello world!)`  |
| cS          | 替换括号，括号内文本做新一行          |
| ys          | 添加括号(配合 vim 光标移动)           |
| `ys w [`    | `Hello world!` => `[Hello] world!`    |
| ys w Enter  | Hello world! => <em>Hello</em> world! |
| yS          | 添加括号，括号内文本做新一行          |
| `yS w [`    | `Hello world!` => `[ Hello ] world!`  |
| `yss (`     | `Hello world!` => `( Hello world! )`  |
| ySS         | 整行括起来，括号内文本做新一行        |
| `ySS {`     | `Hello world!` => `{ Hello world! }`  |
| `ySS Enter` | `Hello world!` => `Hello world!`      |

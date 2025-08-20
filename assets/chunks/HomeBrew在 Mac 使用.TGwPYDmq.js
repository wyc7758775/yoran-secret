const n=`![](https://yoran-images-1256970527.cos.ap-guangzhou.myqcloud.com/homebrew.png)

# HomeBrew 在 Mac 上的安装

HomeBrew 是 Mac 上的一个包管理工具，类似与 ubuntu 上的 apt 或者 centos 上的 yum。推荐即便不是程序员也应该使用的功能。

## 1. intel 安装

1.  最好让你的电脑能够打开 404
1.  使用命令行

\`\`\`bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
\`\`\`

这个时候使用 brew search node 有可能不成功，出不来东西。报错 No similarly named formulae found。 那就运行下面这条命令。

\`\`\`bash
rm -rf /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core; brew update
\`\`\`

随后会出现

\`HomeBrew was successfully installed!\`

## 2. M1 版本的配置

### 2.1 官网的安装方法，只要配置一下国内镜像就可以了. 复制下面的终端,直接回车就可

\`\`\`bash
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.ustc.edu.cn/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.ustc.edu.cn/homebrew-core.git"
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
\`\`\`

### 2.2 配置环境变量，不然 brew 还是会提示找不到该命令的

在\`.zshrc\` 中输入

\`\`\`
cd ~
touche .zshrc
vim .zshrc
\`\`\`

空白地方键入

\`\`\`bash
export PATH=/opt/homebrew/bin:$PATH
export PATH=/opt/homebrew/sbin:$PATH
\`\`\`

**激活环境变量**

\`\`\`bash
source .zshrc
\`\`\`

## 3. 卸载 homebrew

\`\`\`bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall.sh)"
\`\`\`

## 4. 安装应用

一种可视化的软件，如 QQ

\`\`\`bash
brew install --cask qqmusic
\`\`\`

一种运行与命令行中的

\`\`\`bash
brwe install node
\`\`\`

上面直接安装的是 node 最新版。可以指定版本。

当然具体的命令行可以直接使用它提供的软件搜索，如下。

### 4.1 如果安装的速度实在太慢,只能切换国内源了

**中科大的镜像:**

\`\`\`bash
cd "$(brew --repo)"
git remote set-url origin git://mirrors.ustc.edu.cn/brew.git
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin git://mirrors.ustc.edu.cn/homebrew-core.git
\`\`\`

**清华的镜像:**

\`\`\`bash
git -C "$(brew --repo)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git

git -C "$(brew --repo homebrew/core)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git
\`\`\`

> 但是这个源只是更换了软件列表的源头,但是软件本身的存储地址还是国外的,这就没办法了,所以还是要掌握正确上网冲浪姿势才行.

## 5. 软件搜索：

不知道该软件库有什么可以安装的话，请搜索 homebrew 官网：
https://formulae.brew.sh/cask/

命令行也不是不行,只是现实的结果不是那么的明显:

\`\`\`bash
brew search qqmusic
\`\`\`

qqmusic 位置可以替换成你想要搜索的软件名

## 6. 趣味命名

> 虽然对于如何使用 homebrew 没有直接的帮助，但是多了解一下 homebrew 相关的周边，会提升对冷冰冰的使用教程的温度。做一个对编程真正热爱的程序员吧

brew 在英文翻译中有酿造；酝酿的意思

 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c6341024b0a4ca6b6226ef59b4d211f~tplv-k3u1fbpfcp-watermark.image" width = "300" height = "200" alt="图片名称" align=center />

而 homebrew 的安装方式,是直接把 source code 下载回来,然后自己给它做编辑.在自己的电脑上面做 local comile 的编译工作,所以和酿酒很像,从外面拿原材料回家酿酒.

既然是酿酒,就需要配方,即 formula.当你需要安装的时候,就会根据 formula 来编译,相当于酿造出一桶酒(keg).keg 就指编译完成的文件夹.

酒酿好了,就需要地方放置才行.所以软件放的目录就是\`usr/local/Cellar/\`.
Cellar 翻译就是地窖.

最后回到「keg-only」整个词，字面上意思现在就很清除，表示这个套件只会存放在桶子里，不会跑出桶子外。实际上的行为是 brew 不会帮你做 symlink 到 /usr/local，避免你的原生系统内还有一套 readline 而打架，所以提示消息说 readline 套件是 keg-only。

## 7. 其他常用 API

\`\`\`bash
API
#搜索
brew search xxx 例如 brew search mysql

#安装
brew install xxx 例如：brew install mysql

#查询
brew info xxx 例如：brew info mysql 主要查看具体的信息及依赖关系当前版本注意事项等

#更新
如果想要更新到当前最新的版本要先把当前 brew 更新到最新。brew update 这个时候他会先更新自己到最新 接下来的操作才更有意义

#检测新版本
brew outdated 会列出所有有新版本的程序

#升级
brew upgrade 升级所有 当然也可以指定升级
brew upgrade xxx指定的升级的程序名

#清理
brew cleanup 清理不需要的版本及其安装缓存

#删除
brew uninstall xxx删除不需要的程序

#你麻痹删除
brew remove xxx 这个卸载和上面的卸载有什么差别

#更多命令详见
man brew
\`\`\`

## 8. 常用的操作

**切换 node 版本**

\`\`\`bash
brew unlink node && brew link --overwrite --force node@12
\`\`\`

**迁移应用**

换了新电脑,没有必要一个一个的重新下载.使用 brew 内置的\`Brewfile\`完成迁移.

**先进行备份**

\`\`\`bash
brew bundle dump
\`\`\`

这条命令就可以备份自己当前 brew 安装信息.会 into 当当前终端文件夹当中.
还有很多配置的属性,感兴趣可以去官网自行查看.

- \`--file\`: Read the \`Brewfile\` from this location. Use \`--file=-\` to pipe to stdin/stdout.
- \`--no-upgrade\`: \`install\` won’t run \`brew upgrade\` on outdated dependencies. Note they may still be upgraded by \`brew install\` if needed.
- \`-f\`, \`--force\`: \`dump\` overwrites an existing \`Brewfile\`. \`cleanup\` actually performs its cleanup operations.
- \`--cleanup\`: \`install\` performs cleanup operation, same as running \`cleanup --force\`.
- \`--no-lock\`: \`install\` won’t output a \`Brewfile.lock.json\`.
- \`--all\`: \`list\` all dependencies.
- \`--describe\`: \`dump\` adds a description comment above each line, unless the dependency does not have a description.

**随后在新设备直接\`brew bundle\` 既可.**

### Cakebrew

homeBrew 的 GUI 界面操作软件.

\`\`\`bash
brew cask install cakebrew
\`\`\`
`;export{n as default};

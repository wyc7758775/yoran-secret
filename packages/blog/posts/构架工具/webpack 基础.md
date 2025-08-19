# webpack 基础

## 一、功能总览

- 能够节写 CommonJs 和 ES module 的语法. 自动合并这些模块的代码.
- 默认是只能识别 js 和 json,所以为了适应 web 前端开发的工程.需要额外配置一些解析器.这些解析器放在 loader 配置属性当中
- css 使用 style-loader 和 cs-loader, 图片在 4.0 版本可以使用 file-loader 或者 url-loader 来解析.
- 为了自动把把生成好的 js 文件自动引入到 html 当中.需要使用 htmlWebpackPlugins 的插件进行配置.还能使用默认的模版
- 如果要使用其他预编译 scss、sass、styleUi,同样是需要对应的 loader
- 生成的 js 文件浏览器不识别,就需要 babel 来对你的 es6 翻译成 es5 语法.

  由此, 一个基本的自动化打包工具就可以构成了 .

  如果还要在开发环境中进行更好的开放的.

- 需要修改了 js 代码,网页就能够自动刷新,并自动打包好. 最常用的就是 webpack-dev-serve 插件.
- 更进一步的就是使用热更新功能,英文缩写是 HMR. 差量更新的功能.
- 差量更新的功能,也叫 HMR,css 的 style-loader 自带有,所以不用配置.而 js 没有,所以需要手动配置 module.asset 一套逻辑
- vue 同理,react 是通过 babel-press 内置功能来实现的

  上面两部分就构成了基本的项目工程化.

  其他部分就到了性能优化和方便项目调试的部分了.

  **性能优化**这些手段: **代码压缩、代码分割、tree-shaking 等**

  **项目调试**有些手段: **`sourceMap`\*\***的配置, webpack-dev-serve、HMR\*\*

  学习 webpack,第一层是学习 webpack 的配置方式.第二层是学习它的配置思路,为什么要这样配置,第三层是学习 loader 的原理、手动写自己的 plugins.

  前两层已经能够保证你能够很好的灵活使用 webpack 来搭配自己的项目脚手架了 .后者是让自己可以站在造轮子的角度去学习,提升自己对于前端工程化的实现原理的理解.

## 二、webpack 安装方式

### 2.1 初始化项目

    -

```js
npm init -y
```

      `-y`中的代表`yes`, 如果不用话,会弹出很多默认配置,需要手动 yes.

      初始化成功之后,会在当前目录目录下生成`package.json`文件.

      > 由于我们前端的工程化是基于 node,所以在使用任何工具之前,都需要配置好 node 开发环境.

### 2.2 安装 webpack 和 webpack-cli

> webpack-cli 用于在命令行中运行 webpack，cli 即命令行接口（Command Line Interface）

安装成功之后,可以在`node_modules`中的`.bin`文件夹中可以看到这两个库的执行命令.

我们平时在终端中执行`npx xxx`就是执行这里面的脚本文件.

```js
npm install --save-dev webpack webpack-cli
```

### 2.5 配置快捷使用命令

```js
// package.json
{
"scripts": {
  "build": "webpack"
}
}
```

    之后我们就可以使用`npm run build`来执行`node_modules`中`.bin`文件夹中`webpack`脚本.

    npm 自定为我们加上了`node_modules/.bin`的前缀.

    > npx 是 npm 的高级使用形象.如果这个包在当前环境不存在,会自动下载一个临时的包来运行,而不会影响到当前的环境.运行完毕之后,就把这个包给删除.

### 2.5 初始化`webpack.config.js`

```js
const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

    - `_dirname`代表当前目录

        上面就是 webpack 打包最基本的配置.一个输入文件,一个输出文件.

        > webpack4 之后可以什么都不用配置,能够直接打包.默认的目录和我们配置的目录是一致的

### 2.6 解析 css 文件

```js
npm install style-loader css-loader --save-dev
```

随后进行文件的配置

```js
{
module: {
  rules: [
    {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    },
  ],
},
}
```

test 中是一个正则,就是为了匹配以 css 为后缀的文件.使用的是两种库来进行解析.`loader`类型的库是对于 webpack 来时相当于翻译官,把它在之前不认识的翻译成认识的.

- ### 2.7 自动生成 html 文件,并把打包好的 js 给自动引入

  - 在没有这一步之前,打包成功的话,是把上面的 css 文件以`style`内联样放入到 JS 当中的.并默认对 js 代码进行的压缩.生成了名为 main.js 的文件.

    这个时候就需要我们手动生成 html 文件来手动引入 js.这显然是违背我们自动化的目标的.

    所以这个时候就需要借助`plugins`来进行配置了.

    先试安装`html-webpack-plugin`插件

```js
npm install --save-dev html-webpack-plugin
```

          随后在`webpack.config.js`继续配置

```js
{
plugins: [
  new HtmlWebpackPlugin({
    title: "webpack配置感觉也不是那么复杂的",
    template: "./index.html",
  }),
],
}
```

      - title: 自动生成的 html 的标题名字
      - template: 以这个 html 为模版来生成

          > 默认可以不进行任何的配置,但是这个时候你的 html 的 title 默认会是 Document, 如果要引入第三方库的话,每次打包都需要手动引入,所以 title 和 template 可以说是缺一不可的.

## 四. 不同的打包方式

- 我们不同的环境需要不同的配置,这个就不能单单使用`webpack.config.js`这么一个文件了.当然了,在 vue-cli3.0 中,就是只有一个配置文件的,里面需要的可能配置,都是通过传进去的参数来进行判断.

### 4.1 安装配置合并的插件

```js
npm install webpack-merge -D
```

### 4.2 具体的配置内容

    - 开发环境来做例子,并把生产环境配置的交集部分给删除掉. 包括用到的引入文件

```js
const { merge } = require("webpack-merge");

const baseConfig = require("./webpack.base");
const devConfig = {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    static: "./dist",
    port: 3300,
    proxy: {
      "/api": {
        target: "http://study.jsplusplus.com/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};

module.exports = merge(baseConfig, devConfig);
```

        `webpack.base.js`中的配置和普通的没有什么差别,就是把开发和生产环境的配置内容给集合在一起

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack配置感觉也不是那么复杂的",
      template: "./index.html",
    }),
  ],
};
```

### 4.3 搭配 package.json 快捷使用对应配置

```js
{
"scripts": {
  "build": "webpack --config webpack.pro.js",
  "dev" "webpack --config webpack.dev.js"
}
}
```

## 五、tress Shaking

### 5.1 作用

    - 去除没有使用过的代码

        比如说有如下的文件和代码

```js
// math.js
export const add = (x, y) => {
  return x + y;
};

export const reduce = (x, y) => {
  return x - y;
};
```

        然后在入口文件用引入

```js
const {add} from './math.js'

function init() {
const a = add(1, 2)
console.log(a)
}
```

        上面代码只使用到了 add 这个方法,而 reduce 并没有使用到. 如果这个方法内容很多,但是你由没有使用到,不就白白占用了这么多空间么,所以做好打包之后把它给删除掉.

        而`trees shaking`就是干这件事情.

### 5.2 注意事项

    - 只支持 ES module, 不支持 CommonJs, 因为前者引入是必须要在 top 位置的. 而后者是能够判断的

```js
const flag = true;
if (flag) {
  const test = require("test");
}
```

        而 ES modules 就不能这样操作,不能在{}里面.
    - /_ unused harmony export reduce _/

        出现这个代表你的 tress Shaking 已经生效了.
    - 注意如果是开发环境 development tree shaking 会不生效，因为调试的话 sourceMap 行数会不准，生产环境 production 就会生效

### 5.3 配置方法

    -

```js
{
  mode: 'development',
  optimization: {
    usedExports: true,
  },
}
```

```js
// package.json
{
  "sideEffects": false,
}
```

      > 当 MODE 为 production 的时候,不需要配置 usedExports. 默认生效

      如果配置成 false 的话,会带来问题,就是一些 import 到全局的库也会被干掉.比如 css 文件,lodash 这种库.他们提供 import 到全局的 api,但是没有提供 export 的操作.所以我们为了保住它们,需要让能够实现`tree Shaking`的同时.

```js
{
  "sideEffects": ["@babel/polly-fill", "*.css"]
}
```

### 5.4 实现基本原理

    - 1. ES6 Module引入进行静态分析，故而编译的时候正确判断到底加载了那些模块
        1. 静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码

## 六、代码切割

![](https://secure2.wostatic.cn/static/swWDivAk6CEtLR276vvxe5/截屏2022-03-17 12.31.58.png?auth_key=1755594805-kk9oD9JKFzyceKGxPXVwwH-0-dfb35e3b809d114074d47a9fb2639cd2)

### 6.1 webpack.config.js 配置

```js
{
"optimization": {
  "splitChunks": {
    "chunks": "all"
  }
}
}
```

### 6.2 其他两种配置方法

    更加推荐第一种,方便快捷,无脑

#### 6.21 手动同步方法

    -

```js
{
entry: {
  lodash: './src/lodash',
  index: './index.js'
},
output: {
  filename: '[name].bundle.js',
  path: path.resolve(__dirname, 'dist'),
},
}
```

      手动配置输入文件, 不够自动.

#### 6.22 手动异步方法

    - 其中的”（/_ webpackChunkName: "lodash" _/）“表示对该文件引入后的命名

```js
function getComponent() {
  const element = document.createElement("div");

  // Lodash, now imported by this script
  element.innerHTML = _.join(["Hello", "webpack"], " ");
  return import(/* webpackChunkName: "lodash" */ "lodash")
    .then(({ default: _ }) => {
      const element = document.createElement("div");

      element.innerHTML = _.join(["Hello", "webpack"], " ");

      return element;
    })
    .catch((error) => "An error occurred while loading the component");
}

document.body.appendChild(component());
getComponent().then((component) => {
  document.body.appendChild(component);
});
```

### 6.3 详细配置

    -

```JavaScript
{
optimization: {
  splitChunks: {
    chunks: 'all', // async 表示只对异步代码分割，initial 表示只对同步代码分割，all的话是所有同时会走到cacheGroups.vendors
    minSize: 30000, // 表示最小模块大于30000个字节才会做代码分割
    // maxSize: 50000, // 如果拆分的代码大小超过50000,会进行二次拆分，一般配置的比较少
    minChunks: 1,//引入几次才分割打包，如果只引入1次就分割，如果是2表示必须大于等于2次才做代码分割
    maxAsyncRequests: 5,// 表示不能超过5个模块分割，超过后面的模块就不分割了
    maxInitialRequests: 3,// 表示整个网站首页或入口文件 如果做代码分割不超过3个
    automaticNameDelimiter: '~', //组和文件名链接符号 vendors~main.js
    name: true,// 表示要更新名字，一般是不需要改变的
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/, // 如果在node_modules里，那么会打包到vendors.js
        priority: -10, // 比如jquery 符合vendors 也符合default，值越大，说明优先级更大
        filename:'vendors.js' // 表示所有的第三方打包到一个叫vendors.js文件
      },
      default: { // 如果是引入自己在项目里写的模块引入走这里，非node_modules
        // minChunks: 2,
        priority: -20,// 值越大，说明优先级更大
        reuseExistingChunk: true, // 如果代码已经打包过，重复引用时就不会再分割打包，而是复用之前的。
        filename: 'common.js'
      }
    }
  }
},
}
```

## 七、懒加载

- 其实和上面的代码分割逻辑是一样的.vue 中也存在路由懒加载.都是一个意思. **需要使用到的时候才进行加载**.

## 八、css 代码分割

- 需要安装两个插件来进行搭配使用,配置的文件可以直接看对应插件的文档.

```js
npm install --save-dev css-minimizer-webpack-plugin mini-css-extract-plugin
```

- mini-css-extract-plugin: css 代码分割出来
- css-minimizer-webpack-plugin: 压缩 css 代码

## 九、浏览器缓存问题

- 配置起来很简单,目的也很直接,就是直接修改文件名字

```js
{
output: {
  filename: "[name].[contenthash:8].js",
}
}
```

      contenthash 代表根据内容生成的 hash 值,一共 8 位. 8 是可以自己替换的,不写也行.默认 16 位

      至于为何能够解决浏览器缓存的问题,这就需要知道浏览器缓存的逻辑,[[HTTP基础]]

## 十、webpack 性能优化

### 10.1 优化构建速度

    - babel
    - js 缓存, cacheDirectory
        - 指定要编译文件和不需要编译的文件: include: srcPath 和 exclude: path.resolve(__dirname, 'node_modules)
        - IgnorePlugin: 不引入指定的代码,最终产出的代码没有相应的代码
        - noParse: 不做任何操作,打包中存在
        - happypack:

            > IgnorePlugin 也可以优化产出体积
    - 从三个方法入手: **优化搜索时间、缩小文件搜索范围、减少不必要的编译**

### 10.2 优化产出代码体积

    - IgnorePlugin: 不引入指定的代码,最终产出的代码没有相应的代码

# NodeJS-net 模块和 Http 模块

## 前言

这节内容会设置到如何完整的展示一个 html 页面,以及其上的图片样式. 其中涉及到了 fs 模块的知识和 buff 的概念.
要渲染一个 html 页面,自然就要涉及到报文, 所以也会简单的解释一下报文的概念.

正文如下.

## HTTP 报文

在 TCP/IP 协议中,我们经常会听到`请求报文`,`响应报文`这样的字眼.

顾名思义. 由于 B/S 架构的标准是基于 HTTP 协议，客户端发送请求，服务器给出响应的一问一答形式进行通信。所以很明显, `请求报文`就是客户端发出的, 而`响应报文`就是服务端发给客户端的,从语义而知,是为了回复请求,所以要响应.

它们可以统称为`HTTP报文`, 作用就是用于规范信息的格式. 所以也叫`协议`.

`协议`类比到我们生活中, 我们在入职新公司的,就需要牵劳动合同,保密协议, 这些都是协议, 他们都是有固定需要需要的内容, 比如说甲方、乙方、日期、印章、正文等. 如果没有这些固定的内容话,那么协议就没有任何意义.

`HTTP报文` 也是如此,它有固定的格式,你只要按照这个格式填写上对应的信息, 客户端和服务端才能够识别出你的意思, 才算是一个有效的协议.

`HTTP报文`的格式如下:

![http报文.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18a6b92d4af44241958c86fa92843b25~tplv-k3u1fbpfcp-watermark.image?)

图片出自《图解 HTTP》. 上面是`请求报文`, 下面是`响应报文`.

- 报文主体是不一定要有的

如图所示, 隐藏的内容还有换行,空行等. 对应的实体是`\r`和`\n`.

对于图中各个字段的作用和含义, 可以自行参考图解 HTTP.

## net 模块展示完整的网页

知道了`HTTP报文`相关的概念之后,我们来通过代码来展示报文的具体结果.

和上一章内容一样 net 模块的. 创建我们的服务

```js
// netBrewer.js
const net = require("net");
const post = 3306;
const host = "127.0.0.1";

const server = net.createServer();
server.listen(post, host);

server.on("listening", () => {});
server.on("connection", (socket) => {
  // 浏览器对该域名发起的请求
});
```

随后命令行中输入`node server.js`

打开浏览器,输入`http://localhost:3306?params=1`, 并在`connenction`监听请求的报文

```js
server.on("connection", (socket) => {
  socket.on("data", (data) => {
    console.log(data.toString());
  });
});
```

在控制台就可以看到浏览器的请求报文:

![截屏2022-04-10 22.18.37.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6aa63ae2ff1422396a452669b9d9595~tplv-k3u1fbpfcp-watermark.image?)

也正好和上一节`HTTP报文`对应上了.

此时浏览器就会一直在转圈圈,因为它接收不到服务器响应内容, 所以我在下面中输入要`响应的报文`

```js
server.on("connection", (socket) => {
  socket.on("data", (data) => {
    socket.write("HTTP/1.1 200 OK\r\n\r\n<html><body>hello world</body><head>");
    socket.end();
  });
});
```

值得注意的是,一个报文必须要以`socket.end()`来告诉浏览器数据结束了. 不然它依旧会是转圈圈的状态.

> `socket.end()` 不能写在`socket.on('data')`的外面.因为`data`是一个微任务, 会先执行`end()`

顺利的话, 重启服务器,然后刷新页面,你就可以在页面中看到`hello world`了.

## 通过 fs 模块来获取`html`文件,并响应给浏览器

现在已经能够正常的让浏览器渲染出内容.接下来,我们更进一步,让浏览器渲染的内容更加的贴近我们的实际开发.

我们在使用`react`和`vue`开发完成之后,`npm run build`出来的入口文件一般来说都是`index.html`. 让我们来模拟这一个文件.

创建`index.html`并输入内容

```js
touch index.html
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Test</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- <link href="css/style.css" rel="stylesheet"> -->
  </head>
  <body>
    <h1>今日你学习了嘛?</h1>
    <img src="./img.png" />
  </body>
</html>
```

通过 fs 模块来读取该文件:

```js
server.on("connection", (socket) => {
  socket.on("data", (data) => {
    const dataFile = fs.readFileSync(__dirname + "/index.html");

    console.log(dataFile.toString());

    socket.write("HTTP/1.1 200 OK\r\n");
    socket.write(dataFile);

    socket.end();
  });
});
```

可以在控制台中看到打印出来的`index.html`的字符串. 刷新一下页面应该也能够看到界面渲染的结果.
意外也在这个时候发生来. 出现了一个报错:

![截屏2022-04-10 22.50.04.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bc284a3549043c297a17f878a08f141~tplv-k3u1fbpfcp-watermark.image?)

favicon.ico 图标用于收藏夹图标和浏览器标签上的显示，如果不设置，浏览器会请求网站根目录的这个图标. 我们现在没有指定 favicon.ico 的内容,为了不让它报错,我们可以可以抛出异常的方式来处理.

```js
try {
  const dataFile = fs.readFileSync(__dirname + "index.html");

  console.log(dataFile.toString());
  socket.write("HTTP/1.1 200 OK\r\n");
  socket.write(dataFile);

  socket.end();
} catch (e) {
  socket.write("HTTP/1.1 200 OK\r\n\r\n<body>404</body>");
  socket.end();
}
```

报错的问题已经解决. 当浏览器指定访问地址的是如何处理呢? 这个时候我们就需要解析`请求报文`的内容来做响应的判断:

```js
const url = data.toString().split("\r\n")[0].split(" ")[1];
```

通过简单的字符串截取,就可以获取当前浏览器访问的文件是什么.

完整的代码如下:

```js
const fs = require("fs");
const net = require("net");
const post = 3306;
const host = "127.0.0.1";

const server = net.createServer();
server.listen(post, host);

server.on("listening", () => {});

server.on("connection", (socket) => {
  socket.on("data", (data) => {
    // 1. 解析请求报文
    const url = data.toString().split("\r\n")[0].split(" ")[1];

    try {
      const dataFile = fs.readFileSync(__dirname + url);

      console.log(dataFile.toString());
      socket.write("HTTP/1.1 200 OK\r\n");
      socket.write(dataFile);

      socket.end();
    } catch (e) {
      socket.write("HTTP/1.1 200 OK\r\n\r\n<body>404</body>");
      socket.end();
    }
  });
});
```

> 在响应报文中, 只有在 chrome 浏览器中可以不配置`contentType:text/html`. 其他浏览器不配置是显示不出来的.

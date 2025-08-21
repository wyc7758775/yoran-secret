# NodeJS-Net 模块

## 1. 前言

这是 nodeJs 系列的第一篇文章, 我之前看教程的时候,很多都是从 IO、buffer、path、event、fs、process、node 事件循环机制开始说起的. 这些确实是 node 开发主要依赖的开发依赖. 但是我比较着急, 从了解到 node,就是说 node 可以干后端的话,但是这些课程前半截都在说它拥有的能力,就是最后才到如何和客户端通信的模块介绍.

我很难受,所以在我自己写总结的时候,一定要写先服务端和客户端通信的模块才舒服.即便过程中涉及到了 event 模块、fs 模块的知识点,可以暂时搁置,只从整体来理解`net`模块如何实现通信的.

## 2. OSI 七层协议模型

想要学明白通信模块,就不得不了解网络通信模型,想要记住网络通信模型,就不得不实际操作来辅助记忆. 这个是面试的重点. 这一块内容很多,想要跟深入的了解,还说需要体系的学习的. 这里只是简单提提.

寄出这张老图:

![image_1649504393157_0.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70cb406271a845e58bc995cfac865768~tplv-k3u1fbpfcp-watermark.image?)

对于我们前端而言, 需要记住 TCP/IP 协议簇的体系结果既可.

- 应用层: http(80 端口)、FTP(21)、SMTP(发送邮件)、POP(接收邮件)、DNS

- 传输层: TCP/ UDP

- 网际层: IP,ICMP(是 IP 层的附属协议)

- 数据链路层: PPP, SLIP

- 物理层: 网有双绞线、同轴电缆、光纤等传输方式, 遵循 ISO2110 规范

从`ICMP`这种依附于 IP 协议的协议可以知道,对于网络协议的分层不用过于较劲. `ICMP`明明需要 IP 协议为基础,但是它也被规划为网络层. 我们对于 OSI 模型的正确的认识,我认为应该是用 OSI 模型来进行问题的分析比用来对于协议进行所谓的分层更加来得有意义.

> TCP/IP 协议簇 并不是只是指 TCP 和 IP 协议,只是因为这两个协议过于出圈,所以就用 TCP/IP 来统称互联网相关联的协议集合起来. 还有另外一种说法是,在使用 TCP/IP 协议过程中使用到的协议族的统称.

而客户端和服务端的传输流如下

![图片_1649505674172_0.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72f3e15811b04cd5814185571b799279~tplv-k3u1fbpfcp-watermark.image?)

如果角色变成`发送者`和`接受者`的时候,传输流如下图:

![图片_2_1649505888621_0.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c63933f8d4454244bc1397d04ea01d48~tplv-k3u1fbpfcp-watermark.image?)

 可以看出来传输的过程中,从发送端开始,没经过一层协议都会加上所需要的首部信息.层层把关,层层加码. 然后到了接收端的时候, 就反而行之, 每经过一层都剥去对应的首部. 只等到最后拿到的 HTTP 数据.

> 上面图片出自《图解 HTTP》

上面就是大体的网络协议模型.

疑惑: 为什么书上和很多地方在把 OSI 体系结果中合并成 TCP/IP 五层协议之后,网络层的名称会变成网际层呢?

## 3. TCP 连接

![image_1649509541746_0.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07786cf55a4246c5b91a5d1059111f8a~tplv-k3u1fbpfcp-watermark.image?)

第一次握手: 客户端向服务端发送 SYN 标志位(序号是 J), 并进入 SYN_SENT 状态(等待服务端确认状态)

第二次握手: 服务端收到来自客户端的 SYN J, 服务端会确认该数据包已收到并发送 ACK 标志位(序号是 J + 1)和 SYN 标志位(序号是 K), 随后进入 SYN_REVD 状态(请求接受并等待客户端确认状态)

第三次握手: 客户端进入连接建立状态后,向服务端发送 ACK 标志位(K+ 1) , 确认客户端已收到建立连接,服务器收到 ACK 标志后,服务端进入连接已建立状态.

> J 和 K 都是为了确立是谁在请求. SYN 和 ACK 的结构没有什么不同,只是发送的对象不一样.

## 4. net 模块

`net模块`就是对于上面 TCP 连接的具体实现.

首先, 学习 API 依旧推荐直接进入[官方文档](https://nodejs.org/dist/latest-v17.x/docs/api/net.html). 其中[中文文档](http://nodejs.cn/api/index.html)内容不会是最新版本的

> 在学习的时候,能够有时间看英文文档就尽量看英文文档. 对于这一点我坚持了半年. 从一开始看不下去,直到现在能够可以忍住不舒适感看下去. 半年时间进步就很明显了. 而且这种不舒适感是一件好事,说明这个不是你的舒适区,毕竟勇于跨过自己的舒适区才是进步的源泉

接下来,进行正题.既然要学习通信,那么我们就需要两个对象来模拟客户端和服务端.分别建立`client.js`和`service.js`两个文件. 通过命令行创建:

```bash
touch client.js && touch service.js
```

### 4.1 service.js 部分

 引入`net`模块,并让服务器进入`LISTENT`状态, 以及配置端口号和 HOST 地址(手动略过 DNS 解析过程), 等待客户端的召唤

```js
const net = require("net");
const post = 3306;
const host = "127.0.0.1";

const server = net.createServer();
server.listen(post, host);
```

此时服务器对应了 TCP 连接中服务器`LISTEN`状态.

随后监听一些必要的事件,也就是 server 提供的钩子. (属于 event 相关知识)

```js
server.on("listening", () => {
  console.log("服务器已经可以连接啦");
});

server.on("connection", (socket) => {
  console.log("有客户端来访咯");
});

server.on("close", () => {
  console.log("服务器关闭了");
});

server.on("error", (error) => {
  console.log("服务器出错啦: ", error); // error 有错误的信息
});
```

上面这一串代码涉及到了,

- `listening`: 监听端口后出发的事件
- `connection`: 有客户端来访的时候触发事件
- `close`: 服务器关闭触发
- `error`: 服务器出错触发

对于`close`我们需要注意的是,后台大哥一般是直接

```bash
ps
kill -9 pid
```

通过杀死线程的方式来进行的

在`connection`狗子中, 形参是 socket 命名. 它的中文翻译为嵌套字, 被 node 封装成了 stream(流).在可以粗浅的理解为就是客户端发送过来的数据. 这是这个数据自身是有方法的. 我在`connection`中对`socket`来进行处理

```js
server.on("connection", (socket) => {
  console.log("有客户端来访咯");

  socket.on("data", (data) => {
    console.log(data); // 客户端发送过来的数据
  });
});
```

> stream 以后的文章会进行介绍.

服务端既然能够接受客户端发过来的数据,自然也能够给客户端回复. 在`socket.on`中写入(当然也可以写在外面):

```js
socket.write("我已经收到你的服务器了哦,客户端");
```

此时如果客户端已经完成了数据的接受,然后关闭了连接.我们可以也可以通过`socket.on('close‘)`钩子监听到:

```js
socket.on("close", () => {
  console.log("客户端把另外一头的流给关了");
});
```

对于`socket`事件的总结放入`client.js`中.
此时`service.js`的所有内容如下:

```js
const net = require("net");
const post = 3306;
const host = "127.0.0.1";

const server = net.createServer();
server.listen(post, host);

server.on("listening", () => {
  console.log("服务器已经可以连接啦");
});

server.on("connection", (socket) => {
  console.log("有客户端来访咯");

  socket.on("data", (data) => {
    console.log(data); // 客户端发送过来的数据

    socket.write("我已经收到你的服务器了哦,客户端");
  });

  socket.on("close", () => {
    console.log("客户端把另外一头的流给关了");
    server.close(); // 客户端已经不要数据了,那么我们就把服务器给关闭了吧
  });
});

server.on("close", () => {
  console.log("服务器关闭了");
});

server.on("error", (error) => {
  console.log("服务器出错啦: ", error); // error 有错误的信息
});
```

### 4.2 client.js 部分

客户端的就简单很多.

```js
const net = require("net");
const post = 3306;
const host = "127.0.0.1";

const socket = net.connect(post, host);

socket.on("connect", () => {
  console.log("已经连接到服务器了哦");
});

socket.write("服务器, 我来了");
socket.on("data", (data) => {
  console.log(data.toString());
  socket.end();
});

socket.on("close", () => {
  console.log("连接已关闭了");
});
```

对于`socket`的事件的总结

- `connect`: 成功和服务器连接触发
- `data`: 接受到服务器发过来的参数
- `end`: 数据接收完毕之后可以触发
- `close`: socket 关闭触发

`service.js`和`client.js`框架已经写完, 那些先后在打开两个终端运行他们:

```bash
node service.js
node client.js
```

自行查看打印的结果.

整个 TCP 连接的框架大体就已经完成了. 当然实际的生产远远不止这些. 还要处理粘包、拆包/封包, 心跳包等等.

下一篇会结合实际浏览器发起请求来继续完善对于`net`模块的描述.

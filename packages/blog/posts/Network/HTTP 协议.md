<img width="60%" src="https://yoran-images-1256970527.cos.ap-guangzhou.myqcloud.com/20250824213628776.png" />

# HTTP 协议

HTTP 协议可以等同于合同，大家按照合同办事就好，这个大家指的是浏览器和服务端，换句话来说就是它们之间的通信规则。

它本身是没有什么业务逻辑的，只存在通信规则的逻辑，所以我们作为一个 WEB 前端的开发而言，平时接触的 fetch 和 Axios 都是对于 HTTP 协议的使用。

所以我们学习的重点放在如下地方：

1. 业务开发的高频问题
   1. 跨域（CORS）
   2. 缓存优化（强缓存和协商缓存）
   3. 上传/下载进度
   4. 鉴权（JWT、 Cookie）
2. 性能提升
   1. HTTP/2 和 HTTP/3 带来的特性
3. 调试和后端协作技巧
   1. 接口调式（看得懂 Network 面试，请求方法、状态码、请求头/响应头，快速定位问题）
   2. 和后端协作（method、参数格式、返回格式，扩展的知识点 RESTfull 和）

> 推视频课程: https://www.bilibili.com/video/BV1rt4y1m7o5?p=5
> 推介书籍：《图解 HTTP 》

## HTTP 协议包含的内容

1. 请求报文

```http
GET /api/data HTTP/1.1      ← 起始行
Host: example.com           ← 头部
User-Agent: Chrome
Accept: application/json    ← 空行分隔头部和主体
                            ← 主体（此请求没有主体）
```

- 第一行：请求方法（GET）、资源路径（/index.html）、协议版本（HTTP/1.1）。
- 后续行：请求头（描述浏览器信息、可接受的内容类型等）。

2. 响应报文

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<!DOCTYPE html>
<html>...</html>
```

- 第一行：协议版本、状态码（200）、状态描述（OK）。
- 后续行：响应头（内容类型、长度等）。
- 空行后是响应体（实际返回的 HTML 内容）。

实际的场景 network 显示如下：

<img width="60%" src="https://yoran-images-1256970527.cos.ap-guangzhou.myqcloud.com/20250824232530716.png" />

**请求头如下：**

```http
GET /yoran-secret/observer-detail.html?src=/life/xxxxx.md HTTP/2
Host: wyc7758775.github.io
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate, br, zstd
Sec-GPC: 1
Connection: keep-alive
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: none
Sec-Fetch-User: ?1
If-Modified-Since: Sun, 24 Aug 2025 12:30:13 GMT
If-None-Match: W/"68ab05d5-4660"
Priority: u=0, i
```

**响应头如下：**

```http
HTTP/2 304
date: Sun, 24 Aug 2025 15:02:39 GMT
via: 1.1 varnish
cache-control: max-age=600
etag: W/"68ab05d5-4660"
expires: Sun, 24 Aug 2025 15:12:39 GMT
x-served-by: cache-qpg1224-QPG
x-cache: MISS
x-cache-hits: 0
x-timer: S1756047759.443579,VS0,VE242
vary: Accept-Encoding
x-fastly-request-id: f28eeca139135be912285ed1f25113ba29ddc43a
X-Firefox-Spdy: h2
```

> 想要在 network 面板中查看 HTTP/2 的只能在火狐中查看，谷歌浏览器看不到。具体请看：https://stackoverflow.com/questions/40800140/how-does-view-source-in-response-headers-go-missing-for-certain-sites

## 业务开发高频问题

### 跨域（CORS）

JSONP、服务器反向代理（ng 配置和 vite 配置 proxy）、服务端配置白名单

1. ~~JSONP~~： 已经不在使用

2. Vite 的 proxy 配置：

```js
server: {
	proxy:{
		"/api": {
			target: "http://xxx.xxx.xx.x:8080",
			changeOrigin: true, // 允许跨域
			secure: false, //忽略安全证书
			rewrite: (path) => path.replace(/^\/api/, '')
		},
	},
}
```

当我需要请求的地址为`http://xxx.xxx.xx.x:8080/user/login`  则我们在 vue 里使用 axios 发起请求为 `axios.get('/api/user/login')`。

3. 生产环境 NG 配置

**生产环境使用 Nginx 反向代理 ​**​：

部署时通过 Nginx 配置反向代理，将前端静态资源（如  `https://your-domain.com`）的请求转发到跨域接口（如  `https://api.other-domain.com`）。

```nginx
server {
  listen       443 ssl;          # 监听 HTTPS 端口
  server_name  api.example.com;   # 实际域名

  # SSL 证书配置（替换为实际证书路径）
  ssl_certificate /path/to/fullchain.pem;   # 证书文件
  ssl_certificate_key /path/to/privkey.pem; # 私钥文件

  # 强制 HTTP 跳转 HTTPS（可选）
  if ($scheme != "https") {
    return 301 https://$host$request_uri;
  }

  # 反向代理规则（同上）
  location /api {
    proxy_pass http://localhost:8080/api;
    proxy_set_header Host $host;
    # ...其他头信息
  }
}
```

### 缓存优化（强缓存和协商缓存）

具体看[[HTTP 缓存机制]]

### 上传/下载进度

浏览器对于这部分的实现有两种方式，`fetch`和`XHR`。

`XHR`作为传统的网络实现，自带了`progress`事件实现监听下载进度，自带`upload`属性用于监听上传进度。

```js
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://example.com/large-file.zip");

// 监听下载进度
xhr.addEventListener("progress", (e) => {
  if (e.lengthComputable) {
    const percent = (e.loaded / e.total) * 100;
    console.log(`下载进度：${percent.toFixed(1)}%`);
  } else {
    console.log("总大小未知，无法计算百分比进度");
  }
});

// 监听上传进度
const upload = xhr.upload;
upload.addEventListener("progress", (e) => {
  if (e.lengthComputable) {
    const percent = (e.loaded / e.total) * 100;
    console.log(`上传进度：${percent.toFixed(1)}%`);
  } else {
    console.log("总大小未知，无法计算百分比进度");
  }
});

xhr.onload = () => {
  console.log("下载完成");
};
xhr.send();
```

`Fetch` API 的不提供，需要`ReadableStream` 和 请求头配置`Content-Length`来获取上传的进度，比较复杂，这里不展开说，我也没记住, 核心就是 fetch 需要配置其他的 API 来实现 xhr 中对应的功能，包括中断请求。

```js
const file = ... // 你要上传的文件
let uploaded = 0;
const total = file.size;
const stream = new ReadableStream({
	async start(controller) {
		const reader = file.stream().getReader();
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			controller.enqueue(value);
			uploaded += value.length;
			// 这里可以更新进度条
			console.log(已上传: ${uploaded} / ${total});
		}
		controller.close();
	}
});

fetch('/upload', {
	method: 'POST',
	body: stream,
	headers: {
		'Content-Type': 'application/octet-stream',
		'Content-Length': total
	}
});
```

### 鉴权（JWT、 Cookie）

HTTP 协议是无状态的。

无状态的概念就是服务器不会通过 HTTP 协议来判断你是谁，不知道你是谁，自然就不会联系上下文，你不知道你知道问过什么？因为服务器要应对的不单单是你一个人。

**举个例子 🌰**：

- **有状态**：你和朋友聊天，朋友记得你之前说过的话（比如：“你上次说要去旅游，去了吗？”）。
- **无状态**：你每次给客服打电话，客服每次接电话都像第一次见你（比如你第一次说“我要订餐”，第二次说“我要付款”，客服不会自动关联这两次请求）。

设你用浏览器访问一个网站：

1. 第一次请求：你登录网站，服务器返回“登录成功”。
2. 第二次请求：你点击“查看购物车”，**服务器不知道你是谁**，因为它没记住你上次登录过！

**结果**：你每次操作（比如查看购物车、下单），服务器都像第一次见到你，需要你反复证明自己的身份。

- **简单高效**：服务器不用费心思记每个用户的状态，能轻松处理海量请求。
- **适合早期网页**：早期的网页只是展示静态内容（比如新闻），不需要记住用户。

所以问题就来了，我们实际业务中，确实是需求知道用户是谁的。那么就用以下的其他手段来解决这个问题了（扩展）

#### **方法 1：Cookie**

- 原理：服务器在第一次返回响应时，通过`Set-Cookie`头告诉浏览器：“存一个身份证（Cookie）”。
- 后续请求：浏览器每次自动带上这个 Cookie，服务器就知道你是谁了。
- 例子：登录后，服务器给你一个 Cookie，之后你每次访问页面都自动带着它，服务器就知道你是已登录用户。

#### **方法 2：Session**

- 原理：服务器在内存或数据库中存一个用户状态（比如 Session ID），通过 Cookie 把 Session ID 传给浏览器。
- 例子：你登录后，服务器生成一个 Session ID 存起来，并通过 Cookie 给你，后续请求用这个 ID 找到对应的 Session 数据。

#### **方法 3：Token（如 JWT）**

- 原理：服务器生成一个加密的 Token（令牌），里面直接包含用户信息，浏览器每次请求带着这个 Token。
- 例子：登录后服务器返回一个 Token，后续请求在`Authorization: Bearer <token>`头中带上它，服务器解密后就知道你是谁。

但是这样不是违背初衷了吗？直接给 HTTP 设计为有状态的不就可以了吗？如果面试官问：“HTTP 无状态是缺点吗？为什么不直接设计成有状态？”

**可以回答**： **“HTTP 的无状态设计是权衡后的结果。早期为了简单高效，它不需要维护状态，适合传输静态资源。后来为了满足动态交互需求，通过 Cookie 等机制在应用层扩展了状态管理，而不是修改协议本身。这种分层设计既保持了 HTTP 的轻量，又让开发者能灵活应对业务需求。”**

Cookie 和 JWT 的区别：

- ​Cookie 的局限性 ​：依赖同源策略，跨域（如前端  `app.example.com`调用后端  `api.example.com`）需额外配置 CORS，且 Cookie 无法直接用于移动端（无浏览器环境）。
- ​JWT 的优势 ​：作为请求头（如  `Authorization: Bearer <token>`）的一部分，天然支持跨域；移动端可直接存储 Token 并随请求发送，无需依赖 Cookie。

> JWT 或 Cookie 的使用场景高度依赖后端的架构设计、技术选型和业务需求 ​​。前端的选择往往是“被动适配”。

## 提升性能和体验

- HTTP/0.9
  - 仅支持 Get 请求
  - 仅支持 HTML 格式资源
- HTTP/1.0
  - 增加 POST 和 HEAD 请求方式
  - 支持多种数据格式的请求和访问
  - 支持 cache 缓存功能
  - 新增状态码、多字符集支持、内容编码等
  - 早起 HTTP/1.0 不支持 Keep-alive 长连接,只支持串行连接
  - 后期 HTTP/1.0 增加 Connection:keep-alive 字段(非标准字段),开始支持长连接
- HTTP/1.1
  - 增加持久连接（默认开启 Connection: keep-alive)
  - 增加管道机制（支持多个请求同时发送）
  - 增加 PUT/PATCH/OPTION/DELETE 等请求方式
  - 增加 Host 字段（指定服务器域名）-＞案例：搜素百度 查看 network
  - 增加 100 状态码 (Continue）,支持貝发送头信息
  - 扩展身份认证机制（配合 SSL 实现数据的安全传输）
  - 支持传送内容的一部分和文件断点续传
  - 新增了 24 个错误状态码
- HTTP/2.0
  - 新增双工通道(客户端同时发起多个请求,服务端同时处理多个请求)
  - 服务端推送(服务器会把客户端需要的资源一起推送到客户端,合适加载静态资源)
  - 头信息压缩机制(每次请求都会带上所有信息发给服务端)(HTTP 协议不带状态)
  - 二进制协议(头信息和数据体使用二进制进行压缩)
  - 多工(新增会先发送已处理好的部分，再响应其他请求，最后再处理没有处理好的部分)
- HTTP/3（2018 年草案，2020 年正式发布）
  - 底层协议变革：
    - 基于 QUIC 协议（UDP 实现），避免 TCP 的队头阻塞，提升移动网络下的连接稳定性 18；
    - 0-RTT 建连：复用会话上下文，减少握手延迟 12；
    - 独立流控制：每个数据流独立处理，丢包不影响其他流 68；
    - 连接迁移：通过`Connection ID`标识连接，切换网络时无需重建 12。
  - 意义：为高延迟、高丢包场景（如 5G、物联网）提供更优性能 28。

版本更新中有一些 feature 扩展:

- `keep-alive`
  - 每次请求都需经历 ​**​TCP 三次握手 ​**​（建立连接）和 ​**​ 四次挥手 ​**​（关闭连接）的开销（约 100ms~300ms，取决于网络延迟）；
  - 若网页包含多个资源（如图片、CSS、JS），每个资源都需单独建立 TCP 连接，导致“连接数爆炸”（例如一个页面加载 10 个资源，需 10 次 TCP 连接）, `keep-alive` 解决的就是这个。
- 双工通道（`keep-alive` 的 patch）
  - 多个请求共享同一个 TCP 连接，服务端只需维护少量长连接（如 1 个连接处理 100 个请求），资源利用率更高。
  - 10 个资源的请求通过多路复用并行传输，总耗时接近单个请求的延迟（如 100ms），加载速度提升 90%。 而`keep-alive`还是要串行传输，用时 1000ms。
- QUIC
  - 融合 UDP 性能和 TCP 的可靠性

这三点也是重要的性能提升，除此之外，还有配置`Content-Encoding: gzip` ，应用层调用压缩算法对于请求头和响应头进行压缩，降低传输数据的负载，这个也是一个很重要的性能优化。

## 调试和后端协作

RESTfull 规范参考路径：https://www.ruanyifeng.com/blog/2014/05/restful_api.html

- 通用 HTTP 状态码

| 类型 | 说明                                          |
| ---- | --------------------------------------------- |
| 1xxx | 信息,服务器收到请求,需要请求者继续执行操作    |
| 2xxx | 操作成功并被接受处理                          |
| 3xxx | 重定向,需要进一步的操作以完成请求             |
| 4xxx | 客户端错误,请求包含语法错误或无法完成请求     |
| 5xxx | 服务器端的锅,服务器在处理请求的过程中发生错误 |

#### 304 重定向

重定向的出现和[[HTTP 缓存机制]]有直接的关系.
在 HTTP 响应报文是默认配置的情况下,页面在已经访问过之后,再次访问的话,就有**可能**返回 304 的状态. 数据是直接从缓存中拿.

#### 503 服务器错误

找后台去处理吧

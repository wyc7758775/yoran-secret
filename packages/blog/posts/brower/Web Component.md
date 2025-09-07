---
category:
  - slow-burn
smallClass:
  - 架构师
state:
---

# Web Component

将他作为我组件的一个技术，我要先知道前端组件需要什么样的能力才能够满足我的需求。

1. 数据驱动
2. 双向数据绑定 & 事件通信
3. 插槽
4. 样式隔离
5. 生命周期

写法和 react 基本一致

|概念|Web Components (原生 Class)|React Class 组件|说明|
|---|---|---|---|
|​**​基础结构​**​|`class MyElement extends HTMLElement`|`class MyComp extends React.Component`|都是通过​**​继承​**​一个基类来创建组件。|
|​**​初始化​**​|`constructor()`中初始化状态、创建 Shadow DOM|`constructor(props)`中初始化 `this.state`、绑定事件|都在构造函数中进行初始化准备。|
|​**​挂载​**​|`connectedCallback()`(元素插入DOM时)|`componentDidMount()`(组件挂载后)|都用于执行DOM操作、数据获取等“挂载后”操作。|
|​**​卸载​**​|`disconnectedCallback()`(元素从DOM移除时)|`componentWillUnmount()`(组件卸载前)|都用于清理工作，如移除事件监听器、清除定时器。|
|​**​属性/状态变化​**​|`attributeChangedCallback(name, oldVal, newVal)`(需配合 `static get observedAttributes()`)|`componentDidUpdate(prevProps, prevState)`或 `static getDerivedStateFromProps(props, state)`|都提供了响应外部输入（属性/Props）变化的钩子。|
|​**​渲染UI​**​|在生命周期回调中手动操作DOM（如 `this.shadowRoot.innerHTML = ...`）|​**​必须​**​实现 `render()`方法，返回JSX|

下面写一个它最小的的案例：

```js
class MyCard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.render()
  }

  connectedCallback() {
    console.log('DOM 渲染完毕之后的 hook!!!')
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title' || name === 'content') {
      this.render()
    }
  }

  render() {
    const title = this.getAttribute('title')
    const content = this.getAttribute('content')
    this.shadowRoot.innerHTML = `
			<style>
				.card {
					border: 1px solid #ccc;
					border-radius: 8px;
					padding: 16px;
					margin: 16px;
					width: 300px;
				}
			</style>
			<div class="card">
				<h2>${title}</h2>
				<p>${content}</p>
			</div>
		`
  }
}
```

在 html 中直接使用如下：

```html
	<my-card title="我是标题" content="我是内容"></my-card>
```

看起来似乎非常的美好，但是这里面有一个很大的问题，那么就是视图渲染的问题，看`this.render`函数的调用。

vue3 和 react 都实现了一个虚拟 DOM，配合diff 算法来实现局部的DOM渲染，保证一定的性能，但是 webComponent 是需要自己或者去找第三方的库去实现的，上限很高，下限更高，完全不适合企业做业务做业务。

## web component 如何定义模板

1. innerHTML（上面的案例）：只适合用来学习
2. DOM API 方法（推荐）

```javascript
// 替代方案1：使用 DOM API
function createBasicShadowDOMWithAPI() {
  const host = document.getElementById('basic-host')
  const shadowRoot = host.attachShadow({ mode: 'open' })

  // 创建样式元素
  const style = document.createElement('style')
  style.textContent = `
        .shadow-content {
            font-size: 18px;
        }
    `

  // 创建内容元素
  const contentDiv = document.createElement('div')
  contentDiv.className = 'shadow-content'
  contentDiv.textContent = '这是 Shadow DOM 内容！'

  const infoDiv = document.createElement('div')
  infoDiv.textContent = '这个内容在 Shadow Root 中，与外部文档隔离'

  // 添加到 Shadow Root
  shadowRoot.appendChild(style)
  shadowRoot.appendChild(contentDiv)
  shadowRoot.appendChild(infoDiv)
}
```

这个也是 vue/react 这种现代框架中 jsx 或者template使用的方法.

### 3. **HTML Template 方法（最佳实践）**
```html
<!-- 在 HTML 中定义模板 -->
<template id="basic-shadow-template">
    <style>
        .shadow-content {
            font-size: 18px;
            margin-bottom: 10px;
        }
        .shadow-info {
            font-size: 14px;
            opacity: 0.9;
        }
    </style>
    <div class="shadow-content">这是 Shadow DOM 内容！</div>
    <div class="shadow-info">这个内容在 Shadow Root 中，与外部文档隔离</div>
</template>
```

```javascript
// 使用模板
function createBasicShadowDOMWithTemplate() {
  const host = document.getElementById('basic-host')
  const shadowRoot = host.attachShadow({ mode: 'open' })

  // 获取模板
  const template = document.getElementById('basic-shadow-template')

  // 克隆模板内容
  const templateContent = template.content.cloneNode(true)

  // 添加到 Shadow Root
  shadowRoot.appendChild(templateContent)
}
```

### 4. **构建器模式**
```javascript
class ShadowDOMBuilder {
  constructor(host) {
    this.host = host
    this.shadowRoot = host.attachShadow({ mode: 'open' })
    this.styles = []
    this.elements = []
  }

  addStyle(css) {
    this.styles.push(css)
    return this
  }

  addElement(tagName, attributes = {}, textContent = '') {
    const element = document.createElement(tagName)

    // 设置属性
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value
      }
      else {
        element.setAttribute(key, value)
      }
    })

    if (textContent) {
      element.textContent = textContent
    }

    this.elements.push(element)
    return this
  }

  build() {
    // 添加样式
    if (this.styles.length > 0) {
      const style = document.createElement('style')
      style.textContent = this.styles.join('\n')
      this.shadowRoot.appendChild(style)
    }

    // 添加元素
    this.elements.forEach((element) => {
      this.shadowRoot.appendChild(element)
    })

    return this.shadowRoot
  }
}

// 使用构建器
function createBasicShadowDOMWithBuilder() {
  const host = document.getElementById('basic-host')

  new ShadowDOMBuilder(host)
    .addStyle(`
            :host {
                display: block;
                padding: 20px;
                background: linear-gradient(45deg, #ff6b6b, #feca57);
                border-radius: 10px;
                color: white;
                font-weight: bold;
                text-align: center;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            .shadow-content {
                font-size: 18px;
                margin-bottom: 10px;
            }
        `)
    .addElement('div', { className: 'shadow-content' }, '🎉 这是 Shadow DOM 内容！')
    .addElement('div', { className: 'shadow-info' }, '这个内容在 Shadow Root 中，与外部文档隔离')
    .build()
}
```

### 现代框架方式（Vue/React）
```javascript
// 使用 Vue 的 defineCustomElement
import { defineCustomElement, ref } from 'vue'

const MyComponent = defineCustomElement({
  setup() {
    const content = ref('这是 Shadow DOM 内容！')
    return { content }
  },
  template: `
        <div class="shadow-content">{{ content }}</div>
        <div class="shadow-info">这个内容在 Shadow Root 中，与外部文档隔离</div>
    `,
  styles: [`
        :host {
            display: block;
            padding: 20px;
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            border-radius: 10px;
            color: white;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .shadow-content { font-size: 18px; margin-bottom: 10px; }
        .shadow-info { font-size: 14px; opacity: 0.9; }
    `]
})

customElements.define('my-component', MyComponent)
```

**这个也是 vue 和 react 能够构建成 web component 的基础。**

### 推荐使用场景

* 推荐使用 Template 方法：**
	- 静态内容较多
	- 需要重复使用
	- 关注性能和安全性

* 推荐使用 DOM API：
	- 需要动态创建内容
	- 内容相对简单
	- 需要精确控制

* 推荐使用框架方式：
	- 复杂的交互逻辑
	- 需要状态管理
	- 团队熟悉相关框架

## 如何修改Web Component 内部的样式

```js
<!DOCTYPE html>
<html>
<head>
    <title>最简 adoptedStyleSheets 示例</title>
</head>
<body>
    <h1>adoptedStyleSheets 最小案例</h1>

    <!-- 使用组件 -->
    <my-card>Hello World</my-card>

    <!-- 控制按钮 -->
    <button onclick="changeStyle()">改变样式</button>
    <button onclick="resetStyle()">重置样式</button>

    <script>
        // 🟢 Web Component
        class MyCard extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });

                // 默认样式
                const defaultSheet = new CSSStyleSheet();
                defaultSheet.replaceSync(`
                    div {
                        padding: 20px;
                        background: lightblue;
                        border-radius: 8px;
                        margin: 10px;
                    }
                `);

                // 应用样式
                this.shadowRoot.adoptedStyleSheets = [defaultSheet];

                // 内容
                this.shadowRoot.innerHTML = `<div><slot></slot></div>`;
            }

            // 🟢 添加新样式（覆盖效果）
            addStyle(css) {
                const newSheet = new CSSStyleSheet();
                newSheet.replaceSync(css);
                this.shadowRoot.adoptedStyleSheets = [
                    ...this.shadowRoot.adoptedStyleSheets,
                    newSheet
                ];
            }

            // 🟢 重置样式
            resetStyle() {
                this.shadowRoot.adoptedStyleSheets = [this.shadowRoot.adoptedStyleSheets[0]];
            }
        }

        customElements.define('my-card', MyCard);

        // 🟢 改变样式
        function changeStyle() {
            const card = document.querySelector('my-card');
            card.addStyle(`
                div {
                    background: red !important;
                    color: white;
                    transform: rotate(5deg);
                }
            `);
        }

        // 🟢 重置样式
        function resetStyle() {
            const card = document.querySelector('my-card');
            card.resetStyle();
        }
    </script>
</body>
</html>
```

可以看到，如果修改修改 shadow dom 内部的样式，需要 web component 中的组件提供接口，然后外边使用`addStyle`来改变，或者`resetStyle`重置样式。内部的会涉及到了
- new CSSStyleSheet()
- sheet.replaceSync(cssText)
- sheet.replace(cssText) (异步)
- shadowRoot.adoptedStyleSheets = [sheet1, sheet2]

当让可能还有其他的方式，但是这个是官方推荐的方法。这里也验证了Web component 为什么不合适现代的开发节奏的原因。

## 问题

使用原生的 Web Component 来实现 UI 框架的话，最大的问题就是开发成本的问题，状态管理没有、生态系统很少，样式封装没有、还有各种在习以为常的 Vue 和 react 的功能。所以我大多数都是将 vue 和 react 构建成 Web Component，这个也是主要的手段。

那么使用 vue/react 构建成 Web Component 还有其他的问题吗?

如果是构建成一个组件库会有如下的问题：
1. 运行时体积
	* 每个组件都要**自包含框架运行时**。
    * Vue 3 最小运行时 ≈ 34 KB（gzip）。
    * React 18 + react-dom ≈ 42 KB（gzip）。
	* 如果页面里用了 5 个这样的 Web Component，就会**重复加载 5 份运行时**；而普通 Vue 项目里所有组件共享一份运行时。

2. 运行时性能
    * ***Shadow DOM 与 Vue/React 的虚拟 DOM 双 diff**
    * Vue/React 先在自身 VDOM 里 diff 一次，再同步到 Shadow DOM；
    * 事件冒泡、插槽、样式穿透都要额外桥接，导致**更新耗时 ×1.5~2**。

3. 生态 & 调试
    * **第三方 UI 库难用**
    * 你想在 Web Component 里用 ElementPlus/Ant Design，但它们内部依赖全局样式、全局插件，**直接塞进去就样式错乱**。

如何是在一个业务项目中打包构建成`web component`的话，会有如下问题：
1. router 会识别不出来
2. 国际化 `${time}`
3. 别人无法识别

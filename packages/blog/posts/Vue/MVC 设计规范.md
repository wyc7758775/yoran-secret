# MVC 设计规范

想要真正的明白 MVC 的框架是需要大量的实战的. 而 MVC 框架是 MVVM 框架的前置知识. 而 MVC 框架带的前置知识是整个 JavaScript 知识体系.

MVC 是 `Model`、`View`、`Controller` 三个的缩写合并而成.
今天的我的目标是要创造一个能够自加自减的工具. 点击 + 可以增加岁数, 减就减少对应的岁数.如图所示:

![截屏2022-02-20_23.04.13_1645369499011_0.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afb7b0e8150a46f3b891381815f52b4c~tplv-k3u1fbpfcp-watermark.image?)

## 接下来进入 code 缓解, 现在需要创建一个容器来承载接下来的内容

```html
<body>
  <div id="app"></div>
</body>
```

还需要创建对应的三个对象来分别对应 MVC 三部分:

```js
(function () {
  const Model = {};
  const View = {};
  const Controller = {};
})();
```

三者各司其职, 现在添加一些默认相上去,以使它们能够启动.

```JavaScript
  ;(function(){
    init()

    const Model = {
      data: {},
      init() {}
    }
    const View = {
      render() {}
    }
    const Controller = {
      init() {}
    }

    function init() {
      Model.init()
      View.render()
      Controller.init()
    }
  }())
```

这里面的知识点涉及到了[[IIFE]] 立即执行函数是我们在没有模块化管理工具之前,进行插件开发的一个必要的工具

基本的代码结构已经完成了.

## 我们先对`Model`部分进行详细的 code

```js
const Model = {
  data: {
    name: "橘子哥哥",
    age: 18,
  },
  init() {
    for (let key in this.data) {
      Object.defineProperty(this, key, {
        get() {
          return this.data[key];
        },
        set(newValue) {
          this.data[key] = newValue;
          // View.render({[key]: newValue})
        },
      });
    }
  },
};
```

我们对`Model`来进行初始化,就是为了让外面的可以直接通过`Model.name` 就能够访问到内容的 data 对象中定义的值. 而多出一个 data 来包裹着变量, 主要是为了增加代码的可读性.让数据和方法分离.

我们的目的是对数据进行响应式的封装.所以说在`set`的时候,进行`View.render`的调用.一旦变量改变了就调用`View`模块渲染部分逻辑.

传入的参数是当前改变的值,将来是要根据这个值来改变对应内容的重新渲染的.

这里涉及到了 [[数据劫持]] ,Flutter 的 Getx 框架就显行的使用数据劫持来进行数据的处理.在 JS 中属于[[对象的访问器属性]]的知识

## 数据已经处理好了,我们来处理界面渲染部分的逻辑,我们逻辑的最终的出口:

```js
const View = {
  el: "#app",
  template: `
        <div class="box">
             <div class="cal-name">{{ name }}</div>
             <div>,今年</div>
             <div class="cal-age">{{ age }}</div>
             <div>岁</div>
             <div class="splice"></div>
             <button class="cal-button add">+</button>
             <button class="cal-button reduce">-</button>
         </div>
      `,
  reg: /\{\{(.*?)\}\}/g,
  render(mutedData) {
    if (!mutedData) {
      this.template = this.template.replace(this.reg, (node, key) => {
        return model[key.trim()];
      });

      const container = document.createElement("div");
      container.innerHTML = this.template;
      document.querySelector(this.el).appendChild(container);
    } else {
      for (let key in mutedData) {
        document.querySelector(`.cal-${key}`).textContent = mutedData[key];
      }
    }
  },
};
```

`el`的命名和作用和`Vue`框架中的保持一致.目的也一目了然.就是把我们要渲染的内容都挂载在 id 为`app`的标签中.

`template`就对应`Vue`中的模版,或者说是`JSX`.

`render`部分涉及到了[[正则表达式的基础]],以及如何使用正则来实现简单的模版替换. 通过判断,如果没有参数传进来,即`mutedData`为`undefined`的话,就是初始化渲染全部内容. 而有值传进来就表示值有变化,就直接改变对应的地方渲染就可以了.

## 此时可以查看界面,以及出现了我们一开始的目标样子.这个时候我们还需要加上我的操作逻辑.

```js
const Controller = {
  init() {
    const oCalButtons = document.querySelectorAll(".cal-button");

    for (let i = 0; i < oCalButtons.length; i++) {
      btnItem = oCalButtons[i];
      btnItem.addEventListener("click", this.handleBtnClick, false);
    }
  },
  handleBtnClick(e) {
    switch (e.target.textContent) {
      case "+":
        model.age++;
        break;
      case "-":
        model.age--;
        break;
      default:
        break;
    }
  },
};
```

1. `init`绑定上点击事件

1. `handleBtnClick`处理具体的事件

## 最后我们来看一下整体的代码:

```js
(function () {
  function init() {
    model.init();
    view.render();
    controller.init();
  }

  const model = {
    data: {
      name: "橘子哥哥",
      age: 19,
    },
    init() {
      for (let key in this.data) {
        Object.defineProperty(this, key, {
          get() {
            return this.data[key];
          },
          set(newValue) {
            this.data[key] = newValue;
            view.render({ [key]: newValue }); // ❌
          },
        });
      }
    },
  };

  const view = {
    el: "#app",
    template: `
	        <div class="box">
	          <div class="cal-name">{{ name }}</div>
	          <div>,今年</div>
	          <div class="cal-age">{{ age }}</div>
	          <div>岁</div>
	          <div class="splice"></div>
	          <button class="cal-button add">+</button>
	          <button class="cal-button reduce">-</button>
	        </div>
	  	`,
    reg: /\{\{(.*?)\}\}/g,
    render(mutedData) {
      if (!mutedData) {
        this.template = this.template.replace(this.reg, (node, key) => {
          return model[key.trim()];
        });
        const container = document.createElement("div");
        container.innerHTML = this.template;
        document.querySelector(this.el).appendChild(container);
      } else {
        for (const key in mutedData) {
          document.querySelector(`.cal-${key}`).textContent = mutedData[key];
        }
      }
    },
  };

  const controller = {
    init() {
      const oCalButtons = document.querySelectorAll(".cal-button");

      for (let i = 0; i < oCalButtons.length; i++) {
        btnItem = oCalButtons[i];
        btnItem.addEventListener("click", this.handleBtnClick, false);
      }
    },
    handleBtnClick(e) {
      switch (e.target.textContent) {
        case "+":
          model.age++;
          break;
        case "-":
          model.age--;
          break;
        default:
          break;
      }
    },
  };

  init();
})();
```

整个代码就是很典型的 MVC 结构的代码,在`Model`中定义参数之余,还要监听参数的变化,来进行界面的渲染.根据代码可以得出这样的一张图:

![无标题-2022-02-21-0010_1645373736968_0.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea5b1eef86ff4e46980051ca359238db~tplv-k3u1fbpfcp-watermark.image?)

- 我们喜欢的是三者能够完全的独立,但是 MVC 没有给我们带来. 每一个模块之间还是有所牵连.所以我们需要改变.这就有了`MVVM`的出现. MVVM 的出现解决了`MVC`的一部分问题. [[手写MVVM框架]]
- 缺点:
  - 驱动被 MVC 三个部分分离了.而我们的 MVVM 就是把驱动的封装起来

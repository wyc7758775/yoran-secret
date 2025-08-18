# new 的时候都干了什么

## 为什么要有 new

**我认为了解一个 api 怎么用之前，更重要的是要知道这个 api 为什么因何而诞生的！**

JS 的诞生就是为了快速的解决问题的。**所以它的语法很多时候都是为了让用户省心而设计的，比如弱语法，比如这个 new。**

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36b0879f8da6456c93b5f93f7ff93855~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="30%" />

在我平时写的业务中，其实没有创造大量对象的场景。所以这里以游戏的业务为例子。我记得微信小游戏的 DEMO 就是飞机大战，现在我们给敌机设计它的属性。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a39bf557f998426d9c1a3b915c49614f~tplv-k3u1fbpfcp-zoom-1.image)

对于敌机而言，它有不同的机种，不同的血量，可以发送子弹，可以向屏幕下方移动。在代码中如下：

```js
const 敌机 = {
  key: 0001, // 唯一ID
  机种: 'a', // 非boss
  攻击范围: 1000,
  发射: function() {
    // 发射子弹
  }，
  向下移动: function() {
    // 冲向我方
  }
}
```

这是一辆飞机的对象。但是在飞机大战当中，敌机可是满屏都有的。所以我们需要很多辆这样的飞机：

```js
const 敌机s = []

for (let i = 0; i< 50; i++) {
  let 敌机 = {
    key: '敌机' + i, // 唯一ID
    机种: '歼20', // 非boss
    攻击范围: 1000,
    发射: function() {
      // 发射子弹
    }，
    向下移动: function() {
      // 冲向我方
    }
  }
  敌机s.push(敌机)
}
```

上面对象数组中的发射和向下移动是完全一样的函数 ，但是被创造了 50 遍。机种和攻击范围是固定，只有 key 值各不相同。

所以我们可以有如下的改造：

```js
const 敌机原型 = {
  兵种: "歼20",
  攻击范围: 1000,
  发射: function() {
    // 发射子弹
  }，
  向下移动: function() {
    // 冲向我方
  }
}

const 敌机s = []
for(let i = 0; i < 50; i++) {
  let 敌机 = {
    key: '敌机' + i,
  }

  敌机.[[proto]] = 敌机原型

  敌机s.push(敌机)
}
```

是不是有点‘构造’函数那个味了？循环里面我们做了两件事情，创建对象，以及处理对象，干了两件事情，敌机的对象也分开来了。有了更好的复用，我们可以使用函数来封装：

```js
function 敌机(key){
  var 临时对象 = {}

  临时对象.[[proto]] = 敌机.原型

  临时对象.key = '敌机' + key

  return 临时对象
}

敌机.原型 = {
  兵种: "歼20",
  攻击范围: 1000,
  发射: function() {
    // 发射子弹
  }，
  向下移动: function() {
    // 冲向我方
  }
}
```

随后在创建敌机们的时候，可以直接调用上面的函数：

```js
const 敌机s = [];
for (let i = 0; i < 100; i++) {
  敌机s.push(敌机(i));
}
```

回到我说的第一句话，**它的语法很多时候都是为了让用户省心而设计的。**

它的这个省心体现在哪里呢？

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dc2424447964368be1c666e4b8e4e9f~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32e551505a4f40289d238881d8b2fd33~tplv-k3u1fbpfcp-zoom-1.image)

悄悄这位慈祥的老人。他为了让我更快的创建对象，通过一个 `new` 关键字为我们省略了四个步骤！

## 当函数 return 不同类型的时候

通俗的知道了 new 的意义，我们再来看它在这个过程中做了什么就容易很多了。

回想一开始学习 JS 的时候，好好的函数，非要弄一个构造函数的称呼出来。

我第一次看到构造函数的时候，郁闷了好久，为什么函数还分这么类型，匿名函数、立即执行函数、构造函数。

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29546be3880048188b817968dde9421d~tplv-k3u1fbpfcp-zoom-1.image" alt="" width="30%" />

给我造成了多年的记忆负担！函数就是函数，不能因为运行函数的时身边的关键字不一样就给它瞎起名字。

所以就应该是 new 一个函数，而不是 new 一个构造函数。

在 new 的过程中主要就是分为两种情况，根据函数 return 的是基础类型还是引用类型，返回不同的结果。

## return 基础类型

当使用`new`关键字调用一个函数时，函数中 return 的是一个基础类型。JavaScript 引擎将执行以下步骤：

1.  创建一个新的空对象。
1.  将新创建的对象的原型指向构造函数的原型对象。
1.  将构造函数的 this 关键字绑定到新创建的对象上。
1.  执行构造函数中的代码，将属性和方法添加到新的对象中。
1.  如果构造函数返回一个对象，则返回该对象，否则返回新创建的对象。

下面是一个简单的例子，演示了使用`new`关键字创建对象实例的过程：

```
// 定义一个构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 在Person的原型对象上添加一个方法
Person.prototype.sayHello = function() {
  console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
}

// 使用new关键字创建对象实例
const person1 = new Person('John', 30);

person1.sayHello(); // 输出: Hello, my name is John and I am 30 years old.
```

在上面的例子中，我们定义了一个`Person`构造函数，它有两个参数：`name`和`age`。然后，我们在`Person`的原型对象上添加了一个`sayHello`方法，该方法输出一个字符串，包含对象的`name`和`age`属性。最后，我们使用`new`关键字调用`Person`构造函数，并将结果赋值给`person1`变量。最后，我们调用`person1`对象的`sayHello`方法，输出一个字符串。

通过这个例子，我们可以看到，使用`new`关键字创建对象实例时，JavaScript 引擎会将新创建的对象的原型指向构造函数的原型对象，因此我们可以在构造函数的原型对象上定义方法，并在新创建的对象上使用这些方法。

> 众所周知，函数不写 return 的时候，它返回的是 undefined, 也是基础类型

## return 引用类型

return 引用类型就简单很多，return 的对象会直接'覆盖'JS 引擎内部生成的 "this" 对象。如下代码片段：

```js
function Person(name) {
  this.name = name;
  return {
    name: "Greg",
  };
}
Person.prototype.say = function () {
  console.log("yoran");
};

const p = new Person("John");
console.log(p.name); // Greg
```

## 总结一下

- new 一个对象的过程

  1.  创建一个空对象
  1.  给这个空对象添加`__proto__`属性,并指向`prototype`原型对象
  1.  将 this 的属性绑定到这个对象当中
  1.  然后`return`这个对象给实例化对象

- `return`的是基本类型和对象会带来不同的效果

  - `return`的是数字的话, 不会有什么变化,直接走以前的
  - `return`的是对象的话, 会直接覆盖你上面的那一连串骚操作

## 手写一个 new 方法

```js
function targetFn(name) {
  this.name = name;
}
targetFn.prototype = {
  aget: 18,
};

function myNew(fn, ...rest) {
  const newObj = Object.create(fn.prototype);

  const returnResult = fn.apply(newObj, rest);

  return isObject(returnResult) ? returnResult : newObj;
}

function isObject(obj) {
  const target = "[object Object]";
  return Object.prototype.toString.call(obj) === target;
}
```

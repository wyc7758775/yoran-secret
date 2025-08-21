# 用函数调用的方式来分析 this

> 每个函数都有一个隐式的 `this` 形参。将函数作为方法调用时，这个参数会被设置为用于访问该方法的对象。这和大多数[面向对象语言](https://www.zhihu.com/search?q=%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E8%AF%AD%E8%A8%80&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22:%22answer%22,%22sourceId%22:%221539325572%22%7D)中的 `this`（或 `self`）含义相同。但是 JavaScript 在「关联到对象的方法」与「独立函数」这两者之间，使用了单一的定义形式。**这使 \*\***`this`\***\* 导致了许多程序员的困惑和 bug。 ——————Brendan Eich(JS 之父)**

this 指向到问题是公认的！创造 JS 的人都这么说它。所谓的灵活指向不过是缝合怪。

所以说，对于 `this` 的强限制是非常有必要的，比如 ES6 的发布。

现在面试还在考查 `this` 的使用作为主要晒人的手段是不理智不合理的，**希望各位面试官能提升自己的修养！**

当然，现在依旧有大量的老项目充斥着各种 `this` 。面对这样的项目，我建议面试者另选公司，建议面试官早日理智。

> 如果在现在的市场有其他更好的选择的话

## 它所谓的灵活是什么？

new 关键字让我在批量创造对象的时候省却了 4 个步骤；函数不用显性的写上 return,它自己会添加，并且 return undeinfed。在调用函数的时候，自然也会有有类似的操作。

我们想来看调用函数的四种方式：

- `fn(a, b)`
- `obj.fn(a,b)`
- `fn.call(Object, a, b)`
- `fn.apply(Object, [a, b])`

其中`apply`和`call` 的差别只是参数的类型不一样。它们的第一个参数`Object` 大多数的是直接传 this 进去。和`fn(a, b)` 和`obj.fn(a,b )` 有`this` 和`arguments` 两个隐式的参数不同，它们是显式的！

那是不是可以说 `fn(a, b)` 和`obj.fn(a, b)` 以及`fn.apply(Object, [a. b])` 都是 `fn.call(Object, a, b)` 的语法糖！！！

- **fn(a, b) ⇒ fn.call(undefine, a, b)**
- **obj.fn(a, b) ⇒ fn.call(obj, a, b)**
- **fn.apply(Object, [a, b]) ⇒ fn.call(Object, a, b)**

也就是说，其实我们调用函数的时候，只有一种方式，就是`fn.call(Object, a, b)` ！

在这个前提之下， 我们来看看下面的这个经典面试题：

```
const obj = {
  foo: function() {
    console.log(this)
  }
}

const myObj = obj.foo
myObj() // window
obj.foo() // function foo() {}
```

```
myObj(undefined)
obj.foo(obj)
```

我们用上面的来定义一下：

`myObj()` ⇒ `myObj.call(undefined)`

`obj.foo()` ⇒ `obj.foo.call(obj)`

所以说，obj.foo()答应出来的就是 _function foo() {_ }。由于在浏览器当中，当传入的 Object 是`undefined` 或者 `null` 的时候，它默认指向`windows` 。

基于这样的现象，我们可以引用《你不知道的 JavaScript》中对于 `this` 的概括：

1.  上下文是在函数被调用的时候创建的
1.  上下文中包括了 `this`

换一句话说就是： **`this`\*\*** 的行为是在运行时决定的！\*\*

造成它们的打印的结果的不同，就是函数的运行的时候创建的上下文不同，在这里，我们完全可以把上下文这个概念等同于 `this`。

myObj 运行的时候，foo 函数已经挂载到了上下文全局中，所以它的 `this` 打印的结果是 window。而 obj.foo 运行时，foo 函数挂载在对象内部，所以 this 打印是函数自己。

> 上面例子说明的 Object 就是上下文，一般写作 context。

## 它带来了什么灾难

当它和事件循环机制在一起的时候，如下题：

```
const object = {
  message: 'Hello, World!',

  logMessage() {
    console.log(this.message); // => ?
  }
};

setTimeout(object.logMessage, 1000);
```

按照说明的分析，既然是方法的调用，那么这里打印的是不是 object 的属性呢 ？

结果很遗憾， 是 window。setTimeout 属于宏任务，它会等待微任务在执行栈中执行完毕再将`object.logMessage` 放入执行栈当中。可是此时它已经变成了函数的调用,因为 object 对象已经被销毁，所以是`object.logMessage.call(undefined)` 。

所以我们在 ES6 中迎来了箭头函数！

它没有`this` 这个隐式的参数。也就意味着，如果它会延着作用域链一直忘找 `this` 这个参数的存在。纯粹得太多了。善莫大焉！

## 总结

- 只有一种调用函数的方式，`fn.call(Object, a, b)`

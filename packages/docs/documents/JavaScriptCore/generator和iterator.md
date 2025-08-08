---
createTime: 2025-04-21
category: Web
smallClass: JavaScript
---

## 前言

最近重新现在看红宝书，总算知道为什么迭代器和生成器这两个概念为什么那么难理解了，根本原因是平时直接使用到的机会确实是非常的少，其次就是书上面为了介绍这两个概念使用了非常多的专业的名词来描述，而且相互穿插，能把人看睡着了都。下面简单的描述一下书中的介绍这两个概念的思路。

### 迭代器导读

在迭代器中，先介绍了迭代，在 ES6 之前for和forEach两个循环的问题，引出了迭代器模式。接下来就自然的介绍迭代器模式，它包含两个概念：
1. 第一个是可迭代协议，介绍了它具备的能力，以及实现它的必要条件，最后介绍了当前内置的类型都有那些实现了这个可迭代协议，并且可以接受这些内置类型的原生语言特使包括那些。
2. 第二个是迭代器协议，介绍了它的基本概念和基本使用方法。了解了了迭代器的协议之后，也可以称呼它们为迭代器的接口，就介绍了自定义迭代器如何实现和一些细则。

但是关于两个协议的关系和职责范围没有总结出来，导致了我对于他们的关系一直很模糊，经常混淆在一起。总结一下：

|**协议类型​**​|​**​可迭代协议（Iterable Protocol）​**​|​**​迭代器协议（Iterator Protocol）​**​|
|---|---|---|
|​**​目的​**​|定义对象如何被迭代（如 `for...of` 遍历）|定义如何按顺序访问元素（如 `next()` 方法）|
|​**​实现方法​**​|对象需实现 `[Symbol.iterator]()` 方法|对象需实现 `next()` 方法|
|​**​返回值​**​|返回一个​**​迭代器对象​**​（符合迭代器协议）|返回 `{ value: T, done: boolean }` 对象|
|​**​核心作用​**​|​**​声明对象可被迭代​**​|​**​实际执行迭代过程​**​|

### 生成器导读

在生成器中，先介绍了生成器的写法，包含的元素和生命周期，存在暂停状态，存在`next()`方法，该方法返回的对象也是包含done属性和value属性。接下来介绍生成器最重要的组成部分：`yield`，被称为生成器最有用的地方。包括如下内容：

1. 中断执行，异步变为同步的关键
2. 

**生成器和迭代器的关系如下**：

生成器是一种特殊的函数结构，它返回的对象是一个迭代器。生成器函数本质上是 JavaScript 语法规范提供的一种**用户自定义的迭代器工厂函数**。

> 生成器（Generator）**不是基于 ES5 的语法糖**，而是 **ES6（ECMAScript 2015）引入的基础语言规范**，需要 JavaScript 引擎在底层实现支持。





## 资料
* [(1 封私信 / 9 条消息) es6 generator到底有什么用？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/55810122/answer/1988210728)
* [Rx.js 思想入门（讲义） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/34481617)
	* generator是ES对迭代器的实现，迭代器源于设计模式。(这个事关generator怎么来的)，我们想知道generator有什么的本质其实是了解迭代器有什么作用。

# generator和iterator

![[截屏2022-01-30 02.22.26.png]]
这句感觉啥都没有说.  怎么写法就复杂了,怎么就枯燥了. 复杂体现在哪里?枯燥体现在哪里?如何手抖产生bug的.现在的人出教程都这么随意的么?

这个例子出自于《JavaScript 高级程序设计》第五版，是为了说明在迭代器这个规范出来之前ES 处理迭代的一个历史，有两个阶段，一个如图中使用到for循环，另外一个就是forEach更加函数式的写法。

for循环的凡事得出的结论也不是图中的两点，而是：
1. 迭代之前需要事先知道如何使用数据结构。
2. 遍历顺序并不是数据结构固有的。

## 1.总结一下在此之前的7组遍历的方法
- forEach -> 普通的数组遍历
- map -> 映射, 每一次遍历,返回bool.来决定当前元素是否纳入新的数组
- filter -> 过滤, 每一次遍历,返回bool,来决定当前元素是否纳入新的数组
- reduce -> 归纳, 每一次遍历,将挡元素收归到容器中
- reduceRight -> reduce的反向操作
- every -> 判定是否所有元素都符合一个条件
- some -> 判定是否有某一个或多个符合一个条件

> async是Generator的语法糖，在Generator基础上封装的

## 2. 手写iterator
```js
const arr = ["姓名: 小野", "年龄: 28", "爱好: 我爱JavaScript"];
function getIterator(arr) {
  let i = 0;
  return {
    next() {
      return {
        value: arr[i++],
        done: i > arr.length,
      };
    },
  };
}

const iterator = getIterator(arr);
console.log(iterator.next()); // {value: 姓名: 小野, done: false}
console.log(iterator.next()); // {value: 年龄: 28, done: false}
console.log(iterator.next()); // {value: 爱好: 我爱JavaScript, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```
## 3. ES6提供的Generator方法
```js
function* createIterator(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i];
  }
}

const iterator1 = createIterator(arr);
console.log(iterator.next()); // {value: 姓名: 小野, done: false}
console.log(iterator.next()); // {value: 年龄: 28, done: false}
console.log(iterator.next()); // {value: 爱好: 我爱JavaScript, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

**基本构成就是* 加上yield.**

## 4.  Generator实现async的写法
大佬写的文章还是不错的 https://juejin.cn/post/6844903599529541645
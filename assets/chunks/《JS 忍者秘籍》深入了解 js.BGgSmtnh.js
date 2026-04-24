const n=`# 《JavaScript 忍者秘籍》学习记录

# 1. 函数是第一等公民

## 1.1 函数是一等公民的原因

一等公民英文名中叫 first-class citizen

> In programming language design, a first-class citizen (also type, object, entity, or value) in a given programming language is an entity which supports all the operations generally available to other entities. These operations typically include being passed as an argument, returned from a function, and assigned to a variable.

通俗来说就是，别人有的权利它都有。回到 JavaScript 中，说是一切都基于对象，那么对象有的功能，函数都有那么才能称之为一等公民，而事实确实如此。

- 可以通过字面量进行创建
- 可以赋值给变量、数组、其他函数的属性
- 具有动态创建和分配的属性
- 可以作为参数传递给函数
- 可以作为函数的返回值

上面这些即是对象能够做到的事情，也是函数能够做到的时候，所以说函数是一等公民。而函数还有另外一个功能，就是可以被调用的(invokable)。

## 1.2 函数作为一等公民的两个运用

\`\`\`JavaScript
const obj = {}
obj.name = '蚂蚱'

let fn = function() {}
fn.name = '村哥哥'
\`\`\`

在此之前，我们基本不对函数创建属性，即时它能够这样做，而这样做也带来了两个有意思的特性。

- 存储函数：管理回调函数合集
- 自记忆函数：存储上一次计算遗留值

### 1.21 存储函数

\`\`\`JavaScript
const store = {
  nextId: 1,
  cache: {},
  add: function(fn) {
    if (!fn.id) {
      fn.id = this.nextId++
      this.cache[fn.id] = fn
      console.log('successfull!')
      return
    }
    console.log('It is exist！')
  }
}
function ninja() {}
store.add(ninja)  // successfull!
store.add(ninja)  // It si exist
\`\`\`

### 1.22 自记忆函数

\`\`\`JavaScript
function isPrime(value) {
  if (!isPrime.answers) {
    isPrime.answers = {}
  }
  if (isPrime.answers[value] !== undefined) {
    return isPrime.answers[value]
  }
  let prime = value !== 0 && value !== 1 // 1 is not a prime
  for (let i = 0; i < value; i++) {
    if (value % i === 0) {
      prime = falsue
      break
    }
  }
  return isPrime.answers[value] = prime
}

isPrime(5)
isPrime(5)
\`\`\`

> 该函数把传进去的值当成 answers 的变量名

## 1.3 函数定义

四种定义函数的方法

- 字面量创建，包括函数定义和函数表达式
- 箭头函数
- 函数构造函数（这玩意儿仅做了解）
- 生成器函数（ES6 新增）

这四种类型泾渭分明，不存在什么弄混乱的情况，唯一第一种的两种方式是有所差别而又不会让人感知的。

### 1.31 函数声明

\`\`\`JavaScript
function test() {}
\`\`\`

### 1.32 函数表达式

\`\`\`JavaScript
let fn = function() {}
\`\`\`

函数表达式中函数作为右值赋值给变量，其的函数名可有可无，就算写上了变量名，在 JS 引擎预编译阶段也会自动忽略的。

\`\`\`JavaScript
let fn1 = function test() {}
test() // test is no function
\`\`\`

- 既然是赋值给变量，那么在 ES6 之前，使用 var 的时候也存在变量提升的问题，导致不可以在任意地方进行调用。
- 函数声明是不需要开辟内存的，仅仅告诉编译器，要声明的部分存在，要预留一点空间，函数表达式则需要开辟内存

### 1.33 立即函数（IIFE）

\`\`\`JavaScript
(function() {
  console.log('IIFE')
})()
\`\`\`

![标准函数调用.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82411a6213924c0a942321c5d03b5460~tplv-k3u1fbpfcp-watermark.image?)

> 如果去掉包裹函数表达式的括号，把立即调用作为一个独立语句 function() {}(3), JavaScript 开始解析时便会结束，因为这个独立语句以 function 开头，那么解析器就会认为它在处理一个函数声明。每个函数声明必须有一个名字（然而这里并没有指定名字），所以程序执行到这里会报错。为了避免错误，函数表达式要放在括号内，为 JavaScript 解析器指明它正在处理一个函数表达式而不是语句。

上面的引用出自于本书《JavaScript 忍着秘籍》，但是很显然是有问题的。它的论据说是由于函数声明必须有一个名字所以 IIFE 去掉外面的括号后会报错，是由于没有函数名才报错的。如果翻译没有错误的话，那么这句话就是有问题的。

**实际证明，就算加上了函数名如此也一样会报错!**

所以说，解析器在看到 function 开头的函数，认为它是一个函数声明，而函数声明后面加上一个括号是构不成 IIFE 的条件的。

IIFE 的构成条件是：

函数表达式 + () = 立即函数

所以下面这些都不会报错!

\`\`\`JavaScript
+function() {}()
-function() {}()
*function() {}()
!function() {}()
(function() {})()
\`\`\`

\b 我们这样子来看这个问题。

\`\`\`JavaScript
let a = funciton() {}
\`\`\`

这里将一个函数表达式赋值给了变量

\`\`\`JavaScript
a ()
\`\`\`

这样毫无疑问是可以运行而不报错的。

但是换成了右值的话，就会报错，很神奇。

\`\`\`JavaScript
function() {}()
\`\`\`

这就是 因为前面提到了，解析器不认为你这个是函数表达式，所以构不成 IIFE 的必要条件，解析器不认识你，自然就报错了。

而在前面加上运算符就会成为下面这个样子:

运算符 + function() {} + ()

运算符后面自然只能跟着变量了，而这个变量又可以引向 function() {}函数表达式。而解析器就认识你写的东西。所以能够正常运行下去了。

## 1.4 形参和实参

![函数实参.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e344935f4b844999fdc6fa2f9db1568~tplv-k3u1fbpfcp-watermark.image?)

形参和实参在不同位置是可以替换的

### 1.41 默认值

在没有 ES6 的时代，要设置默认值非常的难。

值得一提的是，在代码整洁之道中，有默认值的要放在后面，更加的直观，如下

\`\`\`JavaScript
function fn(a, b, c = {}, d = 1) {}
\`\`\`

### 1.42 剩余参数

ES6 的剩余参数绝大部分可以代替 arguments，而且因为是数组，能够使用数组的方法，甚至更加的优势。

\`\`\`JavaScript
function fn(a, b, ...c) {
   console.log(a) // 1
   console.log(b) // 2
   console.log(c) // [3, 4, 5]
   c[0] = 10
   console.log(c) // [10, 4, 5]
}

fn(1, 2, 3, 4, 5)
\`\`\`

剩余参数和 arguments 对象之间的区别主要有三个：

- 剩余参数只包含那些没有对应形参的实参，而 arguments 对象包含了传给函数的所有实参。
- arguments 对象不是一个真正的数组，而剩余参数是真正的 Array 实例，也就是说你能够在它上面直接使用所有的数组方法，比如 sort，map，forEach 或 pop。
- arguments 对象还有一些附加的属性 （如 callee 属性）。

剩余参数既然是纯数组，那么就可以解构，那么带来的骚操作的就多。

\`\`\`JavaScript
function fn(...[a, b, c,]) {
  return a + b + c
}
fn(1)          // NaN (b and c are undefined)
fn(1, 2, 3)    // 6
fn(1, 2, 3, 4) // 6 (the fourth parameter is not destructured)
\`\`\`

## 1.5 箭头函数

相比之前的函数定义，更加的简洁。对于隐式参数 this 和 arguments 都有变化，可以说不只是从写法进行改变，是需要我们坐下来好好研究的。

\`\`\`JavaScript
param => param
\`\`\`

# 2. this 和 arguments

这个两个是函数的隐式的参数

还涉及到了原型联调的问题。this 实际上面还是作用域的问题，很多时候 this 的问题都是各种骚操作给弄混乱的。所以控制 this 的使用才是王道。

而闭包才是构建新时代的 web 前端的根基，能够产生唯一变量，模块化，保存变量而不至于函数允许完毕之后就马上就销毁。

# 3 [对象和函数的关系 ](https://www.wolai.com/oQDWjniNPLNwsEBHH5ivg6)

这是一个哲学问题 😢：

- [对象都是由函数创建的](https://segmentfault.com/a/1190000014960860) (还有一个 low 版的，[点击这里](https://segmentfault.com/a/1190000014961257))
- 一切都是对象，函数也是对象

1. 其他技术书都是按步就按的按照数据结构到对象，到基本类型的基本 API，最后再到函数这么个机构。可是这本书开篇就直接从给函数开始。所以没有一定基础的人看得会很累的。
2. 本书一共 565 页，而函数部分就 218 页。看来作者认为函数是最重要的是真的
3. 这也正好切合现在回归函数式编程的主流，前两年被 React 带起的 class 风终究要被函数式抢去风格。但是不过是 FP 还是 OPP 只是代码的[范式](https://www.wolai.com/o6HkFcspmPrPzHcq9bcHTs)而已，都是为了解决特定的问题而产生的。但是殊途同归，两者不是对立的，是可以共有的。
   [这里是 JavaScript 的三种范式](https://www.cnblogs.com/nunn/p/3460175.html)

   > JavaScript 没有特定的风格，你想咋样就咋样。可能现在想要用那种方式更多的处于前端工程化的考虑。

   **鱿鱼洗：** js 属于没有明确归类的语言，或者好听点叫“多范式语言”。  
   你可以用原型继承模拟一套面向对象的体系，也可以强迫自己写函数式的 javascript（因为函数在 js 里是一等公民），也可以怎么舒服怎么写。It's up to you...

4. 函数是一等公民。本书中绝大部分都是在论证这个观点。而这一点也是 js 能够拥有函数式编程的基础。
   如果公民分等级，一等公民什么都可以做，次等公民这不能做那不能做。JavaScript 的函数也是对象，可以有属性，可以赋值给一个变量，可以放在数组里作为元素，可以作为其他对象的属性，什么都可以做，别的对象能做的它能做，别的对象不能做的它也能做。这不就是一等公民的地位嘛。
5. 对象可以通过函数创建 let test = new Object()
6. 对象是通过函数创建，而函数又是一种对象
7. 对象能干的，函数都可以实现
   1. 为变量赋值
   2. 想数组添加函数
   3. 作为函数参数来传递并运行
   4. 作为函数的返回值
      > 函数名是一个指向函数对象的指针
8. 毁掉函数运用在 JS 开发中的每一个地方
   1. 回调函数的基本运用
   2. 比较器排序
9. 函数能够像对象一样动态的创建属性，以此带来的功能：
   1. 存储函数
   2. 自记忆函数
10. 函数的定义
    1. 函数生命
    2. 函数表达式
    3. 箭头函数
    4. 函数构造器
    5. 生成器函数
11. 函数的参数：形参和实参
    剩余参数、arguments 两者的相同和不同之处
    > 显示参数类型和隐式参数类型 →arguments 和 this
12. 在严格模式和非严格模式下面，arguments 的表现是有所不同的额

    \`\`\`JavaScript
    'use strick'
    function test(a, b) {
      arguments[0] = 20
      console.log(argumengs[0]) // 20
      console.log(a) // 2
    }
    test(2, 1)
    \`\`\`

    而在非严格模式下面，arguments 的改变会导致对应的形参指向的值也跟着改变

13. 函数的调用
    直接调用和作为方法来调用、构造函数来调用，他们之间的不同在于最终作为函数上下文传递给执行的函数的对象不同，即 this 不同。
    而要认为的改变 this 的值的话，就需要 apple 和 call 上场了
14. 构造函数的目的就是创建一个新对象并进行初始化。或者说是完全复制一个独立的对象。
    构造函数也可以返回值，在作为正常的函数调用的时候，但是这个不影响其作为复制一个有初始化值的功能
    1. apple 和 call 唯一的不同在于如何传递参数。前者是数组，后者以逗号相隔
15. 闭包和作用域肯定是绑在一起说的
16. 闭包可以让在内部函数作用域消失后，其内部的变量仍然存在的功能
17. 执行上下文栈就是函数栈，这里就能引出另外一个问题，尾调用优化
18. let 和 const 的作用老生常谈了，给 js 赋予了块级作用域
19. 生成器在普通程序员中很少用到。但是， 你想要成为大神，这个玩意儿你需要会

# 4. 面向对象与原型

1. 对象原型链和构造函数原型链有差别有相似
2. 如果我们需要私有对象，在构造函数内制定方法是唯一的解决方案·····

\`\`\`JavaScript
let test = {
  name: '吴雨村',
}
console.log('name' in test) // true
console.log('age' in test) // false
\`\`\`

2. 对象实例的新建无所谓顺序，在预编译阶段就已经处理完成了

\`\`\`JavaScript
const test = new Test()
function Test() {
  this.a = 1
  // this.b = function() {
  //   return this.a
  // }
}

Test.prototype.b = function() { // 想来也是预编译阶段就处理完成了，尤其是这种函数类型的 - 一等公民
  return 2
}
Test.prototype.c = '爸爸' // 事实证明和你属性是否是函数没有任何关系，估计在创建第一个函数的时候，这些事情都已经做好了。
console.log(test.b())
console.log(test.c)

\`\`\`

3. 通过构造函数创建的对象是一个对象，而不是一个函数（当然深层次的说函数就是一种对象）

\`\`\`JavaScript
function Ninja() {
  this.name = '吴雨村'
  return 1
}
const ninja = new Ninja()
console.log(typeof Ninja)  // funciton
console.log(typeof ninja)  // object
\`\`\`

4. instanceof 用于检查对象是否是实例

\`\`\`JavaScript
console.log(ninja instanceof Ninja) // true
\`\`\`

5. 继承

🤔️？

**第一种继承方式：**

\`\`\`JavaScript
function Person() {
  this.name = '吴雨村'
}
function Boy() {
  this.age = 20
}
Boy.prototype = new Person()

const test = new Boy()
console.log(test.name) // 吴雨村
\`\`\`

此时 Boy 的原本的原型由于没有被引用，**即将** 被删除。即将这个词怎么解释？所以是什么时候被删除。

先按照上一句的说法， 旧的原型被删除的话，那么 test 的原型指向的就是 new Person()而不是 new Boy()。如果这个时候我们不需要 new Boy()消失的话，需要做如下处理。

\`\`\`JavaScript
Object.defineProperty(Boy.prototype, 'constructor', {
  enumerable: false,
  value: Boy,
  writable: true
})
\`\`\`

所以前两段代码合并起来才能算是一个完成的继承的方法。

**第二种继承的方式：**

\`\`\`JavaScript
Person.prototype = {
  name: '钩子'
}
Boy.prototype = Person.prototype
const test = new Boy()
console.log(test.name) // 钩子
\`\`\`

直接继承 Person 构造函数的原型，但是不是继承 Person，这玩意儿也能叫继承么？不够明确啊，不过也确实是实现在 Boy 构造实例上面找不到的属性，会向上找到 Person 原型地方

由于是让构造函数 propotye 等于另外一个构造函数的原型实例，实现了对后一个构造函数属性的继承。所以就叫做原型继承。

ES6 中 class 的继承也就是基于原型继承的！

# 5. 控制对象的访问

## 5.1 未看书之前

直到这个东西，直到 set 和 get，一个可以监听数据是否已经发生了变化，一个可以设置 value 的值的改变。通过 Object.defiendProperty 还可以控制该对象的值是否可以更改，是否可以被 for-in 遍历。

控制对象的访问实际例子可以用在 Vue 实现双向绑定的这个功能上面去理解。甚至于对于一个数的过滤都可以通过控制对象的访问。

作者抛出的三个问题，还是很好的总结了使用控制对象的必要性的：

1. 通过 getter 和 setter 访问属性值有什么好处？
2. 代理与 getter 和 setter 的主要区别是什么？
3. 代理对象的常见问题是什么？列举 3 项代理对象的常见问题。

# 5.2 平时我们是怎么来修改对象的属性的值的

\`\`\`JavaScript
function Ninjia(name) {
  thia.name = name
}
const test = new Ninjia('吴雨村')
console.log(test.name) // 吴雨村
test.name = '蚂蚱'
console.log(test.name) // 蚂蚱
\`\`\`

上面这段代码更进一步说明了构造函数就是创建了一个对象的模版，这个模版里面给对象初始化了几个属性，仅此而已。所以实例化对象之后，可以直接动态的修改该对象的属性值。

# 5.3 手动实现变量私有化和 getter 以及 setter

需要了解的前置重要只是是，getter 和 setter 是两个方法论，不是具体的属性和函数，不单单是出现 js 中，java 中也是有相关的概念的。

# 5.4 代理 proxy

# 6. 处理集合（[Set and Map](https://www.wolai.com/wuycun/eg69SkfrzMYBWWJfyqENnG#iYFJhspJB3h2AUfCbT9khu)）

这一部分说的是数组使用方法，和数组的排序，都是常用的功能，后面还加上了 Map 和 Set 这两个新进的集合类别。

最特别的地方在于用构造数组来实现数组的功能，还有得出数组的交集、差集、并集。

1. pop 和 push 方法只英雄数组最后一个元素：pop 移除最后一个元素，push 在数组末尾增加元素。shift 和 unshift 方法修改第一个元素，之后的每一个元素的索引都需要调整。因此，pop 和 push 方法比 shift 和 unshift 要快得很多，非特殊情况下不建议使用 shift 和 unshift 方法(说得啥的，这个可由不得我自己)

# 7. 正则表达式

这一部分没有任何参考的价值。无非就是各种 API 的使用，不如看小野的教学视频有用

# 8. 代码模块化

这一章我们能够明白：

1⃣ 在 JavaScript ES6 之前，可以使用什么现有机制近似实现模块化？

2⃣️ AMD 和 ComonJS 模块化规范有什么区别？

3⃣️ 使用 ES6 时，需要使用哪条语句来使 tryThisOut()函数同时调用一个模块中的 test 和另一个模块中的 guineaPig?

## 8.1 远古时候老程序员使用对象、立即执行函数、闭包解决模块化的问题

**模块模式**

\`\`\`JavaScript
const handleNum = function () {
  let num = 0
  const add = function() {
    num++
    console.log(num)
  }
  const reduce = function() {
    num--
    console.log(num)
  }

  return {
    add: add,
    reduce: reduce
  }
}()

handleNum.add() // 1
handleNum.reduce() // 0
handleNum.add() // 1
\`\`\`

- 立即执行函数是为了简写，等同于省略了调用的一步

**模块扩展**

\`\`\`JavaScript
;(
  function(module) {
    const testString = '一步'
    module.testString = testString
  }
)(handleNum)
handleNum.testString // '一步'
\`\`\`

> 我写 JS 已经习惯了不加分号了。从来没有出过问题，但是就是这个例子出问题了。一开始我没有在立即执行函数的前面加上 ‘；’，导致一直运行错误，弄得我一位我的立即执行函数写得有问题 😖

## 8.2 ADM 和 CommonJs

AMD 只能用于浏览器，而 ComononJs 浏览器和服务端都可以用。之前工作中是从来没有使用过的，所以简单做一下了解就足够了。**他们都是一种规范，不是具体的实现** 。

**AMD** （Asynchronous Module Definition）

最流行的实现是 RequireJS。相比 CommonJs 更适合浏览器。从其名字翻译可以就可以一窥究竟，异步模块定义。

![截屏2020-12-26 17.39.31.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fa318182f384fe0a9ebe0cdf70ccd8b~tplv-k3u1fbpfcp-watermark.image?)

上面 2 必须要在 1 的后面，不然不能执行。当年还在使用 JQ 的时候，很多基于 JQ 的插件就必须放在 JQ 的后面。所以 AMD 解决的第一个问题就是能**够优雅的处理这些依赖关系，不用写得这么整整齐齐的，可以不用顾及载入的顺序** 。

第二点就是异步记载，不用等全部的 JS 都加载完毕了再执行后面的语句。

综上所述，它解决了两个问题：

1. 实现 js 文件的异步加载，避免网页失去响应
2. 管理模块之间的依赖性，便于代码的编写和维护

**AMD 的具体实现**

\`\`\`JavaScript
define('MousecounterModul', ['Jquery', $ = > {
  let numClicks = 0
  const handleClick = () => {
    alert(++numClicks)
  }
  return {
    countClicks: () => {
      $(document.on('click', handleClick))
    }
  }
 }])
\`\`\`

define 是 AMD 规范 RequireJS 实现的具体 API。

它定义了一个名叫 MousecounterModul 的模块名字，该模块依赖于 Jquery，所以说该模块会等 Jquery 加载完毕之后再进行加载，此过程完全是异步的，不阻塞，且优雅，我们可以同时依赖多个模块。

大致如此，具体使用方法不如去查看网上的文档，反正也用不到。

**CommonJs**

这玩意儿是同步的，这就决定了它不可能在浏览器中存活，即使它能够在浏览器中使用。而在服务器就无所谓了，毕竟是在同一个设备当中，当然是非常快的。**同步意味着阻塞** 。

引入导出

\`\`\`js
// MouseCounterModule.js
const $ = require('JQuery')
let numClick = 0
const handleClick = () => {
  alert(++numClick)
}
module.exports = {
  countClicks: () => {
    $(document).on('click', handleClick)
  }
}
\`\`\`

\`\`\`js
const MouseCounterModule = require('MouseCounterModule.js')
MouseCounterModule.countClicks()
\`\`\`

语法干净简洁，让人舒服。可惜不能直接用于浏览器中，如果要强行使用，还需要打包工具的配合，难搞。但是我们不怕！！！我们有下面这个东西。

## 8.3 ES6 模块

ES6 模块化就是我们现在开发 react 和 Vue 中使用的方法，使用的方法自不用说。它结合了 AMD 和 CommonJs 两者的优点，绝对是 ES6 中第一个应该学习的知识点才对。其他的 let、const 都无所谓，没有 ES6 模块化语法，我根本就不会写代码！！！

**语法简洁明了且可以异步加载的规范** ！

| export const ninja = 'Yoshi'                                                    | 导出变量                             |
| ------------------------------------------------------------------------------- | ------------------------------------ |
| export function compare()                                                       | 导出函数                             |
| export class Ninja()                                                            | 导出类                               |
| export default class Ninja() {}                                                 | 导出默认类                           |
| export default function Ninja() {}                                              | 导出默认函数                         |
| const ninja = 'Yoshi'<br />function compare() {}<br />export { ninja, compare } | 导出存在的变量                       |
| export { ninja as samural, compare }                                            | 使用别名导出变量                     |
| import Ninja from 'Ninja.js'                                                    | 倒入默认导出                         |
| import { Ninja, Ninja } from 'Ninja.js'                                         | 导入命名导出                         |
| import \\* as Ninja from 'NInja.js'                                              | 导入模块中声明的全部导出内容         |
| import { ninja as iNinja } from 'Ninja.js'                                      | 通过别名导入模块中声明的全部导出内容 |
`;export{n as default};

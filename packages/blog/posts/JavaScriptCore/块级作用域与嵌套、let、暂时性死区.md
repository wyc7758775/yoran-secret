# 块级作用域与嵌套、let、暂时性死区

别以为你稳了,
Don't get comfortable

## let

都 2022 年了,let 和 const、以及 var 的区别有太多的文章作出了解析.
甚至于,如果不用兼容 ie11, 现在的项目都可以不用使用[[babel]]来进行转译.白白生成那么多多余的代码.

下面这些题都能够毫无压力的做出来,那么证明这个知识点你已经完全掌握了. 一共十二道题.

```js
// 1
var b = 0
let b 10
console.log(b)
```

- 结果
  报错

```js
// 2
function test(a) {
  let a = 19;
  console.log(a);
}
test();
```

- 结果
  报错

```js
// 3
function test(a) {
  {
    let a = 10;
    console.log(a);
  }
  console.log(a);
}
```

- 结果
  10, undefined

```js
// 4
console.log(a);
let a = 10;

var a = a;
console.log(a);

let a = a;
console.log(a);
```

- 结果
  报错、undefined、报错

```js
// 5
function test(x = y, y = 2) {
  console.log(x, y);
}
test();
```

- 结果
  报错

```js
// 6
console.log(typeof a);
let a;
```

- 结果
  报错

```js
// 7
if (true) {
  let a = 1;
}

console.log(a);
```

- 结果
  报错

```js
// 8
for (; 1; ) {
  let a = 1;
}
console.log(a);
```

- 结果
  没动静

```js
// 9
{
  let a = 1;
  {
    let a = "a";
    console.log(a);
  }
  console.log(a);
}

for (let i = 0; i < 10; i++) {
  var i = "a";
  console.log(i);
}
```

- 结果
  'a'、1
  报错

```js
// 10
let i = 11;
for (let i = 0; i < 10; i++) {
  let i = 5;
  console.log(i);
}
console.log(a);

if (1) {
  let a = 1;
  {
    let a = 10;
    console.log(a);
  }
  console.log(a);
}
```

- 结果
  10 个 5、11、10、1

```js
// 11
var arr = [];
for (var i = 0; i < 10; i++) {
  arr[i] = function () {
    console.log(i);
  };
}
for (var i = 0; i < 10; i++) {
  arr[i]();
}
```

- 结果
  0、1、2、3、4、5、6、7、8、9

```js
// 12
for (var i = 0; i < 10; i++) {
  i = "a";
  console.log(i);
}

for (let i = 0; i < 10; i++) {
  i = "a";
  console.log(i);
}
```

- 结果
  'a'、'a'

var 时代,容易产生全局变量污染的问题. 在 es5 年代,通常来使用[[IIFE]]来解决一定问题. 但是在函数内部还是会出现这样的问题.这个时候我们就需要坚持一个原则来,[[KISS]]原则. keep it simple, stupid.

直接抛出 let 的带来的特点

1.  不可以重复定义
2.  变量不会提升,存在暂时性死区
3.  只能够在当前作用域下生效

上面的 12 道题目都可以套用这三个特点.

**- 从根本上来说,let 的带来为 js 带来了块级作用域.**

第十一题中, 就很隐蔽的出现了重复定义的问题. 第二次 for 循环中的 i 改变了 arr[i]中要打印出来的值. 在 es5 时代,对于这个问题,我们一般使用的[[IIFE]]形成的闭包的特性来进行解决.
如果第二个 for 循环换成 let

```js
for (let i = 0; i < 10; i++) {
  arr[i]();
}
```

打印的结果就是 10 个 10. let 不能够重复定义,也没有变量提升.此时的 i 和 arr 中的 i 看似命名一样.但是在栈内存中存储的位置是完全不同的.

第八题中,出现了无限循环,所以自然是不会运行到下面的.所以肯定是不会出现报错的.js 都没有运行到下面.

题目都很简单.let 的含义也很简单.毕竟都用了这么多年了.网上有大佬说,var、let、const 看情况来使用.但是我在业务中,没有找到 var 使用的任何场景,能用 const 就用 const,其余都是用 let.

## const

const 和 let 基本一致.除了对于基础类型变量的改变.

```js
const a = 0;
a = 10;
```

这样是会报错的.

```js
const a
```

这样还是会报错 `Missing initializer in const declaration`

但是下面这样就没有没有问题:

```js
const a = undefined;
```

所以说 const 是必须要初始化数据.

如果是引用类型的话,const 就不起作用了

```js
const a = {
  number: 1,
};
a.number++;
```

如果想要能够连对象都能够限制的话.就需要`Object.freeze()`上场了.
即便如此,const 变量依旧能够解决很多问题.对于 const、var、let 的使用,我们应该遵守这样的原则:

    尽量用let代替var,尽量用const代替let

一眼就能看到那些值是需要变化的,哪些不需要.

完

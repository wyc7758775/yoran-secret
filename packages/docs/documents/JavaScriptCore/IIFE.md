---
author: 橘子哥
createTime: 2022-01-30 22:00
modificationDate: 星期日 30日 一月 2022 22:00:35
description: 立即执行函数
category: Web
smallClass: JavaScript
key: artitle
---

# IIFE

```JavaScript

; (function test() {
  var a = 1,
    b = 2
    console.log(a + b)
})()

console.log(test) // test 报错,立即执行函数执行完毕之后马上就进行了销毁.

const b = (function(){
  return 5
}()) // w3c的规范写法, 但是上面那种在写代码过程更加的常用,只要是容易识别

console.log(b)

// 函数表达式才能够使用立即执行函数o
function test1() {
   console.log(1)
}() // 报语法错误

const c = function test2() {
  console.log(2)
 }()

 +function test3() {
   console.log(3)
 }()

 1 && function test3() {
   console.log(3)
 }()

 undefined || function test3() {
   console.log(3)
 }()
```

就如《JavaScript 忍者秘籍》中对于`IIFE`的描述一样, 函数表达式 + () = 立即函数.

所以有如下:

```JavaScript
const a = 1 + function() {return 3} () // 4
```

**w3c 的推荐写法：**

```JavaScript
(function(){}())
```

别的常用的写法：

```JavaScript
(function(){})()
```

以及在函数前面加上! && || - + 等符号也可以把函数声明变为函数表达式

利用立即执行函数来解决因为闭包产生的相关问题。

如闭包和循环中的图 1 中：

```JavaScript
function test() {
  var arr = []

  for(var i = 0; i < 10; i++) {
    (function(j){
      console.log(j) // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    })(i)
  }

}
```

理解执行函数带来的作用域的问题

```JavaScript
(function fun() {
    fun = 2
    console.log(fun) // [Function fun]
})()

```

> 据说这个的考点不是变量提升

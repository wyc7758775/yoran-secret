
---
author:  橘子哥
createTime: 2022-01-04 22:30  
modificationDate: 星期四 13日 一月 2022 02:29:37
description: 包装类
category: Web
smallClass: JavaScript
key: artitle

---

![](https://img2.baidu.com/it/u=139382954,2115973602&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500k)
# js让人诟病的这些feature

## 1.前言
- 是糟粕还是`feature`?这要取决于对于它的认识和使用.用的好就是feature,用得不好,可能就不单单是糟粕,还会要留在公司加班的.所以为了更加好的利用隐式转化,今天我们要好好的认识它.

- 而大部分的觉得js混乱的原因,也是由于它的想对于静态语言的不确定性.

- 下面我就一一来解析这些让人疑惑的问题.

> Thanks for inventing JavaScript!!!!

## 2. 0.1 + 0.2 == 0.3
### 分析	
- 输出结果是`false`
- 老问题了, 这个不单单是在Javascript中存在,在被的语言中都存在浮点数精度的问题. 高级语言中看到的数字背地里都是需要转化成二进制来计算的.而问题就恰好出在转化成二进制过程中产生的误差.

	1. 简单的说,在0.1 + 0.2 计算过程中,经过两次误差的计算.第一次, 经过第一次转化为双精度二进制浮点数的时候,二进制浮点数小数位只能存储52位,导致52位之后的数字进去的取舍.
	2. 第二次,发生已经转化为二进制时候的0.1和0.2 相加的操作, 又超出了位数的范围.
	
- 两次的误差导致了0.1 + 0.2 == 0.3 为 `false` .

> 在业务开发中,一般会影响到价格的计算. 所以为了避规这个问题,后台返回为前端的通常都是乘以100之后的单位,保证都是整数.

### 解决办法
- 情况已经是这么个情况,但是如果还是遇到了这样的应用场景的话.也不是没有办法解决.

	1. 先乘以1000再去掉

		```js
			(0.1 * 1000 + 0.2 * 1000)/1000 == 0.3
		```
	
	2. 使用ES6的`Number.EPSILON`方式
		```js
			console.log( Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON);
		```
		
	3. 用`math.js` 这个库, 听说对于某些数字还是有问题,精准计算还是对给后台吧🤔
	4. 使用`Math.round` 和`Math.pow`的方法结合
	
		
## 3. typeof容易忘记的三个点

- `typeof [[target]]` 返回的是一个字符串

- typeof null
	
	```js
		console.log(typeof null) // 'object'
	```
	
	这玩意儿截止到现在都还没有改,现在记住就行,就是一个坑
	
- typeof NaN 
	```js
	// 'number'
	```
	
- NaN的全称是`not a number`, 但是typeof出来的却是`number`.
- 太瞎了,还有更加瞎的

	```js
	NaN == Nan // false
	Number.Nan == NaN // false
	NaN === NaN // fasle
	Number.NaN === NaN // false

	Object.is(NaN, NaN) // false
	```

- 自己永远不等于自己.

## 4. 9999999999999999
```js
console.log(9999999999999999) // 10000000000000000
```

- 还是js精度w问题,超过53位就没有精准度而言

## 5. 隐式转化
### 5.1 相加还是相减少

```js
 1 + {} === ?
 {} + 1 === ?
 1 + [] === ?
 1 + '2' === ?
```

- 上面题目的结果
	1[object object], [object object]1, 1, 12
	
- 空对象被`Object.prototype.toString.call({})`
- 空数组转化为了0

```js
1 + '1' => 11
1 - '1' => 0
```

- 这里的结果表示了,字符串碰到 + 号, 把两者弄着字符串,然后连起来
- 但是如果是 - 号的话, 就把字符串转化为Number类型,相减

```js
const a = []
if (a) {
	console.log('1')
}

if (a == true) {
	console.log('2')
}
```

- 结果:
	打印出1

- 单个空数组的话, typeof a === 'object', 所以能够打印出1
- 和 bealoon 进行比较的话会先Number(a) == Number(ture) => 0 == 1 => false. 所以2没有打印出来

```js
console.log(new String('abc') == true)
console.log({} == ture) 
console.log([] = ![]) 
```

- 结果
	fasle, false, true
- 是不是有和你想得不一样的,在没有深入总结js隐式转化之前,我没次看到都会有错.全称靠猜,这种没有掌握规律的感觉很难受.


### 5.2 乱七八糟的转化
- 上面的例子中,没有一个正常进行运算的,都在背地里面做了某个方式的转化. 果然十天就弄出来的东西,一切都朝着简单的来. 现在TS大行其道是必然.😢
- 求求了,团队都用上TS吧!
- 为什么要想不开,要在项目中将不同类型的玩意儿进行运算呢?

- 但是面试的时候考啊, 那么通过穷举法来找找规律看看

#### +号规律

```js
// number, string, boolean, null, undefined, 排除symbol和bigInt
console.log(1 + '1') //  '11'
console.log(1 + true) // 2
console.log(1 + 1) // 2
console.log(1 + null) // 1
console.log(1 + undefined) // NaN
console.log(1 + []) // 1
console.log(1 + {}) // 1[object Object]

// 字符串
console.log('1' + '1') // '11'
console.log('1' + true) // '1true'
console.log('1' + null) // '1null'
console.log('1' + undefined) // '1undefined'
console.log('1' + []) // '1'
console.log('1' + {}) // '1[object Object]'


// boolean
console.log(true + true) // 2
console.log(true + null) // 1
console.log(true + undefined) // NaN
console.log(true + []) // true
console.log(true + {}) // true[object Object]


// null
console.log(null + null) // 0
console.log(null + undefined) // NaN 
console.log(null + []) // null
console.log(null + {}) // null[object object]

// 
console.log(undefined + undefined) // NaN
console.log({} + {}) // '[object Object][object Object]'
console.log({} + []) // '[object Object]'
console.log([] + []) // empty
```

从上面可以知道这么一些规律:

1. 空数组在加号中表达的是empty, 就是空,和它一起相加不管是什么都返回它本身, 包括它的类型.
2. 加号两边有字符串相加的话,会有将和字符串相加先转化为字符串,和第一点是不冲突.空数组专为空字符串
3. 补充第二点, 相加的是对象的话,**无所谓是不是空对象**.都会转化为字符串
4. 除此之外都优先讲变量转化为中数字.


#### -号规律

```js
console.log(1 - '1') //  0
console.log(1 - true) // 0
console.log(1 - 1) // 0
console.log(1 - null) // 1
console.log(1 - undefined) // NaN
console.log(1 - []) // 1
console.log(1 - {name: '我有值'}) // NaN 

console.log('--------------')

console.log('1' - '1') // 0
console.log('1' - true) // 0
console.log('1' - null) // 1
console.log('1' - undefined) // NaN 
console.log('1' - []) // 1
console.log('1' - {}) // NaN

console.log('--------------')

console.log(true - true) // 0
console.log(true - null) // 1
console.log(true - undefined) // NaN
console.log(true - []) // 1 
console.log(true - {}) // NaN

console.log('--------------')

console.log(null - null) // 0
console.log(null - undefined) // NaN 
console.log(null - []) // 0
console.log(null - {}) // NaN

console.log('--------------')

console.log(undefined - undefined) // NaN
console.log({} - {}) // NaN
console.log({} - []) // NaN
console.log([] - []) // 0

```

- 减法就要单纯得多,只要将双方都Number之后再相减就行了
- NaN和任何类型相减都是NaN 
- [] - [] 是一个例外, 不是NaN, 我不理解.我在网上也没有找到对应的答案 也可能是我搜索关键字有问题. 问题只要是处在`Number([])` 和`Number([1, 2])`已经`Number([1])`上面.为什么它会这么骚气的为0 , NaN, 1.

```js
console.log(Array.prototype.toString.call([])) // ''
console.log(Array.prototype.toString.call([1])) // '1'
console.log(Array.prototype.toString.call([1, 2])) // '1, 2'
```

#### !的转化规则
```js
let b
const a = !!b
```

- 双感叹号强制转化类型为boolean

| 数据类型 | 转化true | 转化为false |
|-| - | - |
| Boolean | true | false|
| Number | 任何非零数字,包括无穷大 | 0和NaN |
| String | 任何非空字符串 | '' |
| Object | 任何对象 | null |
| undefined | | undefined |


#### ==的转化规则
- 不用TS,你起码要用===吧.😂, 为什么还要使用==这么漏野的玩意儿呢?
- 同类型的直接比较,除了引用类型
- **其他的如果不是下面的情况,两边都是转化为number**

1. 引用类型和数字/字符串的比较

	```js
	const a = {}
	console.log(a == 1) // fasle
	console.log(a == '1') // fasle
	```
	
	- 在jbs引擎中进行如下的操作:
		- a.valueOf()获取到是不是基本类型
		- 如果不是的会调用toString().得到`[object Object]`
		- `[object Object]` 自然和 1 不想等了.

```js
const a = new String(123)
cosnole.log(a == 123) // true

cosnt b = new String('aaa')
cosnole.log(b == 'aaa') // true
```
- 调用valueOf() 直接就得到了基础数据类型.

2. 引用类型和引用类型的比较

```js
console.log([] == []) // false
console.log([] == {}) // false 
console.log({} == {})j'j // false 
```

- 两边都是引用类型的话,直接比较的是指向的地址的. 地址自然不可能不一样, 除非下面这样的操作
	```js
	const a = {}
	const b = a
	console.log(a == b) // true
	```

3. null、undefined、NaN和String Number Boolean Object比较的时候,比较的结果字节是false

4. [] == ![] 为true 不是特例
	- 这个要结合[[运算符的优先级]]来思考的.
	- !的优先级大于==
	- 所以![] 为false, []是引用类型toString()为`[object Object]`. 
	- 此时[] == fasle,两边都转化为number, 
	- 0 == 0, 为真
	
#### 大于小于号规则	
- 这个问题有一个典型的案例.
	```js
	const a = [1, 23, 12]
	cosnole.log(a.sort()) // [1, 43, 5]
	```
	
	我们都知道,这个是由于sort它排序的方法就是把数组中的数字变为字符串,然后比较ASCII码.
	
	```js
	function sortNumber(pre, next) {
		return pre - next
	}
	console.log(a.sort(sortNumber())) // [1, 5, 43]
	```
	
	只有自己添加这样的函数才可以真正的实现你想要的排序.这个是es规定给你的两个pre, next值. 如果返回的是真就说面前一个值大于后面一个值,两个就互换位置,反之亦然.这个就是[[数据结构]]中[[冒泡排序]]的简单实用
	
	〉 return pre - next 是升序, 降序反过来就行了

- 所以说,下面的为false
	
```js
console.log('23' > '3')
```

## 6. 隐式转化另外一种记忆的方法

隐式转化无非就是在处理数据的过程中,发生了装包和拆包.使用了JS核心库中的一些包装类来封装.
所以我们在记忆包装类的结果之后,再结合各种运算符会出发的包装. 从逻辑上面更加的容易记忆.

### 6.1 Number

| 操作              | 结果 |
| ----------------- | ---- |
| Number(undefined) | NaN  |
| Number(null)      | 0    |
| Number('')        | 0    |
| Number(infintity) | Infintity     |

> null是特例,强行记住就行😮‍💨

### 6.2 Boolean

- 虚值(false): undefined、null、0、NaN、false,  ''
- 其他类型都是true, 除了上面的虚值
- 引用类型都是true

	| Boolean([]) | Boolean({}) | Boolean(/d/) | Boolean(new Error()) | Boolean(Symbol()) | 
	| ----------- | ----------- | ------------ | -------------------- | ----------------- |




## 7. 祝世界和平,祝愿所愿的团队都早日用上TS,开心过好每一天
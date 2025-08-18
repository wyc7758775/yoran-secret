# parseInt

**parseInt('012', 16)和 parseInt(012, 16)相等吗？**

**["10", "10", "10", "10", "10"].map(parseInt)的结果是什么？**

先来一起复习一下`parseInt()`的基本用法。

## 1 parseInt()的使用说明

使用参数说明：**paraseInt(value: string, radix?: number)**

> parseInt()是对 Number()很好的补充

### 1.1 解析数字和字母的混合字符串

当`Number()`返回的都是`NaN`的时候，`parseInt()`有不一样的解析结果。parseInt 会忽略无效字符，如果第一个字符串元素就非数字，那么就返回`NaN`。

```js
Number("123abc"); // NaN
Number("123asd1"); // NaN
Number("ad123"); // NaN
// -------
parseInt("123abc"); // 123
parseInt("123asd1"); // 123
parseInt("123---8979$$$"); // 123
parseInt("ad123"); // NaN
```

### 1.2 用于浮点数的取整:

```js
console.log(parseInt(11.22)); // 11
console.log(Number(11.22)); // 11.22
```

### 1.3 将其他的进制转化为十进制

- 标准格式: **`parseInt(string, radix)`**
- `radix`: 表示字符串的基数，取值范围是从 2 到 36。16 就表示被解析值是十六进制数。
- 计算方法：**基数 \* (radix ^ (当前位数 - 1)) 然后依次相加**

如下例子:

```js
console.log(parseInt(101, 2)); // 5
console.log(parseInt(123, 5)); // 38
parseInt("6axxx", 16); // 106
```

> parseInt('6axxx', 16), 16 进制能够识别 6a，到 x 为止。

其转化的过程如下：

$1\times( 2 ^ 2 ) + 0 \times (2 ^ 1) + 1 \times (2 ^ 0) = 4 + 0 + 1 = 5$

$1 \times (5 ^ 2) + 2 \times (5 ^ 1) + 3 \times (5 ^ 0) = 25 + 10 + 8 = 38$

需要注意的是：

- `radix`的默认值不一定是 10，如果字符串 string 以其它任何值开头，则基数才是 10 (十进制)。

这玩意儿很智能.输入的如果是标准的 16 进制或者 8 进制的话,就可以把`radix`初始化为对应的进制的值。比如说`parseInt(0xfff)` 的结果是 4096，不用放入`radix`值。

但是如果，你后面非要加非 16 进制的制位的话，那还是会按照对应的`radix`来计算。比如`parseInt(012, 3)`是 3 而不是 8。

### 1.4 parseInt 中的隐式转化

parseInt('012', 16)和 parseInt(012, 16)的结果是否一致呢？

我们打印结构如下：

![截屏2023-02-11 00.34.18.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90be49c2fde944bbba3ef86f3cfd1c4a~tplv-k3u1fbpfcp-watermark.image?)

**前者是 18，后者是 16！**， why?

很简单，其实通过我这个小标题也能够知道原因。因为 parseInt(012, 16)发生了隐式转化。第一参数是`string`类型，而它是`number`类型，构成了隐式转化的条件，触发了`toString()`的规则。

`012.toString()`结果为 10.

所以说，**parseInt(012, 16) = parseInt('10', 16).**

$$
1 \times(16^1)+0\times(16^0)=16
$$

## 2. **可以用来取整**

```JavaScript
console.log(parseInt(1213.22)) // 1213
console.log(parseInt('1213.22')) // 1213
console.log(parseInt('-1213.22')) // -1213
```

上面的过程会经过如下:

1. isNaN 判断他是否是数字,不同的是 isNaN 在如果是数字或者**以数字开头**的字符串的话返回的是`boolean` 类型`true`. 而在 parseInt 中是返回了数字或者到出现除数字之外的字符位置.
   ```JavaScript
   console.log(parseInt('123add')) // 123
   console.log(parseInt('1123.22')) // 1123
   ```
   间接的达到了取整数的作用.
2. 转化为`String`类型.

## 3.**设置当前的的\*\***`String`\***\* 是多少进制的. **

parseInt 标准格式

parseInt(_string_, _radix_);

radix 默认为 10,即 10 进制.

取值范围是从 `2` 到 `36`，表示字符串的基数。例如指定 16 表示被解析值是十六进制数。请注意，

**10 不是默认值！**

```JavaScript
parseInt('1011', 2) // 11
parseInt('123', 5) // 38
```

其他进制转化为十进制的公式

最高位数 _ (radix ^ (当前位置 - 1)) ..... + 最后一位数 _ (radix ^ 0)

从而可以得出

```JavaScript
1 * (5 ^ 2) + 2 * (5 ^ 1) + 3 * (5 ^ 0) = 38
```

## 4. 当然也存在不需要填写 radix 就可以得出它是多少进制的情况

```JavaScript
parseInt('0xfff') // 3095
```

如上所示,如果输入的是标准的 16 进制的表示法,后面的 radix 是可以省略的.

这也印证了 10 不是默认值！

## 5. 通过经典面试题检查对于它的理解

下面的输出结果是什么？

```js
["10", "10", "10", "10", "10"].map(parseInt);
```

我们需要有这么一个认知：

- map 是一个函数
- map 的的参数有两个，一个函数`callbackFn`，一个可选对象`thisArg`，用于执行前者用作`this`值。
- map 的的参数函数有三个参数：`currentValue`、`index`、`array`
- `parseInt`就是一个函数

所以说，什么的题目等于下面代码片段：

```js
["10", "10", "10", "10", "10"].map((item, index) => {
  return parseInt(item, index);
});
```

由此可得：

```js
parseInt("10", 0); // 10
parseInt("10", 1); // NaN
parseInt("10", 2); // 2
parseInt("10", 3); // 3
parseInt("10", 4); // 4
```

那么我们根据上面的描述，就可以很自然得出`[1, 2, 3, 4].map(parseInt)`的结果。

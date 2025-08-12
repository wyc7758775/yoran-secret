# parseInt 1

## 1. **可以用来取整**

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

## 2.**设置当前的的\*\***`String`\***\* 是多少进制的. **

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

## 3. 当然也存在不需要填写 radix 就可以得出它是多少进制的情况

```JavaScript
parseInt('0xfff') // 3095
```

如上所示,如果输入的是标准的 16 进制的表示法,后面的 radix 是可以省略的.

这也印证了 10 不是默认值！

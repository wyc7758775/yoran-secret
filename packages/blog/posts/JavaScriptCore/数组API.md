# 数组 API

## 1. Array.prototype.copyWithin

### 1.1 基本形式 Arrauy.prototype.copyWithin(target, (start, end])

> target 是指从什么位置开始

```js
const arr = [1, 2, 3, 4, 5];
const newArr = arr.copyWithin(1, 0, 3);
console.log(newArr); // 1, 1, 2, 3, 5
```

> start 旁边的(符号代表闭区间,end 旁边的]开区间

从上面的例子可以直接知道.target 代表从数组的第几位开始覆盖. start 和 end 代表将另外一段替换上 arr 上面.

### 1.2 end 超过原数组最长长度的时候

```js
const newArr = arr.copyWithin(1, 0, 13);
console.log(newArr); // 1, 1, 2, 3, 5
```

end 超出数组最大长度的时候,就默认到头. 在这个数组中为 4.

### 1.3 end 大于 start 的时候

```js
const newArr = arr.copyWithin(1, 3, 1);
console.log(newArr); // 1, 2, 3, 4, 5
```

如果 start 大与 end 的话, 出来的结果没有变化.

### 1.4 end 不存在的时候

```js
const newArr = arr.copyWithin(1, 3);
console.log(newArr); // 1, 4, 3, 4, 5
```

当没有第三个数字的时候, 会默认和第二个数字一致. `arr.copyWithin(1, 3, 3)`

### 1.5 start 和 end 都不存在的时候

```js
const newArr = arr.copyWithin(3);
console.log(newArr); // 1, 2, 3, 1, 5
```

如果 start 和 end 都没有的话. 就默认是 0, 0

### 1.6 start 和 end 为负数, start > end

```js
const newArr = arr.copyWithin(3, -1, -3);
console.log(newArr); // 1, 2, 3, 4, 5
```

没有效果.

### 1.7 start 和 end 为负数, start < end

```js
const newArr = arr.copyWithin(3, -3, -1);
console.log(newArr); // [ 1, 2, 3, 3, 4 ]
```

-1 是最后一个数组, 倒数第二对应的是-2. 如果超过数组长度,默认为第一个,及 0.

### 1.8 start 和 end 为负数, start < end, start < arr.length - 1

```js
const newArr = arr.copyWithin(3, -13, -1);
console.log(newArr); // [ 1, 2, 3, 1, 2 ]
```

如上所说. start 的绝对值大于数组最长长度的时候,默认为 0

### 1.9 start 和 end 为负数, end = null

```js
const newArr = arr.copyWithin(3, -1);
console.log(newArra); // 1, 2, 3, 5, 5
```

同正数的一样.

### 1.10 start 和 end, start < 0, end > 0

```js
const newArr = arr.copyWithin(3, -1, 0);
console.log(newArra); // 1, 2, 3, 4, 5
```

无效

## 2. Array.prototype.entries

使用这个的前置知识[[generator和iterator]]

## 3. Array.prototype.fill

使用方法和`copyWithin`类似.

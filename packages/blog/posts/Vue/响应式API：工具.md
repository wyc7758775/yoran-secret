# 响应式 API：工具

## 参考资料

- [isRef()](https://cn.vuejs.org/api/reactivity-utilities.html#isref)
- [unref()](https://cn.vuejs.org/api/reactivity-utilities.html#unref)
- [toRef()](https://cn.vuejs.org/api/reactivity-utilities.html#toref)
- [toValue()](https://cn.vuejs.org/api/reactivity-utilities.html#tovalue)
- [toRefs()](https://cn.vuejs.org/api/reactivity-utilities.html#torefs)
- [isProxy()](https://cn.vuejs.org/api/reactivity-utilities.html#isproxy)
- [isReactive()](https://cn.vuejs.org/api/reactivity-utilities.html#isreactive)
- [isReadonly()](https://cn.vuejs.org/api/reactivity-utilities.html#isreadonly)

这些 API 的用法非常的简单，而且通过这些命名就可以知道它们属于可有可无的一些方法。

### 防御性编程 API

- `isRef()` : 检车某个值是否为 `ref`。
- `isProxy()` : 检测某个值是否为`reactive`、`shallowReactive`、`readonly`，以及`shallowReaonly`。
- `isReactive()` : 检测某个值是否为`reactive`、`shallowReactive`。
- `isReadonly()` : 检测某个值是否为`readonly`，`shallowReaonly`。

这种 API 就是典型的类型判断的 API，多用于 Hook 函数中对于传入参数的值得类型的判断，不同的类型使用不同的取值逻辑。

### 灵活性访问 API

- `unref()`：等同于`const a = isRef(b) ? b.value : b` ，是为了拿到 ref 的值的语法糖。
- `toRef()`：将非响应式的变量，基础类系和引用类型都可以，转化为 ref。
- `toRefs()`：针对`reactive` 对响应式对象，让它的对象每一个解耦出来的属性都是 ref。
- `toValue()`: 比 `unref`多出一个转化的情况，可以转化`() => 9` 这样的而 `getter`函数的值。

这一组 API，解决了响应式编程中的核心问题： 保持数据响应性的同时提供更灵活的访问方式。

其他`toRefs()` 典型的用法就是说明这个问题，可以让开发者直接解耦代码而不失去响应式，官网的例子如下：

```js
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2,
  });

  // ...基于状态的操作逻辑

  // 在返回时都转为 ref
  return toRefs(state);
}

// 可以解构而不会失去响应性
const { foo, bar } = useFeatureX();
```

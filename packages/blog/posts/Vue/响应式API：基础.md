# 响应式 API：基础

## 参考资料

- [ref()](https://cn.vuejs.org/api/reactivity-core.html#ref)

- [computed()](https://cn.vuejs.org/api/reactivity-core.html#computed)

- [reactive()](https://cn.vuejs.org/api/reactivity-core.html#reactive)

- [readonly()](https://cn.vuejs.org/api/reactivity-core.html#readonly)

- [watchEffect()](https://cn.vuejs.org/api/reactivity-core.html#watcheffect)

- [watchPostEffect()](https://cn.vuejs.org/api/reactivity-core.html#watchposteffect)

- [watchSyncEffect()](https://cn.vuejs.org/api/reactivity-core.html#watchsynceffect)

- [watch()](https://cn.vuejs.org/api/reactivity-core.html#watch)

- [onWatcherCleanup()](https://cn.vuejs.org/api/reactivity-core.html#onwatchercleanup)

## 1. ref

无需多说它的使用，说一个可以对 ref 的初始化和赋值的封装，让它和 react hook 的写法一致。

```js
const useRef = <T>(value: T): [Ref<T>, (value: T) => void] => {
  const targetRef = ref<T>(value);
  const setTargetValue = (value: T) => {
    targetRef.value = value;
  };
  return [targetRef as Ref<T>, setTargetValue];
};
```

具体的使用的组件中使用如下：

```js
const [count, setCount] = useRef < number > 0;

const addCount = () => {
  const newCount = count.value + 1;
  setCount(newCount);
};
```

很多人都说这样封装造成了代码的冗余，直接操作 count.value 就可以很方便了。非常的有道理，这个只是个人的喜欢而已，个人感觉给封装了一个 setCount 会让 ref 的操作更加的函数式，而不是直接操作这个变量。最大的好处就是**统一通过** `**setCount**`**来更新状态，提高代码的一致性**。

## 2. computed

大多数使用手法如下：

```js
<script setup>
  const count = ref(1) const doubleCount = computed(（） => count.value++)
</script>
```

直接操作 `doubleCount`会报错，它是只读的。

另外一个比较不常用的，我们可以通过点击 `computed`打开它的 TS 类型，官方的例子依有记载，如下：

```js
export declare function computed<T>(getter: ComputedGetter<T>, debugOptions?: DebuggerOptions): ComputedRef<T>;
export declare function computed<T, S = T>(options: WritableComputedOptions<T, S>, debugOptions?: DebuggerOptions): WritableComputedRef<T, S>;
```

利用 TS 的重载功能，支持两种使用方式，第一种就是传入一个 `getter`函数，返回的值为只读。而另外一种是一个 `options`对象，同时支持 `setter`和 `getter`两个函数，通过它的类型名字就可以看出 `writable`，既可写的对象。使用如下：

```js
const ableWrite = computed({
  get() {
    // 读取时: 原始值 * 10
    return count.value * 10;
  },
  set(newValue) {
    // 验证输入是否为有效数字
    if (
      newValue === null ||
      newValue === undefined ||
      isNaN(Number(newValue))
    ) {
      errorMessage.value = "请输入有效的数字!";
      return;
    }

    // 验证通过，清除错误信息
    errorMessage.value = "";

    // 写入时: 新值同步到原始数据
    count.value = Number(newValue);
  },
});
```

例子也是使用 options 的典型使用场景，可以用于数据的校验，和 `customRef`的使用场景是有重合的。但是有不错，`customRef`就是元数据，而 computed 不是，它返回的是另外一个响应式变量来处理。举个如下的 例子：

```js
// 需要额外的ref和watch，不直观
const inputValue = ref("");
const debouncedValue = ref("");

// 防抖逻辑与计算逻辑分离
watch(inputValue, (newVal) => {
  const timeout = setTimeout(() => {
    debouncedValue.value = newVal;
  }, 300);
  return () => clearTimeout(timeout);
});

// 基于防抖后的值计算
const computedValue = computed(() => debouncedValue.value.toUpperCase());
```

同样是需要防抖的功能，翻阅[进阶 API](https://www.yuque.com/xiaoganju-ynq12/ypvc5e/gisghexpqziklrry "进阶 API")中的 `customRef`，它操作的更加底层，所以逻辑能够更加的内聚，防抖也是官方给出的典型的例子。

## 3. reactive

同 `ref`。

## 4. readonly

```js
<script setup>
const data = reative({
  count: 0
})
const obj2 = readonly(obj);
const obj3 = readonly({
  cout: 0
})

const handleClick = () => {
  obj.count++;
};
</script>
```

`obj2`依旧是可写。`obj3`才可读。

## 5. watchEffect

值得一提的就是它的 `onCleanup`回调函数的使用。和组件的生命周期非常的相似。

```js
watchEffect(async (onCleanup) => {
  const controller = new AbortController();

  // 注册清理：取消未完成的请求
  onCleanup(() => controller.abort());

  try {
    const res = await fetch("/api/data", {
      signal: controller.signal,
    });
    const data = await res.json();
    // 处理数据...
  } catch (e) {
    if (e.name !== "AbortError") console.error(e);
  }
});
```

等同于

```js
import { onWatcherCleanup } from "vue";
watchEffect(() => {
  onWatcherCleanup(() => {
    /* 清理逻辑 */
  }); // 功能等同 onCleanup
});
```

业务开发中，很很多方法可以实现这样的监听，所以大多数情况我们是禁止使用 `watchEffect`了，它的随意使用给排查问题带来了非常大的问题。团队开发的原则是可读性，而不是方便，所以才有各种规范。

## 6. watch

```js
watch(id, (newId, oldId, onCleanup) => {
  const timer = setInterval(() => console.log("Running"), 1000);
  onCleanup(() => clearInterval(timer)); // 注册清理函数
});
```

和 watchEffect 一致，但是用法更加的内聚，不需要想使用 watchEffect 一样，人工去判断里面到底是哪个响应式变化了引起了问题。

这两个监听 API 最重要的就是 `onCleanup`方法，业务开发中，多用于手动清除一下宏任务，比如 setTimeout 方法等，以及取消请求，如下：

```js
watch(keyword, async (newVal, oldVal, onCleanup) => {
  const controller = new AbortController();
  onCleanup(() => controller.abort()); // 依赖变化时取消旧请求
  const data = await fetch(url, { signal: controller.signal });
});
```

在 input 输入框中，连续输入需要中断上一次请求。

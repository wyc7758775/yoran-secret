# 响应式 API：进阶

## 参考资料(vue3 官网)

- [shallowRef()](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref)
- [triggerRef()](https://cn.vuejs.org/api/reactivity-advanced.html#triggerref)
- [customRef()](https://cn.vuejs.org/api/reactivity-advanced.html#customref)
- [shallowReactive()](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive)
- [shallowReadonly()](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreadonly)
- [toRaw()](https://cn.vuejs.org/api/reactivity-advanced.html#toraw)
- [markRaw()](https://cn.vuejs.org/api/reactivity-advanced.html#markraw)
- [effectScope()](https://cn.vuejs.org/api/reactivity-advanced.html#effectscope)
- [getCurrentScope()](https://cn.vuejs.org/api/reactivity-advanced.html#getcurrentscope)
- [onScopeDispose()](https://cn.vuejs.org/api/reactivity-advanced.html#onscopedispose)

## 前言

官方已经很好的写出了这些 API 是如何使用的，但是没有结合实践的业务场景来说明运用的场景，这个对于我们实际的开发非常的重要，而且在现在离不开大模型的情况下，对于我这种业务开发员来说，广度可能比深度更加的重要。

## 1. ShallowRef

shallow 翻译为浅的，读音：ˈʃæləʊ/，这里的 shallowRef 是浅的引用。

### 1.1 基础使用

```
<template>
  <p>多层级 shallowRef: {{ objShallow.count }}</p>
  <p>shallowRef: {{ count }}</p>
  <button @click='addShallowRefCount1'></button>
  <button @click='addShallowRefCount2'></button>
</template>
<script setup>
  const objShallow = shallowRef({
    count: 0,
  });
  const count = shallowRef(0)
  const addShallowRefCount1 = () => {
    objShallow.value.count++ // 界面没有变化
  }
  const addShallowRefCount2 = () => {
    count.value++ // 界面实时改变
  }
</script>
```

也就是说 `shallowRef`它只收集 root 层级的数据变化，所以 `objShallow.value.count++`在界面没有响应。**换一句话说，就是只监听.value 这个层级的变化**。只是进行依赖收集，而不会监听.value 之后的层级的属性的变化。可以通过如下的方法让它可以在界面渲染：

```
<script setup>
const addShallowRefCount1 = () => {
  objShallow.value.count++ // 和下面的 count.value 在一起就界面就会改变了
  count.value++
}
const addShallowRefCount3 = () => {
  objShallow.value = {
    count: ++objeShallow.value.count
  }
}
</script>
```

Diff 算法用于比较新旧虚拟 DOM 树的差异,发现有变化了就重新更新整个组件

上面的两种方式本质都是触发了组件的重新渲染。`addShallowRefCount3`不用多说，第一个方法是更加的让人错愕。当触发 count.value++的时候会执行 diff 算法，然后 diff 算法发现了差异之后，会重新更新**整个组件。**这个时候 `objShallow.value.count`会渲染最新的值。

对象如此，数组也一样：

```
<template>
  <button @click="pushShallowRef">push shallowRef</button>
  <p>shallowRef: {{ refShallow }}</p>
</template>
<script setup>
const refShallow = shallowRef([1, 2, 3]);
const pushShallowRef = () => {
  refShallow.value[1] = 4444; // ❌
  refShallow.value.push(4); // ❌
};
</script>
```

### 1.2 业务使用场景

#### 1.21 一次性处理大批量的数据

添加下数据

```
<script setup>
const originArray = () => {
  return { items: [{ count: 0 }] }
}
const arrayShallow = shallowRef(originArray())
const addArrayShallow = () => {
  // 插入 1000 个元素到 arrayShallow
  for (let i = 0; i < 1000; i++) {
    arrayShallow.value.items.push({ count: i })
  }
  triggerRef(arrayShallow) // 仅一次更新
}

const arrayRef = ref(originArray());
const addArrayRef = () => {
  let template = { items: [{ count: 0 }] }
  for (let i = 0; i < 1000; i++) {
    template.items.push({ count: i })
  }
  arrayRef.value = template
}
</script>
```

使用 `originArray`函数封装原始数据，是为了之后可能存在初始化的可能性。s

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1754306966587-4647f582-3d60-49ad-9737-60543246b9a7.png)

这个是两个函数的运行时间，并没太大的差别，虽然理论上说 ref 会个嵌套每一个属性添加响应式代理，这样无疑会导致运行时间增加，但是实际的测试等于没有差别，即便数据量添加到 1 万。shallowRef 的优势在于 uptate 的时候，如下代码片段。

```
<script>
const changeArrayShallow = () => {
  const start = performance.now();
  // 高频修改内部属性
  for (let i = 0; i < 10000; i++) {
    arrayShallow.value.items[i].count =
      arrayShallow.value.items[i].count + 1000; // 无响应式开销
  }
  triggerRef(arrayShallow); // 仅一次更新
  const end = performance.now();
  console.log("changeArrayShallow 运行时间: ", end - start);
};

const changeArrayRef = () => {
  for (let i = 0; i < 10000; i++) {
    arrayRef.value.items[i].count = arrayRef.value.items[i].count + 1000; // 无响应式开销
  }
};
</script>
```

运行的结果如下：

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1754313858262-123f7b4b-e552-4267-93f5-7e2f54de49ba.png)

使用 Ref 的 更改数据的用时是 25ms，而使用 ShallowRef 的是 0.7。应该它只更新一次数据，而 Ref 触发了 10000 次的。**本质创建 10000 个响应式代理与创建 1 个响应式代理的性能差异巨大。**

但是 只使用 ref 不可以实现 shallowRef 一样的性能效果吗？它性能提升的主要是 shallowRef 在数据改变之后，再进行一次的响应式触发，所以我们只需要讲 ref 也改为响应式触发就可以了。

具体如下：

```
<script>
  const changeArrayRefOptimized2 = () => {
  const start = performance.now();

  // 获取原始对象
  const rawData = toRaw(arrayRef.value);

  // 直接修改原始对象（无响应式开销）
  for (let i = 0; i < 1000; i++) {
    rawData.items[i].count += 1000;
  }

  // 手动触发更新
  arrayRef.value = { ...rawData };

  const end = performance.now();
  console.log("changeArrayRefOptimized 运行时间: ", end - start);
}
</script>
```

运行的耗时如下：

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1754319412934-a1cb9376-14a7-4127-9e4c-69b404e7fa20.png)

只是 ref 一样可以到底性能优化的目的。只是 shallowRef 会更加的方便，不需要通过 `toRaw`将响应式数据转化为原始对象，非响应式的。如果数据量多了，多创建一个大数据依旧会增加内存的占用的。

ref 加 toRaw 是 "绕过响应式" 的临时解决方案，而 shallowRef 是 Vue 为 "浅层响应式需求" 设计的原生 API，在初始化性能、内存占用、引用追踪的简洁性和第三方库集成方面，具有 ref 无法替代的优势。

#### 1.22 大表单有优化： ref 和 shallowRef 极致的性能优化

总体思路是 shallowRef 负责大数据的渲染，ref 负责单个表单元素的实时渲染。

```
<template>
  <table>
  <tr v-for="row in bigData.rows" :key="row.id">
    <td>
      <!-- 绑定到 currentEditRow，确保输入时实时反馈 -->
      <input
        v-model="currentEditRow[row.id].value"
        @focus="startEdit(row)"
        @blur="saveEdit(row)"
      />
    </td>
  </tr>
</table>
</template>
<script setup>
  const bigOriginData = () => {
  // 模拟大数据
  const rows = [];
  for (let i = 0; i < 1000; i++) {
    rows.push({
      id: i,
      value: `第${i}行`,
    });
  }
  return { rows }
}
const bigData = shallowRef(bigOriginData())

// 当前正在编辑的行用 ref（保证实时反馈）
const currentEditRow = ref(bigOriginData().rows)

// 开始编辑时：将行数据复制到 currentEditRow
const startEdit = (row) => {
  currentEditRow.value[row.id] = { ...row }
};

// 失去焦点时：同步修改到大数据，并触发更新
// 每一次都是改变一次引用
const saveEdit = (row) => {
  // 将修改同步到大数据
  const target = bigData.value.rows.find((r) => r.id === row.id)
  Object.assign(target, currentEditRow.value[row.id])

  // 手动触发大数据更新（界面刷新）
  bigData.value = { ...bigData.value }
}
</script>
```

本质还是为了降低响应式处理的耗时，正如上面代码片段描述的一样，每一次更多只是改变一次响应式的变化，而且还能够帮助界面的实时改变。

## 2. CustomRef

这是一个非常典型符合元编程范式的 API，和 `Proxy`api 一样。不仅仅局限于业务的逻辑，可以从修改程序本身。

元编程的最大特点就是操作程序自身

`customRef`相比 `ref`而言，白盒子和黑盒子的对比，它提供了 ref 内部的 track 和 trigger 方法，可以直接操作 `ref`内部不暴露的依赖收集和响应式的方法。而这两个方法就等于程序自身，而 `customRef`可以操作这个程序，也就论证了可以操作程序自身，所以 `customRef`符合元编程范式。

### 2.1. 基础使用

customRef 将依赖收集和响应式变化的调用时机完全交给开发者。

```
<script setup>
import { customRef, ref } from "vue"
const testCount = customRef((track, trigger) => {
  let value = 0 // 值的初始化
  return {
    get() {
      track()
      return value
    },
    set(newValue) {
      value = newValue;
      trigger()
    },
  }
})
const addTestCount = () => {
  testCount.value++
}
</script>
```

### 2.2. 业务使用场景

#### 2.2.1. 防抖

```
<template>
  <button @click="addCount">count++</button>
  <p>count: {{ count }}</p>
</template>
<script setup>
const useDebouncedRef = (value, delay = 200) => {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}
const count = useDebouncedRef(0);
const addCount = () => {
  count.value++
}
</script>
```

#### 2.2.2. 验证

```
<template>
  <input v-model="emailValue" />
  <p style="color: red">{{ errorText }}</p>
</template>
<script setup>
const errorText = ref("")
const emailValue = customRef((track, trigger) => {
  let value = ""
  return {
    get() {
      track()
      return value
    },
    set(newValue, oldValue) {
      value = newValue;
      if (newValue.trim() === "") {
        errorText.value = "请输入邮箱"
        return
      }
      if (newValue.includes("66")) {
        errorText.value = "你够 6"
        trigger()
        return
      }
      errorText.value = ""
      trigger()
    },
  }
})
</script>
```

#### 2.2.3. 数据持久化

```
<script setup>
const valueLocal = customRef((track, grigger) => {
  return {
    get() {
      track();
      return localStorage.getItem("valueLocal") || "light"
    },
    set(newValue) {
      localStorage.setItem("valueLocal", newValue)
      grigger();
    },
  }
})
const changeTheme = () => {
  valueLocal.value = valueLocal.value === "dark" ? "light" : "dark"
}
</script>
```

## 3. ShallowReactive

### 3.1. 基本使用

```
<template>
  <button @click="addShallowReactiveCount">addShallowReactiveCount</button>
  <button @click="addShallowReactiveCount2">addShallowReactiveCount2</button>
  <p>
    shallowReactive: {{ objShallow.count }}; 多层级 shallowReactive:
    {{ objShallow.obj.count }}
  </p>
</template>
<script setup>
const objShallow = shallowReactive({
  count: 0,
  obj: {
    count: 0,
  },
})
const addShallowReactiveCount = () => {
  objShallow.count++
}
const addShallowReactiveCount2 = () => {
  objShallow.obj.count++
}
</script>
```

和 `shallowRef`基本是一致的，只是面试操作的类型不一样。和 ref 之于 reactive 的一样。

### 3.2. 业务使用场景

同 `shallowRef`。

## 4. ShallowReadonly

主要是和一些 API 进行比较，本身的使用还是很简单的。

### 4.1. 基本使用

```
const shallowReactiveObject = shallowReadonly({
  foo: 42,
  obj: {
    too: 11,
  },
});
shallowReactiveObject.foo = 33; // ❌ 改
shallowReactiveObject.bar = 11; // ❌ 增
delete shallowReactiveObject.foo; // ❌ 删
shallowReactiveObject.obj.too = 22; // ✅ 改
shallowReactiveObject.obj.bar = 11; // ✅ 增
delete shallowReactiveObject.obj.too; // ✅ 删
console.log("shallowReactiveObject.foo:", shallowReactiveObject); // Expected output: 42
```

第一层数据和 `readonly`的一致，第二层就和操作普通的对象一样的，增删改查的都可以了。

#### 4.1.1. readonly

```
/**
 * readonly() 方法可以创建一个只读的对象，对象的属性不能被修改。
 */
const readonlyObject = readonly({
  foo: 42,
  obj: {
    too: 11,
  },
});
readonlyObject.foo = 33; // ❌ 改
readonlyObject.bar = 11; // ❌ 增
delete readonlyObject.foo; // ❌ 删
readonlyObject.obj.too = 22; // ❌ 改
readonlyObject.obj.bar = 11; // ❌ 增
console.log("readonlyObject.foo:", readonlyObject); // Expected output: 42
```

#### 4.1.2. Object.seal

从此开始下面都是原生底层的 API，不是上面的 vue3 框架提供的 API。这些方法直接修改对象的 内部属性描述符 （如 [[Extensible]] 、 [[Writable]] 、 [[Configurable]]）。

seal() 方法可以防止新属性的添加和已有属性的删除，但是可以修改已有属性的值。

```
const object = {
  foo: 42,
};

Object.seal(object);
object.foo = 33;
console.log(object.foo); // Expected output: 33

delete object.foo; // Cannot delete when sealed
console.log("seal() delete object.foo:", object.foo); // Expected output: 33
object.foo = 11; // ✅
object.bar = 11; // ✅
console.log("seal() object.foo:", object.foo); // Expected output: 33
```

#### 4.1.3. Object.freeze

```
const object2 = {
  foo: 42,
};

Object.freeze(object2);
object2.foo = 33; // ❌
object2.bar = 11; // ❌
delete object2.foo; // ❌
console.log("freeze() object2.foo:", object2.foo); // Expected output: 42
```

只可以读取，其他任何的操作都会直接报错，阻塞 JS 主线程的运行。

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1754328281285-67f3d43d-0d56-4706-ac5c-ddb3c4011355.png)

#### 4.1.4. Object.preventExtensions

preventExtensions() 方法可以防止新属性的添加，但是可以修改已有属性的值。

```
const object3 = {
  foo: 42,
};

Object.preventExtensions(object3);
object3.foo = 33; // ✅
object3.bar = 11; // ❌
delete object3.foo; // ✅
object3.foo = 11; // ❌
console.log("preventExtensions() object3.foo:", object3.foo); // Expected output: 42
```

#### 4.1.5. 校验是否被以上 API 修改对象的数据属性的方式

`Object.isFrozen`、`Object.isSealed`、`Object.isExtensible`。

```
/**
 * 4. Object.isFrozen() 方法
 * isFrozen() 方法可以判断一个对象是否被冻结。
 */
console.log("------------Object.isFrozen() 方法分割线--------------");
console.log("Object.preventExtensions()", Object.isFrozen(object3)); // 空对象了，才是true
console.log("Object.freeze()", Object.isFrozen(object2)); // true
console.log("Object.seal()", Object.isFrozen(object)); // false

/**
 * 5. Object.isSealed() 方法
 * isSealed() 方法可以判断一个对象是否被密封。
 */
console.log("------------Object.isSealed() 方法分割线--------------");
console.log("Object.seal()", Object.isSealed(object)); // true
console.log("Object.freeze()", Object.isSealed(object2)); // true
console.log("Object.preventExtensions()", Object.isSealed(object3)); // false

/**
 * 6. Object.isExtensible() 方法
 * isExtensible() 方法可以判断一个对象是否是可扩展的。
 */
console.log("------------Object.isExtensible() 方法分割线--------------");
console.log("Object.preventExtensions()", Object.isExtensible(object3)); // false
console.log("Object.freeze()", Object.isExtensible(object2)); // false
console.log("Object.seal()", Object.isExtensible(object)); // false
```

-Object.isExtensible() 对应的判断对象的数据属性中的 [[Extensible]] 为 false。

所以想要通过判断对象被那个方法处理了，需要用这三个结合判断。如下：

```
// 假设 object3 已被某种方法处理
const isPrevented = !Object.isExtensible(object3) && !Object.isSealed(object3) && !Object.isFrozen(object3);
const isSealed = !Object.isExtensible(object3) && Object.isSealed(object3) && !Object.isFrozen(object3);
const isFrozen = !Object.isExtensible(object3) && Object.isSealed(object3) && Object.isFrozen(object3);

console.log('被 preventExtensions 处理:', isPrevented);
console.log('被 seal 处理:', isSealed);
console.log('被 freeze 处理:', isFrozen);
```

## 5. toRaw

![](https://cdn.nlark.com/yuque/0/2025/png/654315/1754330006417-d6b88f62-d1cd-4b69-99fa-012038f8ebbf.png)

toRaw() 可以返回由 reactive()、readonly()、shallowReactive() 或者 shallowReadonly() 创建的代理对应的原始对象。

在前面说到 shallowRef 部分已经提到了这个 API 的作用了，可以配合 ref 实现接近 shallowRef 的性能。

```
<template>
  <button @click="changeName">changeName</button>
  <button @click="changeRaw">changeRaw</button>
  <p>{{ data.name }}</p>
  <p>{{ data.age }}</p>
</template>
<script setup>
  const data = reactive({
  name: "张三",
  age: 18,
});
const raw = toRaw(data);
const changeName = () => {
  data.name = data.name === "李四" ? "张三" : "李四";
  data.age++;
};
const changeRaw = () => {
  raw.name = raw.name === "李四" ? "张三" : "李四";
  raw.age++;
};
</script>
```

`changeRaw`方法没有反应，视图不会更新，说明 raw 已经是原对象了，非响应式了。但是修改 raw 依旧会影响到 `data`这个响应式对象。

修改 toRaw()返回的对象，删除以及修改都会影响到原始的响应式对象。它们两个都是引向同一个内存地址，只是一个用 Proxy 进行了再加个，另外一个没有。

## 6. markRaw

它的效果和 `toRaw`有一定相似的。都是让某一个对象更改为非响应式的。但是 markRaw 可以直接用在依旧被定义过的响应式对象中，如下：

```
<template>
  <p>
    标记为非响应式的对象，不会触发视图更新,但是初始化的时候依旧会改变，点击
    changeMarked 按钮，就不会改变视图
  </p>
  <button @click="changeMarked">changeMarked</button>
  <p>{{ state.config.name }}</p>
</template>
<script setup>
const rawObject = { name: "静态数据" };
const markedObject = markRaw(rawObject); // 标记为非响应式

// 即使放入响应式对象中，markedObject 仍保持原始状态
const state = reactive({
  config: markedObject, // 不会被代理
});

state.config.name = "修改"; // ❌ 无效（非响应式，视图不更新）

const changeMarked = () => {
  state.config.name = state.config.name === "静态数据" ? "修改" : "静态数据";
};
</script>
```

我们初始化的时候依旧是“修改”，那是因为 vue3 收集依赖是在 `onMounted`生命周期之前。

```
setup() → 初始化响应式数据
  ↓
onBeforeMount() → 渲染前准备
  ↓
渲染 DOM → 访问响应式数据，触发依赖收集
  ↓
onMounted() → 组件挂载完成
```

- 依赖收集发生在 渲染 DOM 的过程中 ，介于 onBeforeMount 和 onMounted 之间
- 这就是为什么界面显示的是「修改」而非「静态数据」的关键

而当我使用 `setTimout`来包裹住 `state.config.name`的时候，初始化的指就是'静态数据'了。

## 7. effectScope

### 7.1. 基本使用

```
<template>
   <el-button @click="counter++">增加</el-button>
  <el-button @click="startEffects">启动</el-button>
  <el-button @click="stopEffect">停止</el-button>
  <el-button @click="runEffect">重新运行</el-button>
  <p>计算结果：{{ counter }} 计算结果：{{ doubled }}</p>
  <p>条件性启用和禁用作用域</p>
</template>
<script setup>
const counter = ref(0)
const doubled = computed(() => counter.value * 2)
const scope = effectScope()

const startEffects = () => {
  scope.run(() => {
    watch(doubled, () => console.log(doubled.value));
    watchEffect(() => console.log("Count: ", doubled.value));
  });
}
const stopEffect = () => {
  scope.stop()
}
const runEffect = () => {
  scope.run()
}
</script>
```

### 7.2. 业务使用场景：全局响应式变量

```
import { effectScope, type EffectScope } from 'vue'

// 创建全局状态的工厂函数
export const createGlobalState = <T>(stateFactory: () => T) => {
  // 用于存储全局作用域
  let global: T
  // 用于存储effect作用域
  let scope: EffectScope

  // 返回一个函数，该函数用于获取或创建全局状态
  return () => {
    // 如果全局状态已存在，直接返回
    if (global) return global

    // 如果全局状态不存在，创建一个新的effect作用域
    scope = effectScope(true)

    // 在作用域内运行状态工厂函数，创建全局状态
    global = scope.run(() => stateFactory())!

    return global
  }
}
```

使用的时候

```
import { createGlobalState } from '../../hooks/globalScope'
import { ref } from 'vue'
export const useGlobalCount = createGlobalState(() => {
  const count = ref<number>(222)
  const increment = () => count.value++
  return { count, increment }
})
```

在组件中使用，可以跨组件：

```
<template>
  <div class="container">
    <!-- 页面内容区域 -->
    <h2>{{ count }}</h2>
  </div>
</template>

<script setup>
import { useGlobalCount } from "./global-count";
const { count } = useGlobalCount();
</script>
```

`count`可以在多个组件中同时使用。这个也是 vueuse 中 createGlobalState 的实现原理。利用的就是 effectScope 可以控制副作用的清除和重启的方法。

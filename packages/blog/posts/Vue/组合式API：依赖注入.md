# 组合式 API：依赖注入

## 参考质量

[组合式 API：依赖注入](https://cn.vuejs.org/api/composition-api-dependency-injection.html)

### 基础使用

父级组件如下：

```js
<template>
	<button @click='addCount'>Add Count</button>
	<inject />
</template>
<script setup>
import { provide } from 'vue'
const count = ref(0)
provide('ProvideCount', count)
const addCount = () => {
	count.value++
}
</script>
```

自己组件中如下：

```js
<template>
	{{ count }}
</template>
<script setup>
import { inject } from 'vue'
const count = inject('ProvideCount')
</script>
```

只要是处于这个分支节点下的子节点，无论层级多么深，都可以通过通过绑定一样的`key`拿到传递下来的参数，这个参数可以是基础类系、而可以是引用类型、也就是说包括函数。

### 优化 key 值的绑定

key 值如果只是通过字符串来区分，是存在混淆的可能的，所以我们通过`contants.ts`的常量作为 key 值。

```js
// contans.ts
export const COUNT_SYMBOL = symbol("provide 组件中的 count 哦");
```

在`provide.vue` 中：

```js
<template>
	<button @click='addCount'>Add Count</button>
	<inject />
</template>
<script setup>
import { provide } from 'vue'
import { COUNT_SYMBOL } from './contants'
const count = ref(0)
provide(COUNT_SYMBOL, count)
const addCount = () => {
	count.value++
}
</script>
```

然后在`inject.vue` 中引入这个常量即可。

### 扩展使用

```js
<script setup>
import injectChild from './injectChild.vue'
</script>
<template>
  <provide>
	<template #test>
	  <injectChild />
	</template>
  </provide>
</template>
```

`provide.vue`:

```js
<script setup>
import injectChild from './injectChild.vue'
</script>
<template>
	<div>
	    <slot name="test" v-if="hasTestSlot()">
	      <h2>默认插槽</h2>
	    </slot>
  </div>
</template>
```

`injectChild.vue`

```js
<template>
  <h3>这个是插槽</h3>
  <p>{{ name }}</p>
  <p>{{ nickName }}</p>

  <el-button @click="changeAge">改变年龄</el-button>
</template>
<script setup>
import { inject } from "vue";
import { nameKey, handleChangeAge } from "./constans";
import { ElButton } from "element-plus";

const name = inject("name");
const nickName = inject(nameKey);

const changeAgeInject = inject(handleChangeAge);
const changeAge = () => {
  changeAgeInject(20);
};
</script>
```

<template>
  <h2>3.3 基本使用</h2>
  <p>toRaw() 方法可以将一个响应式对象转换为普通对象。</p>
  <p>
    toRaw() 可以返回由 reactive()、readonly()、shallowReactive() 或者
    shallowReadonly() 创建的代理对应的原始对象。
  </p>
  <button @click="changeName">changeName</button>
  <button @click="changeRaw">changeRaw</button>
  <p>reactive: {{ data.name }} {{ data.age }}</p>
  <p>raw: {{ raw.name }} {{ raw.age }}</p>
  <ul>
    <li>响应式对象打印的是 Proxy(Object) {foo: 42}</li>
    <li>普通对象打印的是 {foo: 42}</li>
  </ul>
  <p style="color: red">
    修改 toRaw()返回的对象，删除以及修改都会影响到原始的响应式对象。
  </p>
  <hr />
  <p>{{ data2.items.age }}</p>
  <button @click="changeData2">changeData2</button>
</template>
<script setup>
import { markRaw, reactive, toRaw, triggerRef } from "vue";

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
console.log({ data, raw });

const data2 = reactive({
  name: "张三",
  items: toRaw({
    age: 12,
  }),
});
const changeData2 = () => {
  data2.items.age++;
};
</script>

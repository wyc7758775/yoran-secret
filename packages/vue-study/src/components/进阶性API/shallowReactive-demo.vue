<template>
  <h2>3.1 基本使用</h2>
  <button @click="addShallowReactiveCount">addShallowReactiveCount</button>
  <button @click="addShallowReactiveCount2">addShallowReactiveCount2</button>
  <p>
    shallowReactive: {{ objShallow.count }}; 多层级 shallowReactive:
    {{ objShallow.obj.count }}
  </p>
  <button @click="addReactiveCount">addReactiveCount</button>
  <button @click="addReactiveCount2">addReactiveCount2</button>
  <p>
    reactive: {{ objReactive.count }}; 多层级 reactive:
    {{ objReactive.obj.count }};
  </p>
  <ul style="font-size: 20px">
    <li>
      和 shallowRef 一样，只能监听对象的属性变化，不能监听对象的属性值变化。
    </li>
    <li>所以使用场景和 shallowRef一致，都可以用于性能优化相关</li>
  </ul>
</template>
<script setup>
import { shallowReactive, reactive } from "vue";

const objShallow = shallowReactive({
  count: 0,
  obj: {
    count: 0,
  },
});
const objReactive = reactive({
  count: 0,
  obj: {
    count: 0,
  },
});
const addShallowReactiveCount = () => {
  objShallow.count++;
};
const addShallowReactiveCount2 = () => {
  objShallow.obj.count++;
};
const addReactiveCount = () => {
  objReactive.count++;
};
const addReactiveCount2 = () => {
  objReactive.obj.count++;
};
</script>

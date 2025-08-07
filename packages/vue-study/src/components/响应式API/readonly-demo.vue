<template>
  <h2>只读属性</h2>
  <p>{{ obj.count }}</p>
  <p>obj2: {{ obj2.count }}</p>
  <p>obj3: {{ obj3.count }}</p>
  <button @click="handleClick">点击</button>
</template>

<script setup lang="ts">
import { reactive, readonly } from "vue";
const obj = reactive({
  count: 0,
});
const obj2 = readonly(obj);
const obj3 = readonly({
  count: 30,
});

const handleClick = () => {
  obj.count++;
};
</script>

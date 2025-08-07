<template>
  <h2>基础使用</h2>
  <el-button @click="addCount">增加</el-button>
  <p>当前计数: {{ count }}</p>
</template>
<script setup>
import { ref, onUpdated, onBeforeUpdate, onErrorCaptured } from "vue";
import { ElButton } from "element-plus";

const count = ref(0);
const addCount = () => {
  count.value++;
  count++;
};

onUpdated(() => {
  console.log("每次添加 count 都触发了更新");
});
onBeforeUpdate(() => {
  count.value += 20;
  if (count.value > 60) return;
  console.log("每次添加 count 之前都触发了更新");
});
onErrorCaptured((error) => {
  console.log(" 这里有错误:", error);
});
</script>

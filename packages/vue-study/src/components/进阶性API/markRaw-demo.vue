<template>
  <div>
    <h2>6.1 基本使用</h2>
    <p>
      标记为非响应式的对象，不会触发视图更新,但是初始化的时候依旧会改变，点击
      changeMarked 按钮，就不会改变视图
    </p>
    <button @click="changeMarked">changeMarked</button>
    <p>{{ state.config.name }}</p>
  </div>
</template>
<script setup>
import { markRaw, reactive } from "vue";

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

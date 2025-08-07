<template>
  <div>
    <h2>7.1 基本用法</h2>
    <el-button @click="counter++">增加</el-button>
    <el-button @click="startEffects">启动</el-button>
    <el-button @click="stopEffect">停止</el-button>
    <el-button @click="runEffect">重新运行</el-button>
    <p>计算结果：{{ counter }} 计算结果：{{ doubled }}</p>
    <p>条件性启用和禁用作用域</p>
    <h2>7.2 嵌套作用域</h2>
  </div>
</template>
<script setup>
import { effectScope, computed, watch, watchEffect, ref } from "vue";
import { ElButton } from "element-plus";

const counter = ref(0);
const doubled = computed(() => counter.value * 2);
const scope = effectScope();

const startEffects = () => {
  scope.run(() => {
    watch(doubled, () => console.log(doubled.value));
    watchEffect(() => console.log("Count: ", doubled.value));
  });
};
const stopEffect = () => {
  scope.stop();
};
const runEffect = () => {
  scope.run();
};
</script>

<template>
  <h2>基本使用</h2>
  <p>count: {{ count }}</p>
  <p>watchCount: {{ watchCount }}</p>
  <button @click="handleWatchCount">watchCount++</button>
  <button @click="stop">stop</button>
  <button @click="pause">pause</button>
  <button @click="resume">resume</button>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";

const count = ref(0);

const watchCount = ref(0);
const { stop, pause, resume } = watchEffect(() => {
  watchCount.value = count.value * 10;
});
// 前端如何实现弱网检测
const handleWatchCount = () => {
  count.value++;
};
</script>

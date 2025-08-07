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

<style scoped>
.container {
  padding: 20px;
}
</style>

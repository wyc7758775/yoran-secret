<template>
  <div class="computed-demo">
    <h3>可写计算属性演示</h3>

    <!-- 原始值显示 -->
    <div>原始值: {{ count }}</div>

    <!-- 通过可写计算属性绑定的输入框 -->
    <div>
      <label for="scaledInput">放大10倍的值:</label>
      <input
        id="scaledInput"
        type="number"
        v-model="ableWrite"
        placeholder="输入数字"
      />
    </div>

    <!-- 按钮触发修改 -->
    <button @click="handleAbleWrite">设置为100 (原始值10)</button>

    <!-- 验证信息 -->
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";

// 原始响应式数据
const count = ref(5);
// 错误信息
const errorMessage = ref("");

// 可写计算属性
const ableWrite = computed({
  get() {
    // 读取时: 原始值 * 10
    return count.value * 10;
  },
  set(newValue) {
    // 验证输入是否为有效数字
    if (
      newValue === null ||
      newValue === undefined ||
      isNaN(Number(newValue))
    ) {
      errorMessage.value = "请输入有效的数字!";
      return;
    }

    // 验证通过，清除错误信息
    errorMessage.value = "";

    // 写入时: 新值同步到原始数据
    count.value = Number(newValue);
  },
});

// 按钮点击处理函数
function handleAbleWrite() {
  // 直接修改可写计算属性
  ableWrite.value = 100;
}
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>

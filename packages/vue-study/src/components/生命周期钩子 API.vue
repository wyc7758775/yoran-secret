<script setup>
import { ElButton } from 'element-plus'
import { onBeforeUpdate, onErrorCaptured, onUpdated, ref } from 'vue'

const count = ref(0)
function addCount() {
  count.value++
}

onUpdated(() => {
  console.log('每次添加 count 都触发了更新')
})
onBeforeUpdate(() => {
  count.value += 20
  if (count.value > 60)
    return
  console.log('每次添加 count 之前都触发了更新')
})
onErrorCaptured((error) => {
  console.log(' 这里有错误:', error)
})
</script>

<template>
  <h2>基础使用</h2>
  <ElButton @click="addCount">
    增加
  </ElButton>
  <p>当前计数: {{ count }}</p>
</template>

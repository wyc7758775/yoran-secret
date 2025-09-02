<script setup>
import { computed, onMounted, ref, Teleport, watchEffect } from 'vue'

const hasTargetElement = ref(false)

onMounted(() => {
  hasTargetElement.value = !!document.querySelector('#body')
})

const targetElement = ref(null)
// 检查目标元素的辅助函数
function checkTargetElement() {
  const element = document.querySelector('#body')
  targetElement.value = element
}
watchEffect(() => {
  // setTimeout 可以换成 MutationObserver 监听目标元素的变化或者 inject ，等等
  const timer = setTimeout(() => {
    checkTargetElement()
  }, 100)
  return () => {
    clearTimeout(timer)
  }
})

const showTeleport = computed(() => {
  return !!targetElement.value
})
</script>

<template>
  <div>
    <h2>teleport 组件</h2>
    <!-- <Teleport to="#body" v-if="hasTargetElement">
      <div>teleport 组件</div>
    </Teleport> -->
    <Teleport v-if="showTeleport" to="#body">
      <div>使用 Computed 控制渲染</div>
    </Teleport>
  </div>
</template>

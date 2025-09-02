<script setup>
import { ElButton, ElInput } from 'element-plus'
import { ref } from 'vue'
import VModalInputDemo from './VModal-input-demo.vue'

const inputValue = ref('')

const curState = ref(' 默认 ')
function handleClick() {
  curState.value = '父级点击了按钮'
}
function GaoJi(value) {
  curState.value = value
}

/**
 * 双向绑定原理
 */
const inputValue2 = ref('')
function addEventInput(el) {
  inputValue2.value = el
}
</script>

<template>
  <p>
    <span>v-model的使用：</span>
    <ElInput v-model="inputValue" />
  </p>
  <!-- el-input双向绑定的本质 -->
  <p>
    <span>el-input的双向绑定的本质：</span>
    <ElInput :model-value="inputValue2" @input="addEventInput" />
  </p>
  <!-- 子组件的点击事件，会触发父组件的事件 -->
  <p>父级的双向绑定的值：{{ curState }}</p>
  <VModalInputDemo :model-value="curState" @笑嘻嘻="GaoJi" />
  <ElButton @click="handleClick">
    父级的点击按钮
  </ElButton>
</template>

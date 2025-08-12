<template>
  <p>
    <span>v-model的使用：</span>
    <el-input v-model="inputValue"></el-input>
  </p>
  <!-- el-input双向绑定的本质 -->
  <p>
    <span>el-input的双向绑定的本质：</span>
    <el-input v-bind:modelValue="inputValue2" @input="addEventInput"></el-input>
  </p>
  <!-- 子组件的点击事件，会触发父组件的事件 -->
  <p>父级的双向绑定的值：{{ curState }}</p>
  <VModalInputDemo :modelValue="curState" @笑嘻嘻="GaoJi"></VModalInputDemo>
  <el-button @click="handleClick"> 父级的点击按钮</el-button>
</template>
<script setup>
import { ref } from "vue";
import { ElInput, ElButton } from "element-plus";
import VModalInputDemo from "./VModal-input-demo.vue";
const inputValue = ref("");

const curState = ref(" 默认 ");
const handleClick = () => {
  curState.value = "父级点击了按钮";
};
const GaoJi = (value) => {
  curState.value = value;
};

/**
 * 双向绑定原理
 */
const inputValue2 = ref("");
const addEventInput = (el) => {
  inputValue2.value = el;
};
</script>

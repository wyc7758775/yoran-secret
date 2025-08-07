<template>
  <div>子级的双向绑定 的值：{{ modelValue }}</div>
  <el-button @click="handleClick"> 子级的按钮</el-button>
</template>
<script setup>
import { ElButton } from "element-plus";
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["你麻痹"]);
const handleClick = () => {
  emit("你麻痹", "子级点击了按钮");
};
</script>

<template>
  <div>
    <p v-once>v-once 指令</p>
    <p>英:/wʌns 一次</p>
    <button @click.left="changeMsg">点击改变 msg</button>
    <p>msg： {{ msg }}</p>
    <p v-once>v-once msg： {{ msg }}</p>
  </div>
</template>
<script setup>
import { ref } from "vue";
const msg = ref("hello world");
const changeMsg = () => {
  msg.value = "hello vue";
};
</script>

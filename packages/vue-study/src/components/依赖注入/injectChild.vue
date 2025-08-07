<template>
  <h3>这个是插槽</h3>
  <p>{{ name }}</p>
  <p>{{ nickName }}</p>

  <el-button @click="changeAge">改变年龄</el-button>
</template>
<script setup>
import { inject } from "vue";
import { nameKey, handleChangeAge } from "./constans";
import { ElButton } from "element-plus";

const name = inject("name");
const nickName = inject(nameKey);

const changeAgeInject = inject(handleChangeAge);
const changeAge = () => {
  changeAgeInject(20);
};
</script>

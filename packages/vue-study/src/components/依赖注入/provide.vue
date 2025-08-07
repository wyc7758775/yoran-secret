<template>
  <h2>基本使用</h2>
  <el-button @click="changeNickName"> 改变昵称</el-button>
  <el-button @click="changeName"> 改变姓名</el-button>
  <p>依字符串作为 key 和 symbol 作为 key 都可以注入</p>
  <p>年龄：{{ age }}</p>
  <inject />
  <div>
    <slot name="test" v-if="hasTestSlot()">
      <h2>默认插槽</h2>
    </slot>
  </div>
</template>
<script setup>
import { provide, ref, useSlots } from "vue";
import { ElButton } from "element-plus";
import inject from "./inject.vue";
import { nameKey, handleChangeAge } from "./constans";

const name = ref(" 张三");
const nickName = ref("及时雨");

provide("name", name);
provide(nameKey, nickName);

const changeNickName = () => {
  nickName.value = nickName.value === " 及时雨" ? " 豹子头" : " 及时雨";
};
const changeName = () => {
  name.value = name.value === " 张三" ? " 李四" : " 张三";
};

const hasTestSlot = () => {
  const slots = useSlots();
  return slots.test !== undefined;
};

const age = ref(12);
const changeAge = (value) => {
  age.value = value ? age.value + value : age.value;
};

provide(handleChangeAge, changeAge);
</script>

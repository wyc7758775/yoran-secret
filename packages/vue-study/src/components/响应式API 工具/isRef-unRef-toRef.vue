<template>
  <h2>基础使用</h2>
  <h3>isRef 和 unref</h3>
  <p>isRef 防御性编程的作用</p>
  <div v-html="text" style="white-space: pre-wrap"></div>
  <p>上面两者是相等</p>
  <h3>toRef</h3>
  <p>toRef 可以将一个响应式对象的属性转换为 ref</p>
  <p>orToRef： {{ orToRef }}</p>
  <p>countOrVal： {{ countOrVal }}</p>
  <button @click="addOrToRef">orToRef 点击</button>
  <button @click="addCountOrVal">countOrVal 点击</button>

  <p>objRef： {{ objRef }}</p>
  <button @click="addObjRef">objRef 点击</button>
</template>
<script setup>
import { isRef, unref, toRef, ref, getCurrentInstance } from "vue";

console.log("----------- isRef/unRef/toRef 分割线-----------");

/**
 * isRef 和 unRef
 */
const countRef = ref(0);
let countOrVal = 10;

console.log(isRef(countRef)); // true
console.log(isRef(countOrVal)); // false

const count1 = unref(countRef);
const count2 = isRef(countRef) ? countRef.value : countRef;
// unref 等价于后面的判断
const text = `
const count1 = unref(countRef);
const count2 = isRef(countRef) ? countRef.value : countRef;
`;

/**
 * toRef 可以将一个响应式对象的属性转换为 ref
 */
const orToRef = toRef(countOrVal);

console.log({ count1, count2, countRef, orToRef });

const addOrToRef = () => {
  orToRef.value++;
};

const instance = getCurrentInstance();

const addCountOrVal = () => {
  countOrVal++;
  instance?.proxy?.$forceUpdate();
};

const obj = {
  nameNick: "张三",
  age: 18,
};
const objRef = toRef(obj);
const addObjRef = () => {
  objRef.value.nameNick = "李四";
  objRef.value.age = 20;
};
</script>

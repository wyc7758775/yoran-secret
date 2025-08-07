<template>
  <h2>基础使用</h2>
  <h3>isValue</h3>
  <h3>toRefs</h3>
  <p>isValue 可以判断一个值是否是 ref 类型</p>
  <p>{{ nameNick }} {{ age }}</p>
  <button @click="handleObjRefs">修改objRefs</button>
  <p>{{ nameNickReactive }} {{ ageReactive }}</p>
  <button @click="handleObjReactive">修改objReactive</button>
  <p>{{ color }} {{ isGo }}</p>
  <button @click="handlePropsRefs">修改propsRefs</button>
  <p>{{ reactiveNameNick }} {{ reactiveAge }}</p>
  <button @click="handleReactiveData">修改reactiveData</button>
  <p>toRefs(ref): {{ dataToRefs.nameNick }} {{ dataToRefs.age }}</p>
  <button @click="handleDataToRefs">修改dataToRefs</button>
</template>
<script setup>
import { toValue, toRefs, reactive, ref } from "vue";

const props = defineProps({
  color: {
    type: String,
    default: "red",
  },
  isGo: {
    type: Boolean,
    default: false,
  },
});

const obj = {
  nameNick: "张三",
  age: 18,
};

const { nameNick, age } = toRefs(obj);

const handleObjRefs = () => {
  nameNick.value = "李四";
  age.value = 20;
};

const objReactive = reactive(obj);

const { nameNick: nameNickReactive, age: ageReactive } = toRefs(objReactive);
const handleObjReactive = () => {
  nameNickReactive.value = "王五";
  ageReactive.value = 22;
};

const { color, isGo } = toRefs(props);

const handlePropsRefs = () => {
  color.value = "blue";
  isGo.value = true;
};

const reactiveData = reactive({
  nameNick: "张三",
  age: 18,
});

const { nameNick: reactiveNameNick, age: reactiveAge } = toRefs(reactiveData);

const handleReactiveData = () => {
  reactiveNameNick.value = "李四";
  reactiveAge.value = 20;
};

/**
 * toRefs(ref)
 */
const dataRef = ref({
  nameNick: "张三",
  age: 18,
});
const dataToRefs = toRefs(dataRef);

const handleDataToRefs = () => {
  console.log({ dataToRefs: dataToRefs.value });
  dataToRefs.value.nameNick.value = "李四";
  dataToRefs.value.age.value = 20;
};
</script>

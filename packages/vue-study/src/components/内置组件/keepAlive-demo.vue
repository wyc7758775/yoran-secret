<template>
  <div>
    <h2>keepAlive 组件演示</h2>
    <button @click="switchComponent">切换组件</button>
    <button @click="clearCache">清除缓存</button>
    <keep-alive>
      <component :is="currentComponent" :key="currentComponentKey" />
    </keep-alive>
    <p>当前组件: {{ currentComponent.name }}</p>
    <p>组件键值: {{ currentComponentKey }}</p>
    <p>点击次数: {{ clickCount }}</p>
  </div>
</template>
<script setup>
import { ref } from "vue";

// 定义两个组件
const Component1 = {
  name: "Component1",
  template: `<div style="background: red; padding: 20px;"><h1>组件1</h1></div>`,
};

const Component2 = {
  name: "Component2",
  template: `<div style="background: blue; padding: 20px;"><h1>组件2</h1></div>`,
};

// 定义响应式变量
const currentComponent = ref(Component1);
const currentComponentKey = ref("component1");
const clickCount = ref(0);

console.log("初始组件:", currentComponent.value.name);

// 切换组件方法
const switchComponent = () => {
  clickCount.value++;
  console.log("切换前组件:", currentComponent.value.name);

  if (currentComponent.value === Component1) {
    currentComponent.value = Component2;
    currentComponentKey.value = "component2";
  } else {
    currentComponent.value = Component1;
    currentComponentKey.value = "component1";
  }

  console.log("切换后组件:", currentComponent.value.name);
  console.log("当前键值:", currentComponentKey.value);
};

// 清除缓存方法
const clearCache = () => {
  console.log("清除缓存");
  // 通过改变 key 来强制重新渲染组件
  currentComponentKey.value =
    currentComponentKey.value + "-cleared-" + Date.now();
};
</script>

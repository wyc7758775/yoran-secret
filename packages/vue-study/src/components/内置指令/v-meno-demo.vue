<template>
  <div>
    <p>v-mono 指令：只渲染一次</p>
    <p>v-memo 的优化原理 v-memo 的核心价值在于 跳过不必要的虚拟 DOM 对比 ：</p>
    <p>
      当使用 v-memo 指令时，Vue 会根据指令的依赖数组来判断是否需要对比虚拟 DOM。
      如果依赖数组中的值没有发生变化，Vue 会直接跳过对比，从而避免不必要的 DOM
      操作。
    </p>
    <button @click="updateItem">更新数据</button>
    <ul>
      <li
        v-for="(item, index) in list"
        :key="item.id"
        v-memo="[index === 0 && item.name === '马总']"
      >
        <span>id:</span>{{ item.id }} ----<span>nickname:</span>{{ item.name }}
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref } from "vue";
const getData = () => {
  // 返回一个 1000 数组对象，id和 name 要随机
  return Array.from({ length: 1000 }, () => ({
    id: Math.floor(Math.random() * 100000),
    name: generateRandomChineseName(),
  }));

  // 生成随机中文名的函数
  function generateRandomChineseName() {
    const firstNames = [
      "赵",
      "钱",
      "孙",
      "李",
      "周",
      "吴",
      "郑",
      "王",
      "冯",
      "陈",
    ];
    const lastNames = [
      "伟",
      "芳",
      "娜",
      "敏",
      "静",
      "强",
      "磊",
      "军",
      "洋",
      "勇",
    ];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return firstName + lastName;
  }
};
const list = ref(getData());
list.value.unshift({
  id: 1,
  name: "马总",
});

let index = 0;
const updateItem = () => {
  console.time("update");
  // 测试1: 修改一个name不是'郑娜'的项
  list.value[index].name = "测试修改";
  index++;
  // 测试2: 修改一个name是'郑娜'的项（如果存在）
  // 找到第一个name为'郑娜'的项并修改
  // const zhengNaItem = list.value.find((item) => item.name === "郑娜");
  // if (zhengNaItem) zhengNaItem.name = "郑娜已修改";
  // console.timeEnd("update");
};
</script>

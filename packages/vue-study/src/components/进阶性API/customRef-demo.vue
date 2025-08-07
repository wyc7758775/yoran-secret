<template>
  <h2>2.1 基本使用</h2>
  <button @click="addTestCount">testCount++</button>
  <p>testCount: {{ testCount }}</p>
  <ul>
    customRef 中的 track()在做什么？什么叫做收集依赖？是为了确认这个 customRef
    的返回值在 html上面那个具体的 dom节点上面吗?
    <li>asd</li>
    <li>asdsa</li>
  </ul>
  <h2>2.2 使用场景</h2>
  <h3>2.2.1 防抖</h3>
  <button @click="addCount">count++</button>
  <p>count: {{ count }}</p>
  <p>
    相比使用 watch来说，使用
    customRef来实现防抖是更加原子化的一种操作，更加的内聚逻辑
  </p>
  <h3>2.2.2 验证</h3>
  <input v-model="emailValue" />
  <p style="color: red">{{ errorText }}</p>
  <h3>2.2.3 数据持久化​</h3>
  <button @click="changeTheme">切换主题色</button>
  <p>当前主题色：{{ valueLocal }}</p>
  <h3>2.2.4 数据缓存</h3>
</template>
<script setup>
import { customRef, ref } from "vue";

const testCount = customRef((track, trigger) => {
  let value = 0; // 值的初始化
  return {
    get() {
      track();
      return value;
    },
    set(newValue) {
      value = newValue;
      trigger();
    },
  };
});
const addTestCount = () => {
  testCount.value++;
};

//  2.2.1 防抖
const useDebouncedRef = (value, delay = 200) => {
  let timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
};
const count = useDebouncedRef(0);
const addCount = () => {
  count.value++;
};

//  2.2.2 验证
const errorText = ref("");
const emailValue = customRef((track, trigger) => {
  let value = "";
  return {
    get() {
      track();
      return value;
    },
    set(newValue, oldValue) {
      value = newValue;
      if (newValue.trim() === "") {
        errorText.value = "请输入邮箱";
        return;
      }
      if (newValue.includes("66")) {
        errorText.value = "你够 6";
        trigger();
        return;
      }
      errorText.value = "";
      trigger();
    },
  };
});

// 2.2.3 数据持久化
const valueLocal = customRef((track, grigger) => {
  return {
    get() {
      track();
      return localStorage.getItem("valueLocal") || "light";
    },
    set(newValue) {
      localStorage.setItem("valueLocal", newValue);
      grigger();
    },
  };
});
const changeTheme = () => {
  valueLocal.value = valueLocal.value === "dark" ? "light" : "dark";
};
</script>

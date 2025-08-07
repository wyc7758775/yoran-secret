<template>
  <h2>8.1 基本使用</h2>
  <p>{{ count }}</p>
  <h3>{{ state }}</h3>
  <button @click="addCount">addCount</button>
  <button @click="addState">addState</button>
</template>
<script setup lang="ts">
import { ref, Ref, customRef } from "vue";

const useRef = <T>(value: T): [Ref<T>, (value: T) => void] => {
  const state = ref<T>(value);
  const setState = (value: T) => {
    state.value = value;
  };
  return [state as Ref<T>, setState];
};

const [count, setCount] = useRef<number>(0);

const addCount = () => {
  const newCount = count.value + 1;
  setCount(newCount);
};
const state = customRef((track, trigger) => {
  let value = 0;
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
const addState = () => {
  state.value++;
};
</script>

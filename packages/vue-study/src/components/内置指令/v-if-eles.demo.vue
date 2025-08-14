<template>
  <div>
    <p v-if="isShow">v-if 指令</p>
    <p v-else>v-else 指令</p>
    <p v-show="!isShow" style="padding-bottom: 100px">v-show 指令</p>
    <p>和前面有100px距离吗？</p>

    <!-- 对应的原生实现 -->
    <p style="display: none; margin-bottom: 100px">v-show 指令</p>
    <p>和前面有100px距离吗？</p>
    <p style="visibility: hidden; margin-bottom: 100px">v-if 指令</p>
    <p>和前面有100px距离吗？</p>

    <!-- 总结 -->
    <p>总结：</p>
    <ul>
      <li>
        v-if 指令：当表达式为 true 时，才会渲染元素；当表达式为 false
        时，会销毁元素。
      </li>
      <li>
        v-show 指令：当表达式为 true 时，会渲染元素；当表达式为 false
        时，会将元素的 display 属性设置为 none。
      </li>
      <li>
        display: none 和 visibility: hidden 最大的不同就是：display: none
        会使元素完全不可见，而 visibility: hidden
        只会使元素不可见，但是元素的位置仍然会占用。
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref } from "vue";
const isShow = ref(true);
</script>

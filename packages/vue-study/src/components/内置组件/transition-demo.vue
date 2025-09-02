<script setup>
import { ElButton } from 'element-plus'
import { ref, Transition, TransitionGroup } from 'vue'

/**
 * transitionGroup 组件
 */
const list = ref([1, 2, 3, 4, 5])
function add() {
  list.value.push(list.value.length + 1)
}
function remove() {
  list.value.pop()
}

/**
 * transition 组件
 */
const show = ref(true)
function beforeLeave(el) {
  el.style.color = 'red'
  console.log('beforeLeave')
}
function afterLeave(el) {
  el.style.color = 'black'
  console.log('afterLeave')
}
function afterEnter(el) {
  el.style.color = 'black'
  console.log('afterEnter')
}

function beforeEnter(el) {
  el.style.color = 'red'
  console.log('beforeEnter')
}
</script>

<template>
  <div>
    <h2>transition 组件</h2>
    <ElButton @click="show = !show">
      切换
    </ElButton>
    <Transition
      name="fade"
      @before-enter="beforeEnter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @after-leave="afterLeave"
    >
      <div v-if="show">
        <h2>hello world</h2>
      </div>
    </Transition>
    <h2>transitionGroup 组件</h2>
    <ElButton @click="add">
      添加
    </ElButton>
    <ElButton @click="remove">
      删除
    </ElButton>
    <TransitionGroup name="fadeTransform">
      <div v-for="item in list" :key="item">
        {{ item }}
      </div>
    </TransitionGroup>

    <Transition name="fadeTransform">
      <div>
        <div v-for="item in list" :key="item">
          {{ item }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
/* 进入阶段：从隐藏到显示 */
.fade-enter-from {
  opacity: 0;
} /* 初始状态 */
.fade-enter-to {
  opacity: 1;
} /* 目标状态 */
.fade-enter-active {
  transition: opacity 1s;
} /* 过渡动画 */

/* 离开阶段：从显示到隐藏 */
.fade-leave-from {
  opacity: 1;
} /* 初始状态 */
.fade-leave-to {
  opacity: 0;
} /* 目标状态 */
.fade-leave-active {
  transition: opacity 0.3s;
}

.fadeTransform-enter-from,
.fadeTransform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.fadeTransform-enter-active,
.fadeTransform-leave-active {
  transition: all 0.3s ease;
}
</style>

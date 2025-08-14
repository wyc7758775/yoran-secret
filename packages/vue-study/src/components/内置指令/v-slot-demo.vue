<template>
  <div>
    <h1>v-slot 插槽的使用</h1>
    <div>
      <h2>1. 默认插槽</h2>
      <p>默认插槽的内容会被渲染到插槽的位置</p>
      <SlotChild>
        <template #default>
          <div>
            <h3>1.1 带 template 默认插槽的内容1</h3>
          </div>
        </template>
      </SlotChild>
      <SlotChild>
        <div>
          <h3>1.2 不带 template 默认插槽的内容2</h3>
        </div>
      </SlotChild>
    </div>
    <div>
      <h2>2. 具名插槽</h2>
      <p>具名插槽的内容会被渲染到插槽的位置</p>
      <SlotChild>
        <template v-slot:header>
          <div>
            <h3>2.1 带 template 具名插槽的内容1</h3>
          </div>
        </template>
      </SlotChild>
    </div>
    <div>
      <h2>3. 动态插槽名</h2>
      <p>动态插槽名的内容会被渲染到插槽的位置</p>
      <SlotChild>
        <template v-slot:[dynamicSlotName]>
          <div>
            <h3>3.1 笑死传进来的内容</h3>
          </div>
        </template>
      </SlotChild>
    </div>
    <div>
      <h2>4. 作用域插槽</h2>
      <p>4.1 插槽的默认内容会在插槽没有内容时被渲染</p>
      <SlotChild v-slot="{ data }">
        <p>{{ data.nickName }}</p>
        <p>{{ data.age }}</p>
      </SlotChild>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import SlotChild from "./v-slot-child-demo.vue";

const dynamicSlotName = ref("笑死");
const dynamicSlotName2 = ref("作用域插槽");
</script>

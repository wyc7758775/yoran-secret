<template>
  <div>
    slot-child 默认插槽
    <slot :data="data"></slot>
  </div>
  <div>
    <p v-if="$slots.header">header 插槽</p>
    <slot name="header"> header 内容不会删除吧 </slot>
  </div>
  <div>
    <p v-if="$slots.笑死">笑死的 slot</p>
    <slot name="笑死"></slot>
  </div>
</template>
<script setup>
import { ref, useSlots } from "vue";
const age = ref(18);
const data = ref({
  nickName: "yoran",
  age: 18,
});

const slots = useSlots();
const hasHeaderSlot = slots.header;
</script>

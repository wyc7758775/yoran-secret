<template>
  <div>
    <p>v-text 指令：{{ message }}</p>
    <p v-text="message" />
  </div>
  <div v-pre>
    <h2>原始 HTML：{{ message }}</h2>
    <div>
      {{ message }}
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const message = ref("<h2>hello world</h2>");
</script>

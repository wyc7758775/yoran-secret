<template>
  <p>字符串作为 key: {{ name }}</p>
  <p>symbol 作为 key: {{ symbolName }}</p>
</template>
<script setup>
import { inject } from "vue";
import { nameKey, handleChangeAge } from "./constans";
import { ref } from "vue";

const name = inject("name");
const symbolName = inject(nameKey);
</script>

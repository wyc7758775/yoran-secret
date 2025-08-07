<template>
  <h1>
    结果：{{ result  }}
  </h1>
  <div>
    {{ title  }}
    {{  attrs }}
    <el-button v-bind="attrs" >点击</el-button>
  </div>
</template>
<script setup lang="ts">
import { ElButton } from 'element-plus'
import { useAttrs, onUnmounted, ref } from "vue"

defineProps({
  title: {
    type: String,
    default: '404'
  }
})
const attrs = useAttrs()
const result = ref<number>(1);
const worker = new Worker('./web-worker-test.js')

worker.onmessage = (e) => {
    result.value = e.data;
    worker.terminate(); // 计算完成后立即销毁
  };

worker.postMessage({ limit: 1e7 }); // 传递参数
onUnmounted(() => {
  if (worker) worker.terminate(); // 组件销毁时清理
});

</script>
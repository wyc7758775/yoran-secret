<template>
  <div class="p-5 max-w-7xl mx-auto">
    <div
      class="fixed cursor-pointer w-10 h-10 rounded-full bg-black/20 dark:bg-white/20 flex items-center justify-center shadow-lg bottom-4 right-4 md:top-auto md:left-auto md:bottom-auto md:right-auto md:w-6 md:h-6 md:shadow-none"
      @click="close"
    >
      <ElIcon>
        <ArrowLeft />
      </ElIcon>
    </div>
    <div class="container mx-auto mt-6 px-4 sm:px-6 lg:px-8">
      <div
        v-loading="loading"
        class="prose max-w-none prose-sm sm:prose base:text-sm sm:text-base md:text-lg leading-relaxed rendered-content rendered-body"
        v-html="renderedContent"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";

// 修改这行导入语句，添加.ts扩展名
import useMdRender from "./use-md-render.ts";
import { defineProps, defineEmits } from "vue";
import { ArrowLeft } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};

const { mdRender } = useMdRender();

const getFileInfo = (src: string) => {
  const pathParts = src.split("/");
  const fileName = pathParts[pathParts.length - 1];
  const baseName = fileName.replace(".md", "");

  return {
    fileName,
    baseName,
  };
};

const getFileKey = (markdownFiles: any) => {
  const { fileName, baseName } = getFileInfo(props.src);
  let fileKey = Object.keys(markdownFiles).find((key) => {
    return key.includes(baseName) || key.includes(fileName);
  });

  // 如果找不到完全匹配的，尝试部分匹配
  if (!fileKey) {
    fileKey = Object.keys(markdownFiles).find((key) =>
      key.toLowerCase().includes(baseName.toLowerCase())
    );
  }

  console.log(`找到文件: ${fileKey}`);

  return fileKey;
};

const renderedContent = ref("");
const loading = ref(true);
// 解析和渲染Markdown文件
const loadAndRenderMarkdown = async () => {
  if (!props.src) {
    renderedContent.value = "<p>未提供文章路径</p>";
    loading.value = false;
    return;
  }

  try {
    loading.value = true;

    const { fileName } = getFileInfo(props.src);

    console.log(`尝试加载文章: ${fileName}`);

    const markdownFiles = (import.meta as any).glob("../life/*.md", {
      as: "raw",
    });
    const fileKey = getFileKey(markdownFiles);

    console.log(`找到文件: ${fileKey}`);

    if (fileKey) {
      const markdownContent = await markdownFiles[fileKey]();
      renderedContent.value = mdRender(markdownContent);
    } else {
      console.error(`未找到文件: ${fileName}`);
      renderedContent.value = `<p>未找到对应的文章内容: ${fileName}</p>`;
    }
  } catch (error) {
    console.error("加载Markdown文件失败:", error);
    renderedContent.value = `<p>加载文章内容失败: ${error.message}</p>`;
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.src,
  (newSrc) => {
    if (newSrc) {
      loadAndRenderMarkdown();
    }
  }
);
</script>
<style scoped>
.rendered-content {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.rendered-body {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 45px 30px 30px;
}
@media (max-width: 768px) {
  .rendered-body {
    padding: 10px 10px 15px; /* 减少移动端的内边距 */
  }
}
/* 增加更小屏幕的适配 */
@media (max-width: 480px) {
  .rendered-body {
    padding: 0.5rem;
  }
  .p-5 {
    padding: 0 !important;
  }
  .container {
    padding: 0 !important;
  }
}
</style>

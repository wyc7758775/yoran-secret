<template>
  <div class="p-5 max-w-7xl mx-auto">
    <div class="flex justify-start">
      <div
        class="fixed cursor-pointer w-6 h-6 rounded-full bg-black/20 dark:bg-white/20 flex items-center justify-center"
        @click="close"
      >
        <ElIcon>
          <ArrowLeft />
        </ElIcon>
      </div>
    </div>
    <div class="container mx-auto mt-6 px-4 sm:px-6 lg:px-8">
      <div
        class="prose max-w-none prose-sm sm:prose base:text-sm sm:text-base md:text-lg leading-relaxed"
        v-html="renderedContent"
      ></div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { marked } from "marked";
import { defineProps, defineEmits } from "vue";
import { ArrowLeft } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";

// 定义props，接收Markdown文件路径
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const title = ref("");
const renderedContent = ref("");
const loading = ref(true);

const close = () => {
  emit("close");
};

// 配置marked库，使其支持GFM（GitHub Flavored Markdown）
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false,
  sanitize: false,
  smartLists: true,
  smartypants: true,
  xhtml: false,
});

// 解析和渲染Markdown文件
const loadAndRenderMarkdown = async () => {
  if (!props.src) {
    renderedContent.value = "<p>未提供文章路径</p>";
    title.value = "文章不存在";
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    // 解析props.src中的路径，获取文件名（例如从'/life/Vim 编辑补充使用.md'中提取'Vim 编辑补充使用.md'）
    const pathParts = props.src.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const baseName = fileName.replace(".md", "");

    console.log(`尝试加载文章: ${fileName}`);

    // 动态导入Markdown文件
    // 使用相对路径导入文件，注意这里的路径需要根据实际项目结构调整
    const filePath = `/Users/wuyucun/programmer/font-end/packages/blog/life/${fileName}`;

    // 在Vite中，我们可以使用import.meta.globEager来静态导入所有Markdown文件
    // 或者使用动态导入
    const markdownFiles = import.meta.glob("../life/*.md", { as: "raw" });

    console.log("markdownFiles", markdownFiles, filePath);
    // 查找匹配的文件路径
    let fileKey = Object.keys(markdownFiles).find((key) => {
      console.log({ key });
      return key.includes(baseName) || key.includes(fileName);
    });

    // 如果找不到完全匹配的，尝试部分匹配
    if (!fileKey) {
      fileKey = Object.keys(markdownFiles).find((key) =>
        key.toLowerCase().includes(baseName.toLowerCase())
      );
    }

    console.log(`找到文件: ${fileKey}`);

    if (fileKey) {
      // 加载Markdown文件内容
      const markdownContent = await markdownFiles[fileKey]();

      // 渲染Markdown为HTML
      renderedContent.value = marked(markdownContent);

      // 提取标题（从Markdown中的第一个h1标签）
      const titleMatch = markdownContent.match(/^# (.*)/m);
      if (titleMatch) {
        title.value = titleMatch[1];
      } else {
        // 如果没有h1标签，使用文件名作为标题
        title.value = baseName;
      }
    } else {
      console.error(`未找到文件: ${fileName}`);
      renderedContent.value = `<p>未找到对应的文章内容: ${fileName}</p>`;
      title.value = "文章不存在";
    }
  } catch (error) {
    console.error("加载Markdown文件失败:", error);
    renderedContent.value = `<p>加载文章内容失败: ${error.message}</p>`;
    title.value = "加载失败";
  } finally {
    loading.value = false;
  }
};

// 监听props.src变化，重新加载和渲染Markdown
watch(
  () => props.src,
  (newSrc) => {
    if (newSrc) {
      loadAndRenderMarkdown();
    }
  },
  { immediate: true }
);

onMounted(() => {
  // 组件挂载时加载Markdown文件（如果watch的immediate为true，则这里可以省略）
});
</script>

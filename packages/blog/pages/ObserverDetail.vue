<template>
  <div class="max-w-7xl mx-auto">
    <div
      class="flex flex-col md:flex-row justify-center items-start mx-auto mt-6 sm:px-6 lg:px-8 w-full"
    >
      <div
        class="min-h-[60vh] flex justify-center items-center w-full"
        v-if="contentLoading"
      >
        <el-icon class="rotate-icon" size="36"><Loading /></el-icon>
      </div>
      <div
        v-else
        @mouseleave="handleMouseLeave"
        @mouseenter="handleMouseEnter"
        class="md-prose max-w-none prose-sm sm:prose base:text-sm sm:text-base md:text-lg w-full md:w-7/10 prose-img:center"
        v-html="renderedContent"
      ></div>
    </div>
  </div>
  <BackToTop />
  <TocSidebar :isVisibleToc="isVisibleToc" :content="renderedContent" />
  <el-image-viewer
    v-if="visibleViewer"
    :url-list="viewerList"
    @close="visibleViewer = false"
  />
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { Loading } from "@element-plus/icons-vue";
import { ElIcon, ElImageViewer } from "element-plus";
import { useData } from "vitepress";
import useMdRender from "./use-md-render.ts";
import BackToTop from "./components/BackToTop.vue";
import { useNavToStatic } from "./hooks/use-nav-to-static.ts";
import TocSidebar from "./components/TocSidebar.vue";

useNavToStatic();
const { page } = useData();

// 使用ref存储路径信息，默认值从page.params获取
const pathFromUrl = ref(page.value?.params?.src || "");

const visibleViewer = ref(false);
const viewerList = ref<string[]>([]);

const isVisibleToc = ref(false);
const handleMouseLeave = () => {
  isVisibleToc.value = false;
};
const handleMouseEnter = () => {
  isVisibleToc.value = true;
};

// 获取路由器上面的链接，由于是通过中文来获取的，所以需要下面一下特殊的处理
const getPathFromUrl = () => {
  try {
    if (typeof window !== "undefined") {
      const fullPath = window.location.pathname;
      const basePath = "/yoran-secret"; // 从vitepress配置中获取的base路径
      let pathWithoutBase = fullPath;

      if (fullPath.startsWith(basePath)) {
        pathWithoutBase = fullPath.substring(basePath.length);
      }
      const pathParts = pathWithoutBase.split("/").filter(Boolean);

      const mdIndex = pathParts.findIndex((part) => part.includes(".md"));
      const lifeIndex = pathParts.findIndex((part) => part === "life");

      let extractedPath = "";
      if (mdIndex >= 0) {
        extractedPath = pathParts.slice(Math.max(0, lifeIndex)).join("/");
      } else if (lifeIndex >= 0) {
        extractedPath = pathParts.slice(lifeIndex).join("/");
      }

      // 优先使用URL参数中的src
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("src")) {
        extractedPath = urlParams.get("src") || "";
      }

      if (extractedPath) {
        pathFromUrl.value = extractedPath;
      }
    }
  } catch (error) {
    console.error("解析URL路径失败:", error);
  }
};
const handleViewerList = () => {
  if (typeof window === "undefined") return;

  document?.addEventListener("click", (e: Event) => {
    if (e.target instanceof HTMLImageElement) {
      viewerList.value = [e?.target?.src || ""];
      visibleViewer.value = true;
    }
  });
};
// 在客户端挂载后才尝试访问window对象
onMounted(() => {
  getPathFromUrl();
  handleViewerList();
});

const articleSrc = computed(() => {
  // 优先使用客户端获取的路径，其次使用page.params
  if (pathFromUrl.value) {
    return pathFromUrl.value;
  }

  const pageSrc = page.value?.params?.src;
  if (pageSrc) {
    console.log("从page.params获取到src:", pageSrc);
    return pageSrc;
  }

  // 都没有获取到，返回空字符串
  return "";
});

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
  const { fileName, baseName } = getFileInfo(articleSrc.value);
  let fileKey = Object.keys(markdownFiles).find((key) => {
    return key.includes(baseName) || key.includes(fileName);
  });

  // 如果找不到完全匹配的，尝试部分匹配
  if (!fileKey) {
    fileKey = Object.keys(markdownFiles).find((key) =>
      key.toLowerCase().includes(baseName.toLowerCase())
    );
  }

  return fileKey;
};

const renderedContent = ref("");
const contentLoading = ref(true);
// 解析和渲染Markdown文件
const loadAndRenderMarkdown = async () => {
  if (!articleSrc.value) {
    renderedContent.value = "<p>未提供文章路径</p>";
    contentLoading.value = false;
    return;
  }

  try {
    contentLoading.value = true;

    const { fileName } = getFileInfo(articleSrc.value);

    const markdownFiles = (import.meta as any).glob("../life/*.md", {
      as: "raw",
    });
    const fileKey = getFileKey(markdownFiles);

    if (fileKey) {
      const markdownContent = await markdownFiles[fileKey]();
      renderedContent.value = mdRender(markdownContent);
    } else {
      renderedContent.value = `<p>未找到对应的文章内容: ${fileName}</p>`;
    }
  } catch (error) {
    console.error("加载Markdown文件失败:", error);
    renderedContent.value = `<p>加载文章内容失败: ${error.message}</p>`;
  } finally {
    contentLoading.value = false;
  }
};

watch(
  () => articleSrc.value,
  () => {
    loadAndRenderMarkdown();
  },
  { immediate: true }
);
</script>
<style scoped>
.rotate-icon {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
/* 添加内容区域图片居中样式 */
</style>

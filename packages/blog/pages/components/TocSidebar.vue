<template>
  <div
    class="toc-sidebar text-sm"
    :class="{ 'toc-sidebar-dark': isDarkMode }"
    v-show="!isHidden"
  >
    <div
      class="pl-[10px] transition-opacity duration-500 ease-in-out text-black-50"
      :style="{ opacity: isVisible ? '1' : '0.5' }"
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="3" y1="12" x2="12" y2="12"></line>
        <line x1="3" y1="6" x2="18" y2="6"></line>
        <line x1="3" y1="18" x2="18" y2="18"></line>
      </svg>
    </div>
    <div
      class="toc-content max-h-[70vh] overflow-y-auto transition-opacity duration-600 ease-in-out"
      :style="{ opacity: isVisible ? '1' : '0' }"
    >
      <ul v-if="tocItems.length > 0">
        <li
          v-for="(item, index) in tocItems"
          :key="index"
          :style="{ paddingLeft: `${(item.level - 1) * 12}px` }"
          class="hover:font-bold hover:text-underline cursor-pointer"
        >
          <span
            @click="scrollToSection(item, $event)"
            class="hover:text-underline"
          >
            {{ item.title }}
          </span>
        </li>
      </ul>
      <p v-else class="text-center py-4 text-sm text-gray-400">没有目录数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

interface TocItem {
  title: string;
  level: number;
  element: HTMLElement;
}

const props = defineProps({
  content: {
    type: String,
    default: "",
  },
  level: {
    type: Number,
    default: 2,
  },
});

// 响应式数据
const tocItems = ref<TocItem[]>([]);
const isVisible = ref(true);
const isDarkMode = computed(() => {
  return document.documentElement.classList.contains("dark");
});

const querySelectors = () => {
  let querySelectors = "";
  for (let i = 0; i < props.level; i++) {
    querySelectors += `h${i + 2},`;
  }
  // 删除最后一个逗号
  querySelectors = querySelectors.slice(0, -1);
  return querySelectors;
};

// 收集页面中的标题元素生成目录
const collectTocItems = (content: string) => {
  // 重置目录项
  tocItems.value = [];

  try {
    if (content) {
      // 首先解析HTML字符串获取标题信息
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");

      const headers = doc.querySelectorAll(querySelectors());

      tocItems.value = Array.from(headers).map((header, index) => {
        const level = parseInt(header.tagName.replace("H", ""), 10);
        const title = header.textContent || `Untitled ${index + 1}`;

        return {
          title,
          level,
          element: null as unknown as HTMLElement,
        };
      });
    }
  } catch (error) {
    console.error("收集目录项时出错:", error);
    tocItems.value = [];
  }
};

// 滚动到指定章节
const scrollToSection = (item: TocItem, event: MouseEvent) => {
  event.preventDefault();

  const headers = document.querySelectorAll(querySelectors());
  let actualElement = Array.from(headers).find(
    (header) => header.textContent?.trim() === item.title.trim()
  ) as HTMLElement | null;

  if (actualElement) {
    window.scrollTo({
      top: actualElement.offsetTop - 80,
      behavior: "smooth",
    });
    return;
  }
  console.warn(`未找到元素: ${item.title}`);
};

watch(
  () => props.content,
  () => {
    collectTocItems(props.content);
  },
  {
    immediate: true,
  }
);

// 将事件处理函数提取为命名函数
const handleMouseLeave = () => {
  isVisible.value = false;
};

const handleMouseEnter = () => {
  isVisible.value = true;
};

onMounted(() => {
  document.addEventListener("mouseleave", handleMouseLeave);
  document.addEventListener("mouseenter", handleMouseEnter);
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  // 使用相同的函数引用移除事件监听器
  document.removeEventListener("mouseleave", handleMouseLeave);
  document.removeEventListener("mouseenter", handleMouseEnter);
  window.removeEventListener("resize", handleResize);
});

const isHidden = ref(false);
// 监听屏幕宽度变化，当距离右边右边的 dom 元素小于 12px 的时候，就隐藏目录
const handleResize = () => {
  if (window.innerWidth < 1000) {
    isHidden.value = true;
  } else {
    isHidden.value = false;
  }
};
</script>

<style scoped>
.toc-sidebar {
  position: fixed;
  top: 80px;
  width: 180px;
  transition: right 0.3s ease;
  z-index: 50;
  left: 24px;
}

.toc-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-sidebar-dark .toc-content li.active a {
  background-color: rgba(59, 130, 246, 0.2);
}

.hover\:text-underline:hover {
  text-decoration: underline;
  text-decoration-thickness: 2px;
}
</style>

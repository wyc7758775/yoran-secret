<template>
  <div
    class="toc-sidebar text-sm"
    :class="{ 'toc-sidebar-dark': isDarkMode }"
    v-show="!isHidden && tocItems.length > 0"
  >
    <div
      class="pl-[10px] pb-[10px] transition-opacity duration-500 ease-in-out text-black-50"
      :style="{ opacity: isVisibleToc ? '1' : '0.5' }"
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
      :style="{ opacity: isVisibleToc ? '1' : '0' }"
    >
      <ul>
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
  isVisibleToc: {
    type: Boolean,
    default: false,
  },
});

// 响应式数据
const tocItems = ref<TocItem[]>([]);

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
    if (
      content &&
      typeof window !== "undefined" &&
      typeof DOMParser !== "undefined"
    ) {
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

watch(
  () => props.content,
  () => {
    collectTocItems(props.content);
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    window.addEventListener("resize", handleResize);
  }
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const isHidden = ref(false);
const handleResize = () => {
  if (window.innerWidth < 1000) {
    isHidden.value = true;
  } else {
    isHidden.value = false;
  }
};

// 更新 isDarkMode 计算属性，添加环境检查
// 确保在客户端环境下执行所以需要判断 window
const isDarkMode = computed(() => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return document.documentElement.classList.contains("dark");
  }
  return false;
});

const scrollToSection = (item: TocItem, event: MouseEvent) => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
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

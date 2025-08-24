<template>
  <button
    v-show="showBackToTop"
    class="back-to-top cursor-pointer fixed bottom-12 right-6 p-3 rounded-full shadow-lg hover:dark:bg-gray-700 transition-all duration-300 z-50"
    @click="scrollToTop"
    aria-label="回到顶部"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 10l7-7m0 0l7 7m-7-7v18"
      />
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

const showBackToTop = ref(false);
const scrollThreshold = 300; // 滚动多少像素后显示回到顶部按钮

function handleScroll() {
  showBackToTop.value = window.scrollY > scrollThreshold;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.back-to-top {
  opacity: 0.9;
  transform: translateY(5px);
  transition: all 0.3s ease;
}

.back-to-top:hover {
  opacity: 1;
  transform: translateY(0) scale(1.1);
}

.back-to-top[v-if="showBackToTop"] {
  transform: translateY(0);
}
</style>

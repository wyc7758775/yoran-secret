<script setup lang="ts">
// 文章骨架屏组件 - 仅填充首屏可视区域
// 模拟 Markdown 文章结构：图片 + 标题 + 段落 + 小标题 + 图片 + 列表
</script>

<template>
  <div class="article-skeleton w-full" aria-label="文章内容加载中">
    <!-- 顶部封面图片占位 -->
    <div class="skeleton-img skeleton-shimmer rounded-lg w-full aspect-video mb-6" />

    <!-- 标题区域 -->
    <div class="skeleton-block skeleton-shimmer h-8 w-3/4 rounded mb-3" />
    <div class="skeleton-block skeleton-shimmer h-5 w-1/2 rounded mb-8" />

    <!-- 第一段正文 -->
    <div class="skeleton-block skeleton-shimmer h-4 w-full rounded mb-3" />
    <div class="skeleton-block skeleton-shimmer h-4 w-11/12 rounded mb-3" />
    <div class="skeleton-block skeleton-shimmer h-4 w-4/5 rounded mb-8" />

    <!-- 小标题 -->
    <div class="skeleton-block skeleton-shimmer h-5 w-1/3 rounded mb-4" />

    <!-- 第二段正文 -->
    <div class="skeleton-block skeleton-shimmer h-4 w-full rounded mb-3" />
    <div class="skeleton-block skeleton-shimmer h-4 w-10/12 rounded mb-3" />
    <div class="skeleton-block skeleton-shimmer h-4 w-3/4 rounded mb-8" />

    <!-- 文中图片占位 -->
    <div class="skeleton-img skeleton-shimmer rounded-lg w-full aspect-video mb-8" />

    <!-- 列表项 -->
    <div class="flex items-center gap-3 mb-3">
      <div class="skeleton-block skeleton-shimmer h-2 w-2 rounded-full flex-shrink-0" />
      <div class="skeleton-block skeleton-shimmer h-4 w-2/5 rounded" />
    </div>
    <div class="flex items-center gap-3 mb-3">
      <div class="skeleton-block skeleton-shimmer h-2 w-2 rounded-full flex-shrink-0" />
      <div class="skeleton-block skeleton-shimmer h-4 w-1/2 rounded" />
    </div>
    <div class="flex items-center gap-3 mb-8">
      <div class="skeleton-block skeleton-shimmer h-2 w-2 rounded-full flex-shrink-0" />
      <div class="skeleton-block skeleton-shimmer h-4 w-1/3 rounded" />
    </div>

    <!-- 最后一段 -->
    <div class="skeleton-block skeleton-shimmer h-4 w-full rounded mb-3" />
    <div class="skeleton-block skeleton-shimmer h-4 w-10/12 rounded mb-3" />
    <div class="skeleton-block skeleton-shimmer h-4 w-2/3 rounded" />
  </div>
</template>

<style scoped>
/* 骨架屏基础颜色 - 适配 Light 模式 */
.skeleton-block,
.skeleton-img {
  background-color: var(--vp-c-bg-soft, #f0f0f0);
}

/* Dark 模式下的骨架颜色 */
.dark .skeleton-block,
.dark .skeleton-img {
  background-color: var(--vp-c-bg-soft, #2a2a2a);
}

/* Shimmer 流光动画 */
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer-flow 1.6s ease-in-out infinite;
}

/* Dark 模式下 shimmer 亮度降低 */
.dark .skeleton-shimmer::after {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
}

@keyframes skeleton-shimmer-flow {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

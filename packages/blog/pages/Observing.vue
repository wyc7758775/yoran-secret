<script setup>
import { computed, ref } from 'vue'
import { ElImage } from 'element-plus'
import ObservingData from '../.vitepress/router/life.js'
import ObservingVideo from './ObservingVideo.vue'
import LifeData from '../.vitepress/router/life.js'
import VideoData from '../.vitepress/router/video-cover.js'

const currentView = ref('minimal')

const pikachuPixels = computed(() => {
  const grid = [
    '        BB  BB        ',
    '       BBBBBBBB       ',
    '      BYBBBBBBBY      ',
    '     BYYYYYYYYYYY     ',
    '    BYYBBYYBBYYYY     ',
    '    BYYBBYYBBYYYY     ',
    '    BYYYYYYYYYYYY     ',
    '     YYRRYYYYRRYY     ',
    '     YYYYYYYYYYYY     ',
    '     YYYYYYYYYYYY     ',
    '      YYYYYYYYYY      ',
    '      YYYYYYYYYY      ',
    '     OYYYYYYYYYYO     ',
    '     OYYYYYYYYYYO     ',
    '    OOOYYYYYYYYOOO    ',
    '    OOOYYYYYYYYOOO    ',
    '     YYYYYYYYYYYY     ',
    '      YYYYYYYYYY      ',
    '      YYYYYYYYYY      ',
    '     OO        OO     ',
  ]
  const colors = {
    B: '#231F20',
    Y: '#F4DC26',
    R: '#E84638',
    O: '#E8A838',
  }
  const pixels = []
  grid.forEach((row, y) => {
    row.split('').forEach((cell, x) => {
      if (cell !== ' ') {
        pixels.push({
          x: x * 5,
          y: y * 5,
          fill: colors[cell],
        })
      }
    })
  })
  return pixels
})

function toggleView() {
  currentView.value = currentView.value === 'minimal' ? 'classic' : 'minimal'
}

// === Classic View Data ===
const emits = defineEmits(['open'])
const navigateToDetail = (article) => {
  emits('open', article)
}
const defaultImage = 'https://picsum.photos/id/1033/1200/800'
const hostArticle = () => {
  return {
    ...ObservingData[0],
    firstImage: ObservingData[0].firstImage ?? defaultImage,
  }
}
const otherHostArticle = () => {
  return ObservingData.slice(1, 5).map(item => ({
    ...item,
    firstImage:
      item.firstImage
      ?? `https://picsum.photos/id/${Math.floor(Math.random() * 1084)}/1200/800`,
  }))
}
const otherArticle = () => {
  return ObservingData.slice(5).map(item => ({
    ...item,
    firstImage:
      item.firstImage
      ?? `https://picsum.photos/id/${Math.floor(Math.random() * 1084)}/1200/800`,
  }))
}

// === Minimal View Data ===
const lifeArticles = LifeData.map(item => ({
  date: item.createTime.split(' · ')[0],
  title: item.caption,
  link: `/yoran-secret/observer-detail?src=${encodeURIComponent(item.src)}`,
}))

const videoArticles = VideoData.map(item => ({
  date: 'Bilibili',
  title: item.title || item.caption,
  link: item.src,
}))
</script>

<template>
  <!-- ===== Classic View (Original) ===== -->
  <div v-if="currentView === 'classic'" class="slide-fade">
    <div class="max-w-7xl mx-auto">
      <!-- 切换 -->
      <div class="observer-header">
        <button class="view-toggle-btn" @click="toggleView">
          ← List
        </button>
      </div>
      <div class="container mx-auto mb-10">
        <!-- 页面标题 -->
        <h1 class="text-4xl font-bold mb-8">
          Life
        </h1>

        <!-- 热门文章 -->
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="lg:w-2/3 cursor-pointer">
            <a
              class="block"
              :href="`/yoran-secret/observer-detail?src=${hostArticle().src}`"
            >
              <div class="group">
                <div class="relative overflow-hidden rounded-lg">
                  <ElImage
                    :src="hostArticle().firstImage"
                    alt="出错啰"
                    fit="contain"
                    lazy
                    class="w-full rounded-lg h-[400px] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div
                  class="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors"
                >
                  {{ hostArticle().caption }}
                </div>
                <p class="text-gray-600 mb-4 line-clamp-2">
                  {{ hostArticle().postSummary }}
                </p>
                <div class="text-gray-500 text-sm">
                  {{ hostArticle().createTime }}
                </div>
              </div>
            </a>
          </div>

          <!-- 右侧文章列表 -->
          <div class="lg:w-1/3">
            <div class="space-y-8">
              <a
                v-for="value in otherHostArticle()"
                :key="value.src"
                :href="`/yoran-secret/observer-detail?src=${value.src}`"
                class="block"
              >
                <article
                  class="group flex flex-col sm:flex-row gap-2 rounded-lg cursor-pointer"
                >
                  <div class="sm:w-1/3">
                    <div class="relative overflow-hidden rounded-lg">
                      <ElImage
                        :src="value.firstImage"
                        alt="404"
                        fit="cover"
                        lazy
                        class="w-full rounded-lg h-[100px] transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div class="sm:w-2/3">
                    <div
                      class="text-lg font-semibold group-hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {{ value.caption }}
                    </div>
                    <div class="mt-1 mb-1 text-gray-600 line-clamp-2">
                      {{ value.postSummary }}
                    </div>
                    <div class="text-gray-500 text-xs">
                      {{ value.createTime }}
                    </div>
                  </div>
                </article>
              </a>
            </div>
          </div>
        </div>

        <!-- 其他文章 -->
        <div class="mt-12">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="value in otherArticle()"
              :key="value.src"
              class="group cursor-pointer"
              @click="navigateToDetail(value)"
            >
              <a
                :href="`/yoran-secret/observer-detail?src=${value.src}`"
                class="block"
              >
                <div class="relative overflow-hidden rounded-lg mb-2">
                  <ElImage
                    :src="value.firstImage"
                    :alt="value.caption"
                    fit="cover"
                    lazy
                    class="w-full rounded-lg h-[100px] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div
                  class="text-sm font-medium group-hover:text-blue-600 transition-colors"
                >
                  {{ value.caption }}
                </div>
                <div class="text-gray-500 text-xs mt-1">
                  {{ value.createTime }}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 弹窗视频 -->
      <ObservingVideo />
    </div>
  </div>

  <!-- ===== Minimal View (Armeet Style) ===== -->
  <div v-else class="observer-page">
    <!-- 切换 -->
    <div class="observer-header">
      <button class="view-toggle-btn" @click="toggleView">
        Grid →
      </button>
    </div>

    <!-- 马赛克皮卡丘 -->
    <div class="observer-portrait">
      <svg viewBox="0 0 100 100" width="100" height="100">
        <rect
          v-for="p in pikachuPixels"
          :key="`${p.x}-${p.y}`"
          :x="p.x"
          :y="p.y"
          width="5"
          height="5"
          :fill="p.fill"
        />
      </svg>
    </div>

    <!-- 位置信息 -->
    <div class="observer-meta">
      <em>Currently based in Shenzhen - last posted recently</em>
    </div>

    <!-- Life -->
    <section class="observer-section">
      <h2 class="observer-section-title">
        Life
      </h2>
      <ul class="observer-list">
        <li
          v-for="article in lifeArticles"
          :key="article.link"
          class="observer-list-item"
        >
          <span class="observer-date">{{ article.date }}</span>
          <a :href="article.link" class="observer-link">{{ article.title }}</a>
        </li>
      </ul>
    </section>

    <!-- Video -->
    <section class="observer-section">
      <h2 class="observer-section-title">
        Video
      </h2>
      <ul class="observer-list">
        <li
          v-for="video in videoArticles"
          :key="video.link"
          class="observer-list-item"
        >
          <span class="observer-date">{{ video.date }}</span>
          <a
            :href="video.link"
            target="_blank"
            class="observer-link"
          >{{ video.title }}</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* ========== Toggle Bar ========== */
.view-toggle-btn {
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  padding: 6px 14px;
  font-size: 13px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.view-toggle-btn:hover {
  border-color: #e06c75;
  color: #e06c75;
}

.dark .view-toggle-btn:hover {
  border-color: #ff9e9e;
  color: #ff9e9e;
}

/* ========== Minimal View Styles ========== */
.observer-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 24px 96px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}

.observer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.observer-portrait {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.observer-portrait svg {
  display: block;
  image-rendering: pixelated;
}

.observer-meta {
  text-align: center;
  margin-bottom: 20px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.observer-section {
  margin-bottom: 48px;
}

.observer-section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.observer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.observer-list-item {
  display: flex;
  align-items: baseline;
  padding: 3px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background-color 0.15s ease;
}

.observer-list-item:last-child {
  border-bottom: none;
}

.observer-list-item:hover {
  background-color: rgba(224, 108, 117, 0.04);
}

.dark .observer-list-item:hover {
  background-color: rgba(255, 158, 158, 0.06);
}

.observer-date {
  min-width: 110px;
  color: #e06c75;
  font-size: 13px;
  flex-shrink: 0;
}

.dark .observer-date {
  color: #ff9e9e;
}

.observer-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s ease;
  word-break: break-all;
}

.observer-link:hover {
  color: #e06c75;
  text-decoration: underline;
}

.dark .observer-link:hover {
  color: #ff9e9e;
}

@media (max-width: 480px) {
  .observer-page {
    padding: 16px 16px 64px;
  }

  .observer-title {
    font-size: 24px;
  }

  .observer-list-item {
    flex-direction: column;
    gap: 4px;
  }

  .observer-date {
    min-width: auto;
  }
}

/* ========== Classic View Styles ========== */
@media (max-width: 640px) {
  h1 {
    font-size: 2.5rem !important;
  }

  h2 {
    font-size: 1.75rem !important;
  }

  h3 {
    font-size: 1.25rem !important;
  }
}

a {
  user-select: none;
  text-decoration: none;
  color: inherit;
}
</style>

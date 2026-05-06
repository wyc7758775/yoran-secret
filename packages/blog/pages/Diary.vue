<script setup>
import { computed } from 'vue'
import { ElImage } from 'element-plus'
import RawDiaryData from '../.vitepress/router/diary.js'

function parseCreateTime(createTime) {
  const dateStr = createTime.split(' · ')[0]
  return new Date(dateStr)
}

const DiaryData = computed(() => {
  return [...RawDiaryData].sort((a, b) => {
    return parseCreateTime(b.createTime) - parseCreateTime(a.createTime)
  })
})

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

const baseUrl = import.meta.env.BASE_URL || '/'
function resolveFirstImage(src) {
  if (!src) return ''
  if (/^https?:\/\//.test(src)) return src
  if (src.startsWith('/')) {
    const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'
    return base + src.slice(1)
  }
  return src
}

function formatDateForTimeline(createTime) {
  const dateStr = createTime.split(' · ')[0]
  const d = new Date(dateStr)
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const month = months[d.getMonth()]
  const day = String(d.getDate()).padStart(2, '0')
  const year = d.getFullYear()
  return { month, day, year, full: `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-${day}` }
}
</script>

<template>
  <div class="diary-page">
    <div v-if="DiaryData.length === 0" class="diary-empty">
      <div class="empty-pikachu">
        <svg viewBox="0 0 100 100" width="120" height="120">
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
      <p class="empty-text">
        还没有日记哦 ~
      </p>
    </div>

    <div v-else class="diary-timeline">
      <div
        v-for="(item, index) in DiaryData"
        :key="item.src"
        class="timeline-item"
        :class="{ 'timeline-left': index % 2 === 0, 'timeline-right': index % 2 === 1 }"
      >
        <div class="timeline-node">
          <div class="timeline-dot" />
          <div class="timeline-date">
            {{ formatDateForTimeline(item.createTime).month }} {{ formatDateForTimeline(item.createTime).day }}
          </div>
        </div>

        <a
          :href="`/yoran-secret/diary-detail?src=${encodeURIComponent(item.src)}`"
          class="timeline-card-link"
        >
          <div class="timeline-card">
            <div v-if="item.firstImage" class="card-image-wrapper">
              <ElImage
                :src="resolveFirstImage(item.firstImage)"
                :alt="item.caption"
                fit="cover"
                lazy
                class="card-image"
              >
                <template #error>
                  <div class="image-error-placeholder" />
                </template>
              </ElImage>
            </div>
            <div class="card-body">
              <h3 class="card-title">
                {{ item.caption }}
              </h3>
              <p v-if="item.previewText" class="card-preview line-clamp-4">
                {{ item.previewText }}
              </p>
              <div class="card-meta">
                {{ item.createTime }}
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diary-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 24px 96px;
}

.diary-empty {
  text-align: center;
  padding: 80px 0;
}

.empty-pikachu {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.empty-pikachu svg {
  display: block;
  image-rendering: pixelated;
}

.empty-text {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

/* ===== Timeline ===== */
.diary-timeline {
  position: relative;
}

.diary-timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: var(--vp-c-divider);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-bottom: 32px;
}

.timeline-item.timeline-left {
  flex-direction: row-reverse;
  padding-right: calc(50% + 24px);
}

.timeline-item.timeline-right {
  padding-left: calc(50% + 24px);
}

/* ===== Node ===== */
.timeline-node {
  position: absolute;
  left: 50%;
  top: 12px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-brand-1, #e06c75);
  border: 2px solid var(--vp-c-bg);
  box-shadow: 0 0 0 2px var(--vp-c-divider);
}

.timeline-date {
  margin-top: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  letter-spacing: 0.05em;
}

/* ===== Card ===== */
.timeline-card-link {
  display: block;
  text-decoration: none;
  color: inherit;
  width: 100%;
}

.timeline-card {
  background: var(--vp-c-bg-soft, #f5f5f5);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

/* 聊天气泡小三角 */
.timeline-left .timeline-card::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 16px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid var(--vp-c-bg-soft, #f5f5f5);
}

.timeline-right .timeline-card::after {
  content: '';
  position: absolute;
  left: -8px;
  top: 16px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid var(--vp-c-bg-soft, #f5f5f5);
}

.card-image-wrapper {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.image-error-placeholder {
  width: 100%;
  height: 160px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.card-preview {
  font-size: 13px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  font-size: 11px;
  color: var(--vp-c-text-3, #999);
}

/* ===== Dark Mode ===== */
.dark .timeline-card {
  background: var(--vp-c-bg-soft, #2a2a2a);
}

.dark .timeline-left .timeline-card::after {
  border-left-color: var(--vp-c-bg-soft, #2a2a2a);
}

.dark .timeline-right .timeline-card::after {
  border-right-color: var(--vp-c-bg-soft, #2a2a2a);
}

/* ===== Mobile ===== */
@media (max-width: 768px) {
  .diary-page {
    padding: 16px 16px 64px;
  }

  .diary-timeline::before {
    left: 16px;
  }

  .timeline-item.timeline-left,
  .timeline-item.timeline-right {
    flex-direction: row;
    padding-left: 44px;
    padding-right: 0;
  }

  .timeline-node {
    left: 16px;
    transform: translateX(-50%);
    align-items: flex-start;
  }

  .timeline-date {
    display: none;
  }

  .timeline-card::after {
    display: none !important;
  }
}

/* ===== line-clamp polyfill for Firefox ===== */
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

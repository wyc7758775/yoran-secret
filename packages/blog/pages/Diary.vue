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

function getLineClampStyle(lines = 3) {
  return {
    '--line-clamp-count': lines,
  }
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
              <p
                v-if="item.previewText"
                class="card-preview line-clamp"
                :style="getLineClampStyle(3)"
              >
                {{ item.previewText }}
              </p>
              <div class="card-meta">
                {{ item.createTime }}
              </div>
            </div>
          </div>
        </a>
      </div>

      <div class="diary-ending" aria-hidden="true">
        <svg
          class="ending-script"
          viewBox="0 0 360 74"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            class="script-tail"
            d="M180 0 C180 14 180 20 180 28"
          />
          <path
            class="script-line script-line-main"
            d="M86 44 C124 22 151 61 184 43 C211 28 230 23 251 39 C267 51 286 51 304 39"
          />
          <path
            class="script-line script-line-soft"
            d="M116 53 C139 45 161 52 184 49 C209 46 230 41 253 49"
          />
          <circle class="ink-dot ink-dot-1" cx="66" cy="45" r="2.8" />
          <circle class="ink-dot ink-dot-2" cx="319" cy="35" r="2.2" />
          <circle class="ink-dot ink-dot-3" cx="284" cy="56" r="1.8" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diary-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 24px 0;
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

@media (min-width: 769px) {
  .timeline-item + .timeline-item {
    margin-top: -180px;
  }
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

/* ===== Ending animation ===== */
.diary-ending {
  position: relative;
  height: 74px;
  margin: 0;
  overflow: hidden;
}

.diary-ending::before,
.diary-ending::after {
  content: '';
  position: absolute;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(
    to bottom,
    var(--vp-c-divider),
    transparent
  );
}

.diary-ending::before {
  top: 0;
  height: 34px;
}

.diary-ending::after {
  top: 28px;
  height: 13px;
  opacity: 0.65;
}

.ending-script {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: min(360px, 72vw);
  height: 74px;
  overflow: visible;
  transform: translateX(-50%);
}

.script-tail,
.script-line {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.script-tail {
  --script-length: 32;
  stroke: color-mix(in srgb, var(--vp-c-divider) 82%, transparent);
  stroke-width: 1.4;
  stroke-dasharray: var(--script-length);
  stroke-dashoffset: var(--script-length);
  animation: script-draw 4.8s ease-in-out infinite;
}

.script-line {
  --script-length: 245;
  filter: drop-shadow(0 0 9px color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent));
  stroke-dasharray: var(--script-length);
  stroke-dashoffset: var(--script-length);
  animation: script-draw 4.8s ease-in-out infinite;
}

.script-line-main {
  stroke: color-mix(in srgb, var(--vp-c-brand-1) 72%, var(--vp-c-text-2));
  stroke-width: 2.2;
}

.script-line-soft {
  stroke: color-mix(in srgb, #2bb3a3 52%, transparent);
  stroke-width: 1.2;
  opacity: 0.55;
  animation-delay: 0.18s;
}

.ink-dot {
  fill: color-mix(in srgb, var(--vp-c-brand-1) 62%, var(--vp-c-bg));
  transform-origin: center;
  animation: ink-breathe 4.8s ease-in-out infinite;
}

.ink-dot-2 {
  fill: color-mix(in srgb, #2bb3a3 56%, var(--vp-c-bg));
  animation-delay: 0.22s;
}

.ink-dot-3 {
  fill: color-mix(in srgb, #d8a441 58%, var(--vp-c-bg));
  animation-delay: 0.42s;
}

/* ===== Mobile ===== */
@media (max-width: 768px) {
  .diary-page {
    padding: 16px 16px 0;
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

  .diary-ending {
    height: 64px;
  }
}

/* ===== line-clamp polyfill for Firefox ===== */
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: var(--line-clamp-count, 3);
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes script-draw {
  0%,
  100% {
    stroke-dashoffset: var(--script-length);
    opacity: 0.22;
  }

  22%,
  72% {
    stroke-dashoffset: 0;
    opacity: 0.9;
  }
}

@keyframes ink-breathe {
  0%,
  100% {
    opacity: 0.16;
    transform: scale(0.72);
  }

  28%,
  68% {
    opacity: 0.9;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .script-tail,
  .script-line,
  .ink-dot {
    animation: none;
    opacity: 0.62;
    stroke-dashoffset: 0;
  }
}
</style>

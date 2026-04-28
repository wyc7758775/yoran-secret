<script setup lang="ts">
import { ElDialog, ElImage } from 'element-plus'
import { computed, ref } from 'vue'
import VideoData from '../.vitepress/router/video-cover.js'

const currentVideo = ref({
  title: '',
  src: '',
  bv: null,
})

const dialogFormVisible = computed(() => !!currentVideo.value.src)
function openVideo(video) {
  currentVideo.value = video
}
function closeDialog() {
  currentVideo.value = {
    title: '',
    src: '',
    bv: null,
  }
}

function getEmbedUrl(bv, src) {
  if (!bv)
    return ''

  const bvMatch = bv.match(/BV[0-9A-Za-z]+/)
  if (bvMatch && bvMatch[0]) {
    return `https://player.bilibili.com/player.html?bvid=${bvMatch[0]}&page=1&as_wide=1&high_quality=1&danmaku=0`
  }

  return src
}

const defaultCover = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22225%22%3E%3Crect fill=%22%2318181b%22 width=%22400%22 height=%22225%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-family=%22sans-serif%22 font-size=%2216%22 fill=%22%236b7280%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo Cover%3C/text%3E%3C/svg%3E'
</script>

<template>
  <h1 class="text-4xl font-bold mb-8">
    Video
  </h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    <div
      v-for="value in VideoData"
      :key="value.bv"
      class="group cursor-pointer relative overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      @click="openVideo(value)"
    >
      <!-- 封面图 -->
      <div class="aspect-video overflow-hidden">
        <ElImage
          :src="value.cover || defaultCover"
          :alt="value.caption"
          fit="cover"
          lazy
          class="w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      <!-- 播放按钮（悬停显示） -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <svg class="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <!-- 标题（底部） -->
      <div class="absolute bottom-0 left-0 right-0 p-3">
        <div class="text-white text-sm font-medium leading-snug line-clamp-2 drop-shadow-md">
          {{ value.title || value.caption }}
        </div>
        <div v-if="value.desc" class="text-white/70 text-xs mt-1 line-clamp-1">
          {{ value.desc }}
        </div>
      </div>
    </div>
  </div>

  <!-- 视频弹窗 -->
  <ElDialog
    v-model="dialogFormVisible"
    :title="currentVideo.title"
    :close-on-click-modal="false"
    destroy-on-close
    class="video-player-dialog"
    @close="closeDialog"
  >
    <div class="aspect-video w-full">
      <iframe
        :src="getEmbedUrl(currentVideo.bv, currentVideo.src)"
        class="w-full h-full rounded-lg"
        frameborder="0"
        allowfullscreen
        sandbox="allow-same-origin allow-scripts allow-popups"
      />
    </div>
  </ElDialog>
</template>

<style scoped>
:deep(.video-player-dialog) {
  width: 90vw !important;
  max-width: 960px !important;
}

:deep(.video-player-dialog .el-dialog__body) {
  padding: 0 0 16px 0;
}
</style>

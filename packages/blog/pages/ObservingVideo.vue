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

// 转换B站链接为嵌入式播放器链接
function getEmbedUrl(bv, src) {
  if (!bv)
    return ''

  // 提取BV号
  const bvMatch = bv.match(/BV[0-9A-Za-z]+/)
  if (bvMatch && bvMatch[0]) {
    const bvId = bvMatch[0]
    // 返回B站嵌入式播放器链接
    return `https://player.bilibili.com/player.html?bvid=${bvId}&page=1&as_wide=1&high_quality=1&danmaku=0`
  }

  return src
}
</script>

<template>
  <h1 class="text-4xl font-bold mb-8">
    Video
  </h1>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="value in VideoData"
      :key="value.bv"
      class="group cursor-pointer"
      @click="openVideo(value)"
    >
      <div class="relative overflow-hidden rounded-lg mb-2 cursor-pointer">
        <ElImage
          :src="value.cover"
          :alt="value.caption"
          fit="cover"
          lazy
          class="w-full rounded-lg h-[100px] transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div
        class="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-2"
      >
        {{ value.title ?? value.cover }}
      </div>
    </div>
  </div>

  <!-- 视频弹窗 -->
  <ElDialog
    v-model="dialogFormVisible"
    :title="currentVideo.title"
    :close-on-click-modal="false"
    destroy-on-close
    width="80%"
    draggable
    @close="closeDialog"
  >
    <div class="flex justify-center">
      <iframe
        :src="getEmbedUrl(currentVideo.bv, currentVideo.src)"
        controls
        class="w-full h-50vh"
        frameborder="0"
        allowfullscreen
        sandbox="allow-same-origin allow-scripts allow-popups"
      />
    </div>
  </ElDialog>
</template>

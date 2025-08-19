<template>
  <h1 class="text-4xl font-bold mb-8">Video</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="value in VideoData"
      :key="value.bv"
      class="group cursor-pointer"
      @click="openVideo(value)"
    >
      <div class="relative overflow-hidden rounded-lg mb-2 cursor-pointer">
        <el-image
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
  <el-dialog
    :title="currentVideo.title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    @close="closeDialog"
  >
    <div class="flex justify-center">
      <iframe
        :src="currentVideo.src"
        controls
        class="w-full h-[500px] rounded-lg"
        frameborder="0"
      ></iframe>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { ElImage, ElDialog } from "element-plus";
import VideoData from "../.vitepress/router/video-cover.js";

const currentVideo = ref({
  title: "",
  src: "",
});

const dialogFormVisible = computed(() => currentVideo.value.src);
const openVideo = (video) => {
  console.log({ video });
  currentVideo.value = video;
};
const closeDialog = () => {
  currentVideo.value = {
    title: "",
    src: "",
  };
};
</script>

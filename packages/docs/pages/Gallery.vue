<template>
  <div class="p-5 max-w-7xl mx-auto">
    <p>
      <el-image :src="imgSrc1" alt="Zhenghao" class="profile-image" />
    </p>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="rounded-lg overflow-hidden shadow-md hover:-translate-y-2 transition-transform duration-300 bg-white"
      >
        <el-image
          :src="image.src"
          :preview-src-list="[image.src]"
          fit="cover"
          class="w-full h-48 cursor-pointer"
          lazy
          show-progress
          preview-teleported
          @click="showPreview(index)"
        />
        <div class="text-center text-xs dark:text-black pb-1">
          {{ image.caption }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import getGallery from "../.vitepress/router/gallery";

const imgSrc1 = new URL("/assets/gallery/bg3.jpg", import.meta.url).href;
// 图片数据 - 实际使用时会从assets/gallery目录加载
const images = getGallery
  .filter((item) => item !== null)
  .map((item) => ({
    ...item,
    // 手动添加base路径
    src: `${import.meta.env.BASE_URL}${
      item.src.startsWith("/") ? item.src.slice(1) : item.src
    }`,
    createTime: new Date(item.createTime),
  }))
  .sort((a, b) => b.createTime.getTime() - a.createTime.getTime());
console.log({ imgSrc1, images });

const currentImage = ref({ src: "", caption: "" });
const scale = ref(1);
// 显示预览
const showPreview = (index: number) => {
  currentImage.value = {
    ...images[index],
    src: images[index].src,
  };
  scale.value = 1;
};
</script>

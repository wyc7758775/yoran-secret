<template>
  <div class="slide-fade p-5 max-w-7xl mx-auto" v-once>
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
import { ElImage } from "element-plus";
import getGallery from "../.vitepress/router/gallery";
import picture from "../.vitepress/router/picture";
import { getImageUrl } from "../helps/import-images";

// 图片数据 - 实际使用时会从assets/gallery目录加载
const images = [
  ...getGallery
    .filter((item) => item !== null)
    .map((item) => ({
      ...item,
      // 手动添加base路径
      src: getImageUrl(item.src),
      createTime: new Date(item.createTime),
    })),
  ...picture,
];

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

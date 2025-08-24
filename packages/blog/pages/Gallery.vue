<template>
  <div class="slide-fade">
    <div class="h-12 flex items-center cursor-pointer pl-4" @click="swtichFit">
      <el-icon v-if="fitImg === 'cover'"><Grid /></el-icon>
      <el-icon v-else><Menu /></el-icon>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-10 px-4"
    >
      <el-image
        class="w-full hover:-translate-y-2 transition-transform duration-300 h-[15rem]"
        v-for="(image, index) in images"
        :key="index"
        :src="image.src"
        :preview-src-list="[image.src]"
        :fit="fitImg"
        lazy
        show-progress
        preview-teleported
        @click="showPreview(index)"
      />
    </div>
  </div>

  <BackToTop />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElImage, ElIcon } from "element-plus";
import { Grid, Menu } from "@element-plus/icons-vue";
import getGallery from "../.vitepress/router/gallery";
import picture from "../.vitepress/router/picture";
import { getImageUrl } from "../helps/import-images";
import { useNavToStatic } from "./hooks/use-nav-to-static.ts";
import BackToTop from "./components/BackToTop.vue";

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

useNavToStatic();

const fitImg = ref<string>("cover");
const swtichFit = () => {
  fitImg.value = fitImg.value === "cover" ? "contain" : "cover";
};
</script>

<script setup lang="ts">
import { Grid, Menu } from '@element-plus/icons-vue'
import { ElIcon, ElImage } from 'element-plus'
import { ref } from 'vue'
import getGallery from '../.vitepress/router/gallery'
import picture from '../.vitepress/router/picture'
import { getImageUrl } from '../helps/import-images'
import BackToTop from './components/BackToTop.vue'
import { useNavToStatic } from './hooks/use-nav-to-static.ts'

// 图片数据 - 实际使用时会从assets/gallery目录加载
const images = [
  ...picture,
  ...getGallery
    .filter(item => item !== null)
    .map(item => ({
      ...item,
      // 手动添加base路径
      src: getImageUrl(item.src),
      createTime: new Date(item.createTime),
    })),
]

const currentImage = ref({ src: '', caption: '' })
const scale = ref(1)
// 显示预览
function showPreview(index) {
  currentImage.value = {
    ...images[index],
    src: images[index].src,
  }
  scale.value = 1
}

useNavToStatic()

const fitImg = ref < string > ('cover')
function swtichFit() {
  fitImg.value = fitImg.value === 'cover' ? 'contain' : 'cover'
}
</script>

<template>
  <div class="slide-fade">
    <div class="h-12 flex items-center cursor-pointer pl-4">
      <span @click="swtichFit">
        <ElIcon v-if="fitImg === 'cover'">
          <Grid />
        </ElIcon>
        <ElIcon v-else>
          <Menu />
        </ElIcon>
      </span>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-10 px-4"
    >
      <ElImage
        v-for="(image, index) in images"
        :key="index"
        class="w-full hover:-translate-y-2 transition-transform duration-300 h-[24rem]"
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

  <div class="prose mx-auto mt-10 mb-10 flex justify-center content-center">
    <div>
      <em>
        Thank you for being interested in my photos. You can find the tools I
        use here.
      </em>
    </div>
  </div>

  <BackToTop />
</template>

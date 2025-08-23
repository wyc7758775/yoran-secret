<template>
  <div class="slide-fade">
    <div class="p-5 max-w-7xl mx-auto">
      <div class="container mx-auto mb-10">
        <!-- 页面标题 -->
        <h1 class="text-4xl font-bold mb-8">Life</h1>

        <!-- 热门文章 -->
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="lg:w-2/3 cursor-pointer">
            <a
              class="block"
              :href="`/yoran-secret/observer-detail?src=${hostArticle().src}`"
            >
              <div class="group">
                <div class="relative overflow-hidden rounded-lg">
                  <el-image
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
                :href="`/yoran-secret/observer-detail?src=${value.src}`"
                v-for="value in otherHostArticle()"
                class="block"
              >
                <article
                  class="group flex flex-col sm:flex-row gap-2 rounded-lg cursor-pointer"
                >
                  <div class="sm:w-1/3">
                    <div class="relative overflow-hidden rounded-lg">
                      <el-image
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
                    <p class="text-gray-500 text-xs">{{ value.createTime }}</p>
                  </div>
                </article>
              </a>
            </div>
          </div>
        </div>

        <!-- 其他文章 -->
        <div class="mt-12">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- 热门文章1 -->
            <div
              v-for="value in otherArticle()"
              class="group cursor-pointer"
              @click="navigateToDetail(value)"
            >
              <a
                :href="`/yoran-secret/observer-detail?src=${value.src}`"
                class="block"
              >
                <div class="relative overflow-hidden rounded-lg mb-2">
                  <el-image
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
</template>

<script setup>
import { ElImage } from "element-plus";
import ObservingData from "../.vitepress/router/life.js";
import ObservingVideo from "./ObservingVideo.vue";

const emits = defineEmits(["open"]);

// 路由跳转函数
const navigateToDetail = (article) => {
  emits("open", article);
};

const defaultImage = "https://picsum.photos/id/1033/1200/800";
const hostArticle = () => {
  return {
    ...ObservingData[0],
    firstImage: ObservingData[0].firstImage ?? defaultImage,
  };
};
// 其他热门文章，拿 ObservingData 前四个
const otherHostArticle = () => {
  return ObservingData.slice(1, 5).map((item) => ({
    ...item,
    firstImage:
      item.firstImage ??
      `https://picsum.photos/id/${Math.floor(Math.random() * 1084)}/1200/800`,
  }));
};

// 剩下的文章
const otherArticle = () => {
  return ObservingData.slice(5).map((item) => ({
    ...item,
    firstImage:
      item.firstImage ??
      `https://picsum.photos/id/${Math.floor(Math.random() * 1084)}/1200/800`,
  }));
};
</script>
<style scoped>
/* 针对移动设备的优化 */
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

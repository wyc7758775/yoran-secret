<template>
  <div>
    <div v-show="!showDetail" class="p-5 max-w-7xl mx-auto">
      <div class="container mx-auto">
        <!-- 页面标题 -->
        <h1 class="text-4xl font-bold mb-8">Life</h1>

        <!-- 热门文章 -->
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- 左侧大封面文章 -->
          <div
            class="lg:w-2/3 cursor-pointer pr-4"
            @click="navigateToDetail(hostArticle())"
          >
            <div class="group">
              <div class="relative overflow-hidden rounded-lg">
                <el-image
                  :src="hostArticle().firstImage"
                  alt="出错啰"
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
          </div>

          <!-- 右侧文章列表 -->
          <div class="lg:w-1/3">
            <div class="space-y-8">
              <!-- 文章项1 -->
              <article
                v-for="value in otherHostArticle()"
                class="group flex flex-col sm:flex-row gap-4 p-1 rounded-lg cursor-pointer"
                @click="navigateToDetail(value)"
              >
                <div class="sm:w-1/3">
                  <div class="relative overflow-hidden rounded-lg">
                    <el-image
                      :src="value.firstImage"
                      alt="404"
                      fit="cover"
                      lazy
                      class="w-full rounded-lg h-[120px] sm:h-full transition-transform duration-500 group-hover:scale-105"
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
            </div>
          </div>
        </div>
      </div>
    </div>
    <ObservingDetail
      v-show="showDetail"
      @close="showDetail = false"
      :src="currentArticleSrc"
    ></ObservingDetail>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElImage } from "element-plus";
import ObservingDetail from "./ObservingDetail.vue";
import ObservingData from "../.vitepress/router/life.js";

const showDetail = ref(false);
const currentArticleSrc = ref("");
// 路由跳转函数
const navigateToDetail = (article) => {
  showDetail.value = !showDetail.value;
  currentArticleSrc.value = article.src;
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
img {
  transition: opacity 0.3s ease-in-out;
}

img:hover {
  opacity: 0.95;
}

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
</style>

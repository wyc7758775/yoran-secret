<template>
  <div>
    <ObservingList v-show="!showDetail" @open="navigateToDetail" />
    <ObservingDetail
      v-show="showDetail"
      @close="showDetail = false"
      :src="currentArticleSrc"
    ></ObservingDetail>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ObservingDetail from "./ObservingDetail.vue";
import ObservingList from "./ObservingList.vue";

const showDetail = ref(false);
const currentArticleSrc = ref("");
// 路由跳转函数
const navigateToDetail = (article) => {
  showDetail.value = !showDetail.value;
  currentArticleSrc.value = article.src;
};
</script>

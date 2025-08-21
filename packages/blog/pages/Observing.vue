<template>
  <div class="slide-fade">
    <ObservingList v-show="!showDetail" @open="navigateToDetail" />
    <ObservingDetail
      v-show="showDetail"
      @close="handleClose"
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
const listScrollPosition = ref(0);

const saveListScrollPosition = () => {
  listScrollPosition.value = window.scrollY;
};

// 恢复列表页滚动位置
const restoreListScrollPosition = () => {
  window.scrollTo({ top: listScrollPosition.value, behavior: "instant" });
};

const navigateToDetail = (article) => {
  saveListScrollPosition();

  showDetail.value = true;
  currentArticleSrc.value = article.src;
};

const handleClose = () => {
  showDetail.value = false;
  restoreListScrollPosition();
};
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const profileImageLoaded = ref(false)
const profileImageRef = ref<HTMLImageElement | null>(null)
const loadingProfileImageStyle = {
  opacity: 0,
  filter: 'blur(18px)',
  transform: 'scale(1.03)',
}
const loadedProfileImageStyle = {
  opacity: 1,
  filter: 'blur(0)',
  transform: 'scale(1)',
}

function handleProfileImageLoad() {
  profileImageLoaded.value = true
}

onMounted(() => {
  if (profileImageRef.value?.complete) {
    handleProfileImageLoad()
  }
})
</script>

<template>
  <div class="slide-fade flex items-center justify-center">
    <div class="max-w-[650px]">
      <!-- 姓名 -->
      <div class="max-w-[650px] flex flex-col ml-0">
        <div class="text-[2.5rem] font-bold">
          Hey, I'm Yoran
        </div>
        <span class="text-[1rem] opacity-80 mb-[2rem] mt-[1rem]">
          My name is pronounced as /dʒɛn'haʊ/
        </span>
      </div>

      <!-- 个人照片 -->
      <div
        class="profile-photo-frame max-w-[400px] mx-auto mb-[2rem] overflow-hidden border-4 border-solid border-[#333] dark:border-primary-50"
      >
        <div
          v-if="!profileImageLoaded"
          class="profile-photo-skeleton"
          aria-hidden="true"
        />
        <img
          ref="profileImageRef"
          src="https://yoran-images-1256970527.cos.ap-guangzhou.myqcloud.com/handsome.jpg"
          alt="Yoran"
          loading="lazy"
          decoding="async"
          class="profile-photo w-full h-full object-cover"
          :style="profileImageLoaded ? loadedProfileImageStyle : loadingProfileImageStyle"
          @load="handleProfileImageLoad"
          @error="handleProfileImageLoad"
        >
      </div>

      <!-- info -->
      <div class="profile-bio">
        <p class="text">
          I am a software engineer based in ShenZheng. I am currently working at
          OPPO, having 8 years of font-end development experience.
        </p>
        <p class="text">
          This website is my humble abode on the internet, where I pen my
          musings in
          <span
            class="highlight highlight:dark link-btn hover:bg-red-500 cursor-pointer"
          >here</span>
          about software development, specifically JavaScript, TypeScript and
          web technologies in general.
        </p>
        <p class="text">
          My motto is:
          <span class="text-[1.2rem] font-bold">
            "How you spend every day is how you spend your life."</span>
        </p>
        <h3 class="pt-[1rem]">
          Contact
        </h3>
        <p class="text">
          If you enjoy my content, consider subscribing to my
          <a class="highlight highlight:dark" href="/yoran-secret/rss.xml">RSS feed</a>
          . If you feel so inclined, you're welcome to
          <span
            class="highlight highlight:dark cursor-pointer relative inline-block group"
          >
            buy me a coffee.
            <!-- 支付宝收款码悬浮框 -->
            <span class="tooltip-base tooltip-visibility tooltip-arrow">
              <img
                src="https://yoran-images-1256970527.cos.ap-guangzhou.myqcloud.com/alipay-qrcode.jpg"
                alt="支付宝收款码"
                class="w-[200px] h-[200px] object-contain"
              >
              <span class="mt-2 text-sm text-gray-800 text-center">thank you!</span>
            </span>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding-top: 2rem;
  display: flex;
  flex-direction: wrap;
  align-items: center;
  justify-content: center;
}
.text {
  line-height: 2.2rem;
  font-size: 1rem;
}

.profile-bio {
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 650px;
  margin: 0 auto;
}

.profile-bio p {
  margin-bottom: 1rem;
}

.profile-photo-frame {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #f2f2f2;
}

.profile-photo-skeleton {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgb(255 255 255 / 0) 0%, rgb(255 255 255 / 0.7) 50%, rgb(255 255 255 / 0) 100%),
    linear-gradient(135deg, #e5e7eb 0%, #f6f6f6 45%, #dedede 100%);
  background-size: 220% 100%, 100% 100%;
  animation: photo-skeleton-shimmer 1.4s ease-in-out infinite;
}

.profile-photo {
  position: relative;
  z-index: 1;
  display: block;
  transition:
    opacity 500ms ease,
    filter 700ms ease,
    transform 700ms ease;
}

.dark .profile-photo-frame {
  background: #1f2937;
}

.dark .profile-photo-skeleton {
  background:
    linear-gradient(90deg, rgb(255 255 255 / 0) 0%, rgb(255 255 255 / 0.13) 50%, rgb(255 255 255 / 0) 100%),
    linear-gradient(135deg, #1f2937 0%, #2c3544 45%, #161b22 100%);
  background-size: 220% 100%, 100% 100%;
}

@keyframes photo-skeleton-shimmer {
  from {
    background-position: 120% 0, 0 0;
  }

  to {
    background-position: -120% 0, 0 0;
  }
}
</style>

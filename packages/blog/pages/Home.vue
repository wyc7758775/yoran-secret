<template>
  <div class="slide-fade flex items-center justify-center" v-once>
    <div class="max-w-[650px]">
      <!-- 姓名 -->
      <div class="max-w-[650px] flex flex-col ml-0">
        <div class="text-[2.5rem] font-bold">Hey, I'm Yoran</div>
        <span class="text-[1rem] opacity-80 mb-[2rem] mt-[1rem]">
          My name is pronounced as /dʒɛn'haʊ/
        </span>
      </div>

      <!-- 个人照片 -->
      <div
        class="max-w-[400px] mx-auto mb-[2rem] overflow-hidden border-4 border-solid border-[#333] dark:border-primary-50"
      >
        <img
          src="https://yoran-images-1256970527.cos.ap-guangzhou.myqcloud.com/handsome.jpg"
          alt="Yoran"
          class="w-full h-full object-cover"
        />
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
            >here</span
          >
          about software development, specifically JavaScript, TypeScript and
          web technologies in general.
        </p>
        <p class="text">
          My motto is:
          <span class="text-[1.2rem] font-bold">
            "How you spend every day is how you spend your life."</span
          >
        </p>
        <h3 class="pt-[1rem]">Contact</h3>
        <p class="text">
          If you enjoy my content, consider subscribing to my
          <a class="highlight highlight:dark" href="/yoran-secret/rss.xml"
            >RSS feed</a
          >
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
              />
              <span class="mt-2 text-sm text-gray-800 text-center"
                >thank you!</span
              >
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
  font-family: "monospace";
  display: flex;
  flex-direction: wrap;
  align-items: center;
  justify-content: center;
}
.text {
  line-height: 2.2rem;
  font: 100% / 1.75 iA Quattro, ui-monospace, SFMono-Regular, Menlo, Monaco,
    Consolas, Liberation Mono, Courier New, monospace;
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
</style>

<script setup></script>
<template>
  <div class="home">
    <div class="box">
      <h1 class="profile-title">Hey, I'm Yoran</h1>
      <p class="profile-pronunciation">My name is pronounced as /dʒɛn'haʊ/</p>

      <div class="profile-image-container">
        <img src="/assets/handsome.jpg" alt="Zhenghao" class="profile-image" />
      </div>

      <div class="profile-bio">
        <p class="text">
          I am a software engineer based in ShenZheng. I am currently working at
          OPPO, having 8 years of font-end development experience.
        </p>
        <p class="text">
          This website is my humble abode on the internet, where I pen my
          musings in
          <span class="highlight link-btn hover:bg-red-500">here</span> about
          software development, specifically JavaScript, TypeScript and web
          technologies in general.
        </p>
        <h3 style="padding-top: 3rem">Contact</h3>
        <p class="text">
          If you enjoy my content, consider subscribing to my RSS feed. If you
          feel so inclined, you're welcome to buy me a coffee.
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.home {
  padding-top: 2rem;
  animation: fadeIn 1s ease-in;
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

.profile-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.profile-pronunciation {
  font-size: 1rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}
.profile-image-container {
  max-width: 400px;
  margin: 0 auto 2rem;
  overflow: hidden;
  border: 4px solid #333;
  @apply dark:border-primary-50;
}
.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.highlight {
  border-radius: 0.225rem;
  background-color: #d1e8f3ed;
  padding: 0 0.25rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

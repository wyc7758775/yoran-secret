<script setup>
const tools = [
  {
    title: 'PDF 转图片',
    description: '批量把 PDF 页面导出为 PNG、JPEG 或 WebP 图片。',
    status: 'Ready',
    link: '/yoran-secret/tools/pdf-to-images',
  },
  {
    title: 'Smart Commit',
    description: '同步我在 zettlab-mini-nas 中使用的提交与 PR 工作流 skill。',
    status: 'Ready',
    link: '/yoran-secret/tools/smart-commit',
  },
  {
    title: 'Frontend',
    description: '放前端开发里常用的转换、检查和调试工具。',
    status: 'Planning',
  },
  {
    title: 'Markdown',
    description: '整理写作、发布和内容处理相关的小工具。',
    status: 'Planning',
  },
]
</script>

<template>
  <main class="tools-page">
    <header class="tools-header">
      <p class="tools-kicker">
        Tools
      </p>
      <h1>工具箱</h1>
      <p class="tools-intro">
        一些会慢慢长出来的小工具。
      </p>
    </header>

    <section class="tools-grid">
      <article
        v-for="tool in tools"
        :key="tool.title"
        class="tool-card"
      >
        <a
          v-if="tool.link"
          class="tool-card-link"
          :href="tool.link"
        >
          <h2>{{ tool.title }}</h2>
          <p>{{ tool.description }}</p>
          <span>{{ tool.status }}</span>
        </a>
        <div v-else class="tool-card-link">
          <h2>{{ tool.title }}</h2>
          <p>{{ tool.description }}</p>
          <span>{{ tool.status }}</span>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.tools-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 24px 96px;
  color: var(--vp-c-text-1);
}

.tools-header {
  margin-bottom: 32px;
}

.tools-kicker {
  margin: 0 0 8px;
  color: #e06c75;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 13px;
  text-transform: uppercase;
}

.tools-header h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
}

.tools-intro {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.tool-card {
  min-height: 168px;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.tool-card:hover {
  border-color: #e06c75;
  transform: translateY(-2px);
}

.tool-card-link {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px;
  color: inherit;
  text-decoration: none;
}

.tool-card h2 {
  margin: 0 0 10px;
  font-size: 18px;
}

.tool-card p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.tool-card span {
  align-self: flex-start;
  margin-top: 20px;
  padding: 2px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  color: var(--vp-c-text-2);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
}

.dark .tools-kicker {
  color: #ff9e9e;
}

.dark .tool-card:hover {
  border-color: #ff9e9e;
}

@media (max-width: 720px) {
  .tools-page {
    padding: 24px 16px 72px;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>

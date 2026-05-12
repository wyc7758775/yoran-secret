<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import BackToTop from './components/BackToTop.vue'
import TocSidebar from './components/TocSidebar.vue'
import useMdRender from './use-md-render'

const props = defineProps<{
  src: string
}>()

const { mdRender } = useMdRender()
const renderedContent = ref('')
const contentLoading = ref(true)
const isVisibleToc = ref(false)
const baseUrl = import.meta.env.BASE_URL || '/'

function resolveBasePaths(html: string): string {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`

  return html
    .replace(/<img([^>]*)\ssrc="(\/[^"]*)"/g, (match, attrs, src) => {
      if (src.startsWith('//')) return match
      return `<img${attrs} src="${base}${src.slice(1)}"`
    })
    .replace(/<a([^>]*)\shref="(\/[^"]*)"/g, (match, attrs, href) => {
      if (href.startsWith('//')) return match
      return `<a${attrs} href="${base}${href.slice(1)}"`
    })
}

function bindImageLoadEvents() {
  if (typeof document === 'undefined')
    return

  const images = document.querySelectorAll('.md-img')
  images.forEach((img) => {
    const imageEl = img as HTMLImageElement
    if (imageEl.complete && imageEl.naturalHeight !== 0) {
      imageEl.classList.add('loaded')
    }
    else {
      imageEl.addEventListener('load', () => {
        imageEl.classList.add('loaded')
      }, { once: true })
      imageEl.addEventListener('error', () => {
        imageEl.classList.add('loaded')
      }, { once: true })
    }
  })
}

function stripFrontmatter(markdownContent: string) {
  return markdownContent.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

async function loadAndRenderMarkdown() {
  try {
    contentLoading.value = true
    const markdownFiles = (import.meta as any).glob('../.vitepress/attachments/*.md', {
      query: '?raw',
      import: 'default',
    })
    const fileKey = Object.keys(markdownFiles).find(key => key.endsWith(`/${props.src}.md`))

    if (!fileKey) {
      renderedContent.value = '<p>未找到对应附件内容</p>'
      return
    }

    const markdownContent = await markdownFiles[fileKey]()
    renderedContent.value = resolveBasePaths(mdRender(stripFrontmatter(markdownContent)))
  }
  catch (error) {
    console.error('加载附件失败:', error)
    renderedContent.value = `<p>加载附件失败: ${(error as Error).message}</p>`
  }
  finally {
    contentLoading.value = false
    await nextTick()
    bindImageLoadEvents()
  }
}

function handleMouseLeave() {
  isVisibleToc.value = false
}

function handleMouseEnter() {
  isVisibleToc.value = true
}

onMounted(() => {
  loadAndRenderMarkdown()
})

watch(
  () => props.src,
  () => {
    loadAndRenderMarkdown()
  },
)
</script>

<template>
  <div class="attachment-page">
    <div
      v-if="contentLoading"
      class="attachment-loading"
    >
      加载中...
    </div>
    <article
      v-else
      class="md-prose markdown-body attachment-content"
      @mouseleave="handleMouseLeave"
      @mouseenter="handleMouseEnter"
      v-html="renderedContent"
    />
  </div>
  <BackToTop />
  <TocSidebar :is-visible-toc="isVisibleToc" :content="renderedContent" />
</template>

<style scoped>
.attachment-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 24px 96px;
}

.attachment-loading {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.attachment-content {
  max-width: none;
}
</style>

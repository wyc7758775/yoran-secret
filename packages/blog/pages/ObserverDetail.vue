<script setup lang="ts">
import { ElImageViewer } from 'element-plus'
import { useData } from 'vitepress'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
// @ts-expect-error generated route data has no type declaration
import RawObserverData from '../.vitepress/router/observer.js'
import ArticleSkeleton from './components/ArticleSkeleton.vue'
import BackToTop from './components/BackToTop.vue'
import GiscusComment from './components/GiscusComment.vue'
import TocSidebar from './components/TocSidebar.vue'
import { useNavToStatic } from './hooks/use-nav-to-static'
import useMdRender from './use-md-render'

useNavToStatic({ hideOnMobileScroll: true })
const { page } = useData()
const ObserverData = RawObserverData as Array<{ src: string, slug?: string }>

// 使用ref存储路径信息，默认值从page.params获取
const pathFromUrl = ref(page.value?.params?.src || '')
const articlePathError = ref('')

const visibleViewer = ref(false)
const viewerList = ref<string[]>([])

const isVisibleToc = ref(false)
const tocHideDelay = 450
let tocHideTimer: ReturnType<typeof setTimeout> | undefined

function clearTocHideTimer() {
  if (tocHideTimer) {
    clearTimeout(tocHideTimer)
    tocHideTimer = undefined
  }
}

function showToc() {
  clearTocHideTimer()
  isVisibleToc.value = true
}

function scheduleHideToc() {
  clearTocHideTimer()
  tocHideTimer = setTimeout(() => {
    isVisibleToc.value = false
    tocHideTimer = undefined
  }, tocHideDelay)
}

function getArticleSrcBySlug(slug: string) {
  return ObserverData.find(article => article.slug === slug)?.src || ''
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
    }

    return entities[char]
  })
}

// 获取路由器上面的链接，由于是通过中文来获取的，所以需要下面一下特殊的处理
function getPathFromUrl() {
  try {
    if (typeof window !== 'undefined') {
      articlePathError.value = ''
      const fullPath = window.location.pathname
      const basePath = '/yoran-secret' // 从vitepress配置中获取的base路径
      let pathWithoutBase = fullPath

      if (fullPath.startsWith(basePath)) {
        pathWithoutBase = fullPath.substring(basePath.length)
      }
      const pathParts = pathWithoutBase.split('/').filter(Boolean)

      const mdIndex = pathParts.findIndex(part => part.includes('.md'))
      const observerIndex = pathParts.findIndex(part => part === 'observer')
      const legacyLifeIndex = pathParts.findIndex(part => part === 'life')
      const contentIndex = observerIndex >= 0 ? observerIndex : legacyLifeIndex

      let extractedPath = ''
      if (mdIndex >= 0) {
        extractedPath = pathParts.slice(Math.max(0, contentIndex)).join('/')
      }
      else if (contentIndex >= 0) {
        extractedPath = pathParts.slice(contentIndex).join('/')
      }

      // 优先使用URL参数中的src
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('slug')) {
        const slug = urlParams.get('slug') || ''
        extractedPath = getArticleSrcBySlug(slug)
        if (!extractedPath) {
          articlePathError.value = `未找到对应的文章: ${escapeHtml(slug)}`
        }
      }
      else if (urlParams.has('src')) {
        extractedPath = urlParams.get('src') || ''
      }

      if (extractedPath) {
        pathFromUrl.value = extractedPath
      }
    }
  }
  catch (error) {
    console.error('解析URL路径失败:', error)
  }
}
function handleViewerList() {
  if (typeof window === 'undefined')
    return

  document?.addEventListener('click', (e: Event) => {
    if (e.target instanceof HTMLImageElement) {
      viewerList.value = [e?.target?.src || '']
      visibleViewer.value = true
    }
  })
}
// 在客户端挂载后才尝试访问window对象
onMounted(() => {
  getPathFromUrl()
  handleViewerList()
})

onUnmounted(() => {
  clearTocHideTimer()
})

const articleSrc = computed(() => {
  // 优先使用客户端获取的路径，其次使用page.params
  if (pathFromUrl.value) {
    return pathFromUrl.value
  }

  const pageSrc = page.value?.params?.src
  if (pageSrc) {
    return pageSrc
  }

  // 都没有获取到，返回空字符串
  return ''
})

const { mdRender } = useMdRender()
const baseUrl = import.meta.env.BASE_URL || '/'

function resolveBasePaths(html: string): string {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`

  return html
    .replace(/<img([^>]*)\ssrc="(\/[^"]*)"/g, (match, attrs, src) => {
      if (src.startsWith('//'))
        return match

      return `<img${attrs} src="${base}${src.slice(1)}"`
    })
    .replace(/<a([^>]*)\shref="(\/[^"]*)"/g, (match, attrs, href) => {
      if (href.startsWith('//'))
        return match

      return `<a${attrs} href="${base}${href.slice(1)}"`
    })
}

function getFileInfo(src: string) {
  const pathParts = src.split('/')
  const fileName = pathParts[pathParts.length - 1]
  const baseName = fileName.replace('.md', '')

  return {
    fileName,
    baseName,
  }
}

function getFileKey(markdownFiles: any) {
  const { fileName, baseName } = getFileInfo(articleSrc.value)
  let fileKey = Object.keys(markdownFiles).find((key) => {
    return key.includes(baseName) || key.includes(fileName)
  })

  // 如果找不到完全匹配的，尝试部分匹配
  if (!fileKey) {
    fileKey = Object.keys(markdownFiles).find(key =>
      key.toLowerCase().includes(baseName.toLowerCase()),
    )
  }

  return fileKey
}

const renderedContent = ref('')
const contentLoading = ref(true)

function stripFrontmatter(markdownContent: string) {
  return markdownContent.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

// 解析和渲染Markdown文件
async function loadAndRenderMarkdown() {
  if (!articleSrc.value) {
    renderedContent.value = articlePathError.value
      ? `<p>${articlePathError.value}</p>`
      : '<p>未提供文章路径</p>'
    contentLoading.value = false
    return
  }

  try {
    contentLoading.value = true

    const { fileName } = getFileInfo(articleSrc.value)

    const markdownFiles = (import.meta as any).glob('../observer/*.md', {
      query: '?raw',
      import: 'default',
    })
    const fileKey = getFileKey(markdownFiles)

    if (fileKey) {
      const markdownContent = await markdownFiles[fileKey]()
      renderedContent.value = resolveBasePaths(mdRender(stripFrontmatter(markdownContent)))
    }
    else {
      renderedContent.value = `<p>未找到对应的文章内容: ${escapeHtml(fileName)}</p>`
    }
  }
  catch (error) {
    console.error('加载Markdown文件失败:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    renderedContent.value = `<p>加载文章内容失败: ${escapeHtml(errorMessage)}</p>`
  }
  finally {
    contentLoading.value = false
    await nextTick()
    bindImageLoadEvents()
  }
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

watch(
  () => articleSrc.value,
  () => {
    loadAndRenderMarkdown()
  },
  { immediate: true },
)
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div
      class="flex flex-col md:flex-row justify-center items-start mx-auto mt-6 sm:px-6 lg:px-8 w-full"
    >
      <div
        v-if="contentLoading"
        class="w-full min-h-[100vh] py-6"
      >
        <ArticleSkeleton />
      </div>
      <div
        v-else
        class="w-full md:w-7/10"
        @mouseleave="scheduleHideToc"
        @mouseenter="showToc"
      >
        <div
          class="md-prose max-w-none prose-sm sm:prose base:text-sm sm:text-base md:text-lg prose-img:center"
          v-html="renderedContent"
        />
        <GiscusComment mapping="url" />
      </div>
    </div>
  </div>
  <BackToTop />
  <TocSidebar
    :is-visible-toc="isVisibleToc"
    :content="renderedContent"
    @toc-enter="showToc"
    @toc-leave="scheduleHideToc"
  />
  <ElImageViewer
    v-if="visibleViewer"
    :url-list="viewerList"
    @close="visibleViewer = false"
  />
</template>

<style scoped>
/* 添加内容区域图片居中样式 */
</style>

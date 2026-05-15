<script setup lang="ts">
import { ElImageViewer } from 'element-plus'
import { useData } from 'vitepress'
import GiscusComment from './components/GiscusComment.vue'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import ArticleSkeleton from './components/ArticleSkeleton.vue'
import BackToTop from './components/BackToTop.vue'
import { useNavToStatic } from './hooks/use-nav-to-static'
import useMdRender from './use-md-render'

useNavToStatic()
const { page } = useData()

const pathFromUrl = ref(page.value?.params?.src || '')
const hasMounted = ref(false)

const visibleViewer = ref(false)
const viewerList = ref<string[]>([])

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

onMounted(() => {
  hasMounted.value = true
  getPathFromUrl()
  handleViewerList()
  loadAndRenderMarkdown()
})

function getArticlePathFromLocation() {
  try {
    if (typeof window !== 'undefined') {
      const fullPath = window.location.pathname
      const basePath = '/yoran-secret'
      let pathWithoutBase = fullPath

      if (fullPath.startsWith(basePath)) {
        pathWithoutBase = fullPath.substring(basePath.length)
      }
      const pathParts = pathWithoutBase.split('/').filter(Boolean)

      const articleIndex = pathParts.findIndex(part => /\.(md|html)$/i.test(part))
      const diaryIndex = pathParts.findIndex(part => part === 'diary')

      let extractedPath = ''
      if (articleIndex >= 0) {
        extractedPath = pathParts.slice(Math.max(0, diaryIndex)).join('/')
      }
      else if (diaryIndex >= 0) {
        extractedPath = pathParts.slice(diaryIndex).join('/')
      }

      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('src')) {
        extractedPath = urlParams.get('src') || ''
      }

      return extractedPath
    }
  }
  catch (error) {
    console.error('解析URL路径失败:', error)
  }

  return ''
}

function getPathFromUrl() {
  const extractedPath = getArticlePathFromLocation()
  if (extractedPath) {
    pathFromUrl.value = extractedPath
  }
}

const articleSrc = computed(() => {
  if (pathFromUrl.value) {
    return pathFromUrl.value
  }

  const pageSrc = page.value?.params?.src
  if (pageSrc) {
    console.log('从page.params获取到src:', pageSrc)
    return pageSrc
  }

  return ''
})

const { mdRender } = useMdRender()
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
    .replace(/<link([^>]*)\shref="(\/[^"]*)"/g, (match, attrs, href) => {
      if (href.startsWith('//')) return match
      return `<link${attrs} href="${base}${href.slice(1)}"`
    })
}

function getFileInfo(src: string) {
  const pathParts = src.split('/')
  const fileName = pathParts[pathParts.length - 1]
  const baseName = fileName.replace(/\.(md|html)$/i, '')

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

  if (!fileKey) {
    fileKey = Object.keys(markdownFiles).find(key =>
      key.toLowerCase().includes(baseName.toLowerCase()),
    )
  }

  return fileKey
}

const renderedContent = ref('')
const contentLoading = ref(true)

function stripArticleMetadata(articleContent: string) {
  return articleContent
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    .replace(/<!--\s*date:\s*[\s\S]*?-->\r?\n?/, '')
}

function isHtmlArticle(src: string) {
  return /\.html$/i.test(src)
}

async function loadAndRenderMarkdown() {
  if (!articleSrc.value) {
    renderedContent.value = '<p>未提供文章路径</p>'
    contentLoading.value = false
    return
  }

  try {
    contentLoading.value = true

    const { fileName } = getFileInfo(articleSrc.value)

    const articleFiles = {
      ...(import.meta as any).glob('../diary/*.md', {
        query: '?raw',
        import: 'default',
      }),
      ...(import.meta as any).glob('../diary/*.html', {
        query: '?raw',
        import: 'default',
      }),
    }
    const fileKey = getFileKey(articleFiles)

    if (fileKey) {
      const articleContent = await articleFiles[fileKey]()
      const contentWithoutMetadata = stripArticleMetadata(articleContent)
      renderedContent.value = isHtmlArticle(fileName)
        ? resolveBasePaths(contentWithoutMetadata)
        : resolveBasePaths(mdRender(contentWithoutMetadata))
    }
    else {
      renderedContent.value = `<p>未找到对应的文章内容: ${fileName}</p>`
    }
  }
  catch (error) {
    console.error('加载文章文件失败:', error)
    renderedContent.value = `<p>加载文章内容失败: ${error.message}</p>`
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
    if (hasMounted.value) {
      loadAndRenderMarkdown()
    }
  },
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
  <ElImageViewer
    v-if="visibleViewer"
    :url-list="viewerList"
    @close="visibleViewer = false"
  />
</template>

<style scoped>
</style>

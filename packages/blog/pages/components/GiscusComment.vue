<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{
  mapping: 'pathname' | 'url' | 'title'
}>()

const containerRef = ref<HTMLDivElement>()
const { isDark } = useData()

function loadGiscus() {
  const container = containerRef.value
  if (!container || typeof document === 'undefined') return

  container.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'wyc7758775/yoran-secret')
  script.setAttribute('data-repo-id', 'R_kgDOPZ1Rtg')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDOPZ1Rts4C8L8e')
  script.setAttribute('data-mapping', props.mapping)
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true

  container.appendChild(script)
}

onMounted(() => {
  loadGiscus()
})

watch(isDark, () => {
  loadGiscus()
})
</script>

<template>
  <div ref="containerRef" class="giscus-wrapper mt-10 pt-6 border-t border-[var(--vp-c-divider)]" />
</template>

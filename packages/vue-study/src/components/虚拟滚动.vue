<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

// 文件类型接口
interface FileItem {
  id: number
  name: string
  type: string
  size: number
  date: Date
}

// 响应式数据
const scrollContainer = ref<HTMLElement>()
const searchQuery = ref('')
const selectedFile = ref<FileItem | null>(null)
const scrollTop = ref(0)

// 图标预加载相关状态
const iconsLoaded = ref(false)
const loadedIconsCount = ref(0)
const totalIconsCount = ref(0)
const iconCache = ref<Record<string, boolean>>({})

// 虚拟滚动配置
const itemHeight = 120 // 每个文件项的高度
const itemsPerRow = 5 // 每行显示的文件数
const containerHeight = 600 // 容器高度
const bufferSize = 2 // 缓冲行数

// 图标映射
const iconMap: Record<string, string> = {
  pdf: '/src/assets/pdf.svg',
  doc: '/src/assets/doc.svg',
  xls: '/src/assets/xls.svg',
  ppt: '/src/assets/ppt.svg',
  txt: '/src/assets/txt.svg',
  jpg: '/src/assets/jpg.svg',
  png: '/src/assets/png.svg',
  mp4: '/src/assets/mp4.svg',
  zip: '/src/assets/zip.svg',
}

// 预加载所有图标
async function preloadIcons() {
  const iconTypes = Object.keys(iconMap)
  totalIconsCount.value = iconTypes.length
  loadedIconsCount.value = 0

  const loadPromises = iconTypes.map(async (type) => {
    return new Promise<void>((resolve) => {
      const img = new Image()

      img.onload = () => {
        iconCache.value[type] = true
        loadedIconsCount.value++
        resolve()
      }

      img.onerror = () => {
        console.warn(`❌ 图标 ${type} 加载失败，使用默认图标`)
        iconCache.value[type] = false
        loadedIconsCount.value++
        resolve() // 即使失败也继续，不阻塞其他图标
      }

      // 设置超时机制
      setTimeout(() => {
        if (!iconCache.value[type]) {
          console.warn(`⏰ 图标 ${type} 加载超时`)
          iconCache.value[type] = false
          loadedIconsCount.value++
          resolve()
        }
      }, 5000) // 5秒超时

      img.src = iconMap[type]
    })
  })

  try {
    await Promise.all(loadPromises)
    iconsLoaded.value = true
  }
  catch (error) {
    console.error('图标预加载过程中出现错误:', error)
    iconsLoaded.value = true // 即使有错误也允许继续使用
  }
}

// 生成测试数据
function generateTestData(): FileItem[] {
  const fileTypes = ['pdf', 'doc', 'xls', 'ppt', 'txt', 'jpg', 'png', 'mp4', 'zip']
  const fileNames = [
    '项目报告',
    '会议纪要',
    '数据分析',
    '产品介绍',
    '用户手册',
    '技术文档',
    '设计稿',
    '演示文稿',
    '财务报表',
    '合同文件',
    '培训资料',
    '操作指南',
    '需求文档',
    '测试报告',
    '系统架构',
    '代码规范',
    '接口文档',
    '部署指南',
    '维护手册',
    '用户反馈',
  ]

  const files: FileItem[] = []

  for (let i = 1; i <= 1000; i++) {
    const type = fileTypes[Math.floor(Math.random() * fileTypes.length)]
    const baseName = fileNames[Math.floor(Math.random() * fileNames.length)]
    const name = `${baseName}_${i.toString().padStart(3, '0')}.${type}`
    const size = Math.floor(Math.random() * 10000000) + 1000 // 1KB - 10MB
    const date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // 过去一年内的随机日期

    files.push({
      id: i,
      name,
      type,
      size,
      date,
    })
  }

  return files
}

const files = ref<FileItem[]>(generateTestData())

// 过滤后的文件列表
const filteredFiles = computed(() => {
  if (!searchQuery.value)
    return files.value
  return files.value.filter(file =>
    file.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// 计算总行数
const totalRows = computed(() => Math.ceil(filteredFiles.value.length / itemsPerRow))

// 计算总高度
const totalHeight = computed(() => totalRows.value * itemHeight)

// 计算可见行数
const visibleRowCount = computed(() => Math.ceil(containerHeight / itemHeight) + bufferSize * 2)

// 计算开始索引
const startIndex = computed(() => {
  const startRow = Math.max(0, Math.floor(scrollTop.value / itemHeight) - bufferSize)
  return startRow
})

// 计算结束索引
const endIndex = computed(() => {
  return Math.min(totalRows.value, startIndex.value + visibleRowCount.value)
})

// 计算偏移量
const offsetY = computed(() => startIndex.value * itemHeight)

// 计算可见行数据
const visibleRows = computed(() => {
  const rows: FileItem[][] = []

  for (let i = startIndex.value; i < endIndex.value; i++) {
    const row: FileItem[] = []
    for (let j = 0; j < itemsPerRow; j++) {
      const fileIndex = i * itemsPerRow + j
      if (fileIndex < filteredFiles.value.length) {
        row.push(filteredFiles.value[fileIndex])
      }
    }
    if (row.length > 0) {
      rows.push(row)
    }
  }

  return rows
})

// 获取文件图标
function getFileIcon(type: string): string {
  return iconMap[type] || '/src/assets/unknown.svg'
}

// 处理图标加载错误
function handleIconError(event: Event) {
  const img = event.target as HTMLImageElement
  console.warn(`图标加载失败: ${img.src}`)
  // 可以设置默认图标
  img.src = '/src/assets/unknown.svg'
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`
}

// 格式化日期
function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 处理滚动事件
function handleScroll(event: Event) {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
}

// 选择文件
function selectFile(file: FileItem) {
  selectedFile.value = file
}

// 组件挂载后设置容器高度并预加载图标
onMounted(async () => {
  if (scrollContainer.value) {
    scrollContainer.value.style.height = `${containerHeight}px`
  }

  // 开始预加载图标
  await preloadIcons()
})
</script>

<template>
  <div class="file-preview-container">
    <h2>文件预览 ({{ files.length }} 个文件)</h2>

    <!-- 图标预加载状态 -->
    <div v-if="!iconsLoaded" class="loading-indicator">
      <div class="loading-spinner" />
      <span>正在预加载图标... ({{ loadedIconsCount }}/{{ totalIconsCount }})</span>
    </div>

    <!-- 搜索框 -->
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索文件名..."
        class="search-input"
        :disabled="!iconsLoaded"
      >
    </div>

    <!-- 虚拟滚动容器 -->
    <div
      ref="scrollContainer"
      class="scroll-container"
      :class="{ loading: !iconsLoaded }"
      @scroll="handleScroll"
    >
      <!-- 占位空间 -->
      <div :style="{ height: `${totalHeight}px` }" class="spacer">
        <!-- 可见区域 -->
        <div
          :style="{ transform: `translateY(${offsetY}px)` }"
          class="visible-area"
        >
          <div
            v-for="(row, rowIndex) in visibleRows"
            :key="startIndex + rowIndex"
            class="file-row"
          >
            <div
              v-for="file in row"
              :key="file.id"
              class="file-item"
              :class="{ selected: selectedFile?.id === file.id }"
              @click="selectFile(file)"
            >
              <div class="file-icon">
                <!-- 使用预加载的图标或显示加载状态 -->
                <img
                  v-if="iconsLoaded || iconCache[file.type]"
                  :src="getFileIcon(file.type)"
                  :alt="file.type"
                  @error="handleIconError"
                >
                <div v-else class="icon-placeholder">
                  <div class="placeholder-spinner" />
                </div>
              </div>
              <div class="file-info">
                <div class="file-name" :title="file.name">
                  {{ file.name }}
                </div>
                <div class="file-size">
                  {{ formatFileSize(file.size) }}
                </div>
                <div class="file-date">
                  {{ formatDate(file.date) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件详情 -->
    <div v-if="selectedFile" class="file-details">
      <h3>文件详情</h3>
      <p><strong>名称:</strong> {{ selectedFile.name }}</p>
      <p><strong>类型:</strong> {{ selectedFile.type }}</p>
      <p><strong>大小:</strong> {{ formatFileSize(selectedFile.size) }}</p>
      <p><strong>修改时间:</strong> {{ formatDate(selectedFile.date) }}</p>
    </div>
  </div>
</template>

<style scoped>
.file-preview-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 加载指示器样式 */
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background-color: #f0f8ff;
  border: 1px solid #b3d9ff;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #1976d2;
  font-weight: 500;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e3f2fd;
  border-top: 2px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 图标占位符样式 */
.icon-placeholder {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  border: 1px dashed #ccc;
}

.placeholder-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #999;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.search-input:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.scroll-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow-y: auto;
  position: relative;
  background-color: #fafafa;
  transition: opacity 0.3s ease;
}

.scroll-container.loading {
  opacity: 0.7;
  pointer-events: none;
}

.spacer {
  position: relative;
}

.visible-area {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.file-row {
  display: flex;
  gap: 10px;
  padding: 10px;
  height: 120px;
}

.file-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 0;
}

.file-item:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
  transform: translateY(-2px);
}

.file-item.selected {
  border-color: #1976d2;
  background-color: #e3f2fd;
}

.file-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.file-info {
  text-align: center;
  width: 100%;
}

.file-name {
  font-weight: 500;
  font-size: 12px;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.file-size {
  font-size: 10px;
  color: #666;
  margin-bottom: 2px;
}

.file-date {
  font-size: 10px;
  color: #999;
}

.file-details {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.file-details h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.file-details p {
  margin: 8px 0;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-row {
    gap: 5px;
    padding: 5px;
  }

  .file-item {
    padding: 8px;
  }

  .file-name {
    font-size: 11px;
  }

  .file-size,
  .file-date {
    font-size: 9px;
  }

  .loading-indicator {
    flex-direction: column;
    text-align: center;
  }
}
</style>

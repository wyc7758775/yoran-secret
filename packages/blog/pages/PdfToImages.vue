<script setup>
import { Download, FolderOpened, Refresh, UploadFilled } from '@element-plus/icons-vue'
import mupdfWasmUrl from '@mupdf-wasm?url'
import { ElIcon } from 'element-plus'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

let fileId = 0
let mupdfModule = null
let mupdfLoadPromise = null
let crcTable = null
let queueDbPromise = null

const queueDbName = 'yoran-pdf-to-images'
const queueStoreName = 'pending-files'

const pdfFiles = ref([])
const isDragging = ref(false)
const isConverting = ref(false)
const cancelRequested = ref(false)
const isRuntimeLoading = ref(false)
const runtimeLoadingText = ref('')
const zipProgress = ref(0)
const fileInput = ref(null)

const settings = reactive({
  format: 'png',
  qualityPreset: 'standard',
  customDpi: 220,
  quality: 92,
  pageMode: 'all',
  pageStart: null,
  pageEnd: null,
  flatAllZip: false,
})

const readyFiles = computed(() => pdfFiles.value.filter(isConvertibleFile))
const convertedFiles = computed(() => pdfFiles.value.filter(file => file.results.length))
const totalPages = computed(() => pdfFiles.value.reduce((total, file) => total + Number(file.pageCount || 0), 0))
const convertedPages = computed(() => pdfFiles.value.reduce((total, file) => total + file.results.length, 0))
const canConvert = computed(() => readyFiles.value.length > 0 && !isConverting.value)
const canDownloadAll = computed(() => convertedFiles.value.length > 0 && !isConverting.value)

const formatOptions = [
  { label: 'PNG', value: 'png' },
  { label: 'JPEG', value: 'jpeg' },
  { label: 'WebP', value: 'webp' },
]

const qualityOptions = [
  { label: '省空间', value: 'compact', dpi: 96 },
  { label: '标准', value: 'standard', dpi: 144 },
  { label: '高清', value: 'clear', dpi: 216 },
  { label: '极清', value: 'sharp', dpi: 300 },
  { label: '自定义', value: 'custom', dpi: 220 },
]

const pageModeOptions = [
  { label: '全部页面', value: 'all' },
  { label: '指定页', value: 'custom' },
]

function isConvertibleFile(file) {
  return file.status === 'ready' || file.status === 'done' || file.status === 'canceled'
}

function createPersistedId(file) {
  return `${file.name}-${file.size}-${file.lastModified || 0}`
}

function createFileItem(file, persistedId = createPersistedId(file)) {
  return {
    id: ++fileId,
    persistedId,
    file,
    name: file.name,
    size: file.size,
    pageCount: null,
    selectedPages: 0,
    currentPage: 0,
    progress: 0,
    status: 'ready',
    isInspecting: false,
    error: '',
    results: [],
  }
}

async function loadMuPdf() {
  if (mupdfModule)
    return mupdfModule

  if (!mupdfLoadPromise) {
    isRuntimeLoading.value = true
    runtimeLoadingText.value = '正在加载高保真 PDF 渲染引擎'
    globalThis.$libmupdf_wasm_Module = {
      ...(globalThis.$libmupdf_wasm_Module || {}),
      locateFile: () => mupdfWasmUrl,
    }
    mupdfLoadPromise = import('mupdf')
      .then((module) => {
        mupdfModule = module.default
        return mupdfModule
      })
      .catch((error) => {
        mupdfLoadPromise = null
        throw error
      })
      .finally(() => {
        isRuntimeLoading.value = false
        runtimeLoadingText.value = ''
      })
  }

  return mupdfLoadPromise
}

function openFilePicker() {
  fileInput.value?.click()
}

async function handleInputChange(event) {
  await addFiles(Array.from(event.target.files || []))
  event.target.value = ''
}

async function handleDrop(event) {
  isDragging.value = false
  await addFiles(Array.from(event.dataTransfer?.files || []))
}

async function addFiles(files) {
  const pdfList = files.filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))

  if (!pdfList.length)
    return

  const existingIds = new Set(pdfFiles.value.map(item => item.persistedId))
  const items = pdfList
    .map(file => createFileItem(file))
    .filter(item => !existingIds.has(item.persistedId))

  if (!items.length)
    return

  pdfFiles.value.push(...items)

  await Promise.all(items.map(item => savePendingFile(item)))
}

async function convertAll() {
  if (!canConvert.value)
    return

  isConverting.value = true
  cancelRequested.value = false
  zipProgress.value = 0

  const mupdf = await loadMuPdf()

  try {
    for (const item of readyFiles.value) {
      if (cancelRequested.value)
        break
      await convertFile(item, mupdf)
    }
  }
  finally {
    isConverting.value = false
  }
}

async function convertFile(item, mupdf) {
  let doc = null

  revokeResults(item)
  item.results = []
  item.error = ''
  item.progress = 0
  item.currentPage = 0
  item.status = 'converting'

  try {
    const data = new Uint8Array(await item.file.arrayBuffer())
    doc = mupdf.Document.openDocument(data, 'application/pdf')

    if (doc.needsPassword()) {
      throw new Error('该 PDF 已加密，当前版本暂不支持密码输入')
    }

    item.pageCount = doc.countPages()
    const pages = getSelectedPages(item.pageCount)
    item.selectedPages = pages.length

    for (let index = 0; index < pages.length; index += 1) {
      if (cancelRequested.value) {
        item.status = 'canceled'
        return
      }

      const pageIndex = pages[index]
      item.currentPage = pageIndex + 1
      const result = await renderPage(doc, pageIndex, item, mupdf)
      item.results.push(result)
      item.progress = Math.round(((index + 1) / pages.length) * 100)

      await waitForPaint()
    }

    item.status = 'done'
    void deletePendingFile(item.persistedId)
  }
  catch (error) {
    item.status = 'error'
    item.error = normalizeError(error)
  }
  finally {
    doc?.destroy()
    mupdf.shrinkStore?.(50)
  }
}

async function renderPage(doc, pageIndex, item, mupdf) {
  let page = null
  let pixmap = null

  try {
    const scale = getRenderScale()
    const dpi = Math.round(scale * 72)
    const matrix = mupdf.Matrix.scale(scale, scale)
    page = doc.loadPage(pageIndex)
    pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, false, true)
    pixmap.setResolution(dpi, dpi)

    const width = pixmap.getWidth()
    const height = pixmap.getHeight()
    const { blob, extension } = await encodePixmap(pixmap)
    const url = URL.createObjectURL(blob)
    const filename = buildImageName(item.name, pageIndex + 1, item.pageCount, extension)

    return {
      pageNumber: pageIndex + 1,
      width,
      height,
      size: blob.size,
      blob,
      url,
      filename,
    }
  }
  finally {
    pixmap?.destroy()
    page?.destroy()
  }
}

async function encodePixmap(pixmap) {
  if (settings.format === 'png') {
    return {
      blob: new Blob([pixmap.asPNG()], { type: 'image/png' }),
      extension: 'png',
    }
  }

  if (settings.format === 'jpeg') {
    return {
      blob: new Blob([pixmap.asJPEG(settings.quality, true)], { type: 'image/jpeg' }),
      extension: 'jpg',
    }
  }

  return {
    blob: await pixmapToCanvasBlob(pixmap, 'image/webp', settings.quality / 100),
    extension: 'webp',
  }
}

function pixmapToCanvasBlob(pixmap, mimeType, quality) {
  const width = pixmap.getWidth()
  const height = pixmap.getHeight()
  const pixels = pixmap.getPixels()
  const rgba = new Uint8ClampedArray(width * height * 4)

  for (let source = 0, target = 0; source < pixels.length; source += 3, target += 4) {
    rgba[target] = pixels[source]
    rgba[target + 1] = pixels[source + 1]
    rgba[target + 2] = pixels[source + 2]
    rgba[target + 3] = 255
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('浏览器无法创建图片画布')
  }

  context.putImageData(new ImageData(rgba, width, height), 0, 0)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
        return
      }

      reject(new Error('浏览器不支持当前图片格式导出'))
    }, mimeType, quality)
  })
}

function getSelectedPages(maxPage) {
  if (settings.pageMode === 'all') {
    return Array.from({ length: maxPage }, (_, index) => index)
  }

  const start = Number(settings.pageStart || 1)
  const end = Number(settings.pageEnd || maxPage)

  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) {
    throw new Error('页码必须是有效数字')
  }

  const safeEnd = Math.min(end, maxPage)

  if (start > maxPage) {
    throw new Error('选择的页码超出了 PDF 页数')
  }

  return Array.from({ length: safeEnd - start + 1 }, (_, index) => start + index - 1)
}

function getRenderScale() {
  if (settings.qualityPreset === 'custom') {
    const dpi = Number(settings.customDpi)
    return Math.max(72, Math.min(600, dpi || 192)) / 72
  }

  const option = qualityOptions.find(item => item.value === settings.qualityPreset)
  return (option?.dpi || 144) / 72
}

function requestCancel() {
  cancelRequested.value = true
}

function clearAll() {
  if (isConverting.value)
    return

  pdfFiles.value.forEach(revokeResults)
  pdfFiles.value = []
  zipProgress.value = 0
  void clearPendingFiles()
}

function removeFile(item) {
  if (isConverting.value)
    return

  revokeResults(item)
  pdfFiles.value = pdfFiles.value.filter(file => file.id !== item.id)
  void deletePendingFile(item.persistedId)
}

function revokeResults(item) {
  item.results.forEach((result) => {
    URL.revokeObjectURL(result.url)
  })
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function downloadResult(result) {
  downloadBlob(result.blob, result.filename)
}

async function downloadFileZip(item) {
  if (!item.results.length)
    return

  const folder = sanitizeName(stripPdfExtension(item.name))
  const entries = item.results.map(result => ({
    path: `${folder}/${result.filename}`,
    blob: result.blob,
  }))

  await generateZip(entries, `${stripPdfExtension(item.name)}-images.zip`)
}

async function downloadAllZip() {
  if (!convertedFiles.value.length)
    return

  const usedPaths = new Set()
  const entries = convertedFiles.value.flatMap((item) => {
    const folder = sanitizeName(stripPdfExtension(item.name))
    return item.results.map(result => ({
      path: createZipPath(settings.flatAllZip ? result.filename : `${folder}/${result.filename}`, usedPaths),
      blob: result.blob,
    }))
  })

  await generateZip(entries, 'pdf-images.zip')
}

function createZipPath(path, usedPaths) {
  if (!usedPaths.has(path)) {
    usedPaths.add(path)
    return path
  }

  const dotIndex = path.lastIndexOf('.')
  const base = dotIndex > -1 ? path.slice(0, dotIndex) : path
  const extension = dotIndex > -1 ? path.slice(dotIndex) : ''
  let index = 2
  let nextPath = `${base}-${index}${extension}`

  while (usedPaths.has(nextPath)) {
    index += 1
    nextPath = `${base}-${index}${extension}`
  }

  usedPaths.add(nextPath)
  return nextPath
}

async function generateZip(entries, filename) {
  zipProgress.value = 1
  const blob = await createStoredZip(entries, (percent) => {
    zipProgress.value = percent
  })
  downloadBlob(blob, filename)
  zipProgress.value = 0
}

async function createStoredZip(entries, onProgress) {
  const encoder = new TextEncoder()
  const localParts = []
  const centralParts = []
  const now = new Date()
  const time = toDosTime(now)
  const date = toDosDate(now)
  let offset = 0

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index]
    const nameBytes = encoder.encode(entry.path)
    const data = new Uint8Array(await entry.blob.arrayBuffer())
    const checksum = crc32(data)
    const localHeader = createLocalHeader(nameBytes, data.byteLength, checksum, time, date)
    const centralHeader = createCentralHeader(nameBytes, data.byteLength, checksum, time, date, offset)

    localParts.push(localHeader, data)
    centralParts.push(centralHeader)
    offset += localHeader.byteLength + data.byteLength
    onProgress(Math.round(((index + 1) / entries.length) * 90))
    await waitForPaint()
  }

  const centralSize = centralParts.reduce((total, part) => total + part.byteLength, 0)
  const endRecord = createEndRecord(entries.length, centralSize, offset)
  onProgress(100)

  return new Blob([...localParts, ...centralParts, endRecord], { type: 'application/zip' })
}

function createLocalHeader(nameBytes, size, checksum, time, date) {
  const header = new Uint8Array(30 + nameBytes.byteLength)
  const view = new DataView(header.buffer)

  view.setUint32(0, 0x04034B50, true)
  view.setUint16(4, 20, true)
  view.setUint16(6, 0x0800, true)
  view.setUint16(8, 0, true)
  view.setUint16(10, time, true)
  view.setUint16(12, date, true)
  view.setUint32(14, checksum, true)
  view.setUint32(18, size, true)
  view.setUint32(22, size, true)
  view.setUint16(26, nameBytes.byteLength, true)
  view.setUint16(28, 0, true)
  header.set(nameBytes, 30)

  return header
}

function createCentralHeader(nameBytes, size, checksum, time, date, offset) {
  const header = new Uint8Array(46 + nameBytes.byteLength)
  const view = new DataView(header.buffer)

  view.setUint32(0, 0x02014B50, true)
  view.setUint16(4, 20, true)
  view.setUint16(6, 20, true)
  view.setUint16(8, 0x0800, true)
  view.setUint16(10, 0, true)
  view.setUint16(12, time, true)
  view.setUint16(14, date, true)
  view.setUint32(16, checksum, true)
  view.setUint32(20, size, true)
  view.setUint32(24, size, true)
  view.setUint16(28, nameBytes.byteLength, true)
  view.setUint16(30, 0, true)
  view.setUint16(32, 0, true)
  view.setUint16(34, 0, true)
  view.setUint16(36, 0, true)
  view.setUint32(38, 0, true)
  view.setUint32(42, offset, true)
  header.set(nameBytes, 46)

  return header
}

function createEndRecord(entryCount, centralSize, centralOffset) {
  const record = new Uint8Array(22)
  const view = new DataView(record.buffer)

  view.setUint32(0, 0x06054B50, true)
  view.setUint16(4, 0, true)
  view.setUint16(6, 0, true)
  view.setUint16(8, entryCount, true)
  view.setUint16(10, entryCount, true)
  view.setUint32(12, centralSize, true)
  view.setUint32(16, centralOffset, true)
  view.setUint16(20, 0, true)

  return record
}

function crc32(data) {
  const table = getCrcTable()
  let crc = 0xFFFFFFFF

  for (let index = 0; index < data.length; index += 1) {
    crc = (crc >>> 8) ^ table[(crc ^ data[index]) & 0xFF]
  }

  return (crc ^ 0xFFFFFFFF) >>> 0
}

function getCrcTable() {
  if (crcTable)
    return crcTable

  crcTable = new Uint32Array(256)

  for (let index = 0; index < 256; index += 1) {
    let value = index

    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xEDB88320 ^ (value >>> 1) : value >>> 1
    }

    crcTable[index] = value >>> 0
  }

  return crcTable
}

function toDosTime(date) {
  return (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2)
}

function toDosDate(date) {
  return ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
}

function openQueueDb() {
  if (queueDbPromise)
    return queueDbPromise

  queueDbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(queueDbName, 1)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(queueStoreName)) {
        db.createObjectStore(queueStoreName, { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

  return queueDbPromise
}

async function runQueueStore(mode, action) {
  if (typeof indexedDB === 'undefined')
    return null

  const db = await openQueueDb()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(queueStoreName, mode)
    const store = transaction.objectStore(queueStoreName)
    const request = action(store)
    let result = null

    if (request) {
      request.onsuccess = () => {
        result = request.result
      }
      request.onerror = () => reject(request.error)
    }

    transaction.oncomplete = () => resolve(result)
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}

async function savePendingFile(item) {
  try {
    await runQueueStore('readwrite', store => store.put({
      id: item.persistedId,
      name: item.name,
      size: item.size,
      type: item.file.type || 'application/pdf',
      lastModified: item.file.lastModified || Date.now(),
      file: item.file,
      createdAt: Date.now(),
    }))
  }
  catch (error) {
    void error
  }
}

async function deletePendingFile(id) {
  try {
    await runQueueStore('readwrite', store => store.delete(id))
  }
  catch (error) {
    void error
  }
}

async function clearPendingFiles() {
  try {
    await runQueueStore('readwrite', store => store.clear())
  }
  catch (error) {
    void error
  }
}

async function restorePendingFiles() {
  try {
    const records = (await runQueueStore('readonly', store => store.getAll())) || []
    const existingIds = new Set(pdfFiles.value.map(item => item.persistedId))
    const restored = records
      .filter(record => !existingIds.has(record.id))
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
      .map((record) => {
        const file = typeof File !== 'undefined' && record.file instanceof File
          ? record.file
          : new File([record.file], record.name, {
            type: record.type || 'application/pdf',
            lastModified: record.lastModified || Date.now(),
          })

        return createFileItem(file, record.id)
      })

    if (restored.length) {
      pdfFiles.value.push(...restored)
    }
  }
  catch (error) {
    void error
  }
}

function buildImageName(pdfName, pageNumber, pageCount, extension) {
  const baseName = sanitizeName(stripPdfExtension(pdfName))
  const page = String(pageNumber).padStart(String(pageCount).length, '0')
  return `${baseName}-page-${page}.${extension}`
}

function stripPdfExtension(name) {
  return name.replace(/\.pdf$/i, '')
}

function sanitizeName(name) {
  return name.replace(/[\\/:*?"<>|]/g, '-').trim() || 'pdf'
}

function formatSize(size) {
  if (!size)
    return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  let value = size
  let index = 0

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index += 1
  }

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

function statusText(status) {
  const texts = {
    reading: '读取中',
    ready: '待转换',
    converting: '转换中',
    done: '已完成',
    error: '失败',
    canceled: '已取消',
  }

  return texts[status] || status
}

function normalizeError(error) {
  const message = error?.message || String(error)

  if (/password|encrypted/i.test(message))
    return '该 PDF 已加密，当前版本暂不支持密码输入'
  if (/memory|canvas|allocation/i.test(message))
    return '浏览器资源不足，请降低清晰度或分批转换'
  if (/format|xref|repair|document/i.test(message))
    return 'PDF 文件可能损坏或格式不受支持'

  return message
}

function waitForPaint() {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

onBeforeUnmount(() => {
  pdfFiles.value.forEach(revokeResults)
})

onMounted(() => {
  void restorePendingFiles()
})
</script>

<template>
  <main class="pdf-tool-page">
    <header class="tool-header">
      <a class="back-link" href="/yoran-secret/tools">← Tools</a>
      <p class="tool-kicker">
        Local Converter
      </p>
      <h1>PDF 转图片</h1>
      <p>批量导入，批量导出，文件只在浏览器本地处理。</p>
    </header>

    <Transition name="loader-fade">
      <div
        v-if="isRuntimeLoading"
        class="runtime-loading-effect"
        role="status"
      >
        <div class="orbit-loader" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <strong>{{ runtimeLoadingText }}</strong>
          <p>首次加载会稍久，后续会直接复用浏览器缓存。</p>
        </div>
      </div>
    </Transition>

    <section class="control-panel">
      <div
        class="drop-zone"
        :class="{ 'is-dragging': isDragging }"
        @click="openFilePicker"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <ElIcon class="drop-icon">
          <UploadFilled />
        </ElIcon>
        <div>
          <strong>选择或拖入 PDF</strong>
          <span>支持多文件</span>
        </div>
        <input
          ref="fileInput"
          class="file-input"
          type="file"
          accept="application/pdf,.pdf"
          multiple
          @change="handleInputChange"
        >
      </div>

      <div class="settings-panel">
        <label>
          <span>格式</span>
          <div class="segmented">
            <button
              v-for="option in formatOptions"
              :key="option.value"
              type="button"
              :class="{ active: settings.format === option.value }"
              @click="settings.format = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </label>

        <label>
          <span>清晰度</span>
          <div class="segmented">
            <button
              v-for="option in qualityOptions"
              :key="option.value"
              type="button"
              :class="{ active: settings.qualityPreset === option.value }"
              @click="settings.qualityPreset = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </label>

        <label v-if="settings.qualityPreset === 'custom'">
          <span>自定义清晰度</span>
          <input v-model.number="settings.customDpi" class="field-input" type="number" min="72" max="600" step="12" placeholder="数字越大越清晰">
        </label>

        <label v-if="settings.format !== 'png'">
          <span>质量 {{ settings.quality }}</span>
          <input v-model.number="settings.quality" class="range-input" type="range" min="50" max="100">
        </label>

        <label>
          <span>页码</span>
          <div class="segmented page-mode">
            <button
              v-for="option in pageModeOptions"
              :key="option.value"
              type="button"
              :class="{ active: settings.pageMode === option.value }"
              @click="settings.pageMode = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </label>

        <div v-if="settings.pageMode === 'custom'" class="page-range-fields">
          <label>
            <span>从第</span>
            <input v-model.number="settings.pageStart" class="field-input" type="number" min="1" step="1" placeholder="1">
          </label>
          <label>
            <span>到第</span>
            <input v-model.number="settings.pageEnd" class="field-input" type="number" min="1" step="1" placeholder="最后一页">
          </label>
        </div>
      </div>
    </section>

    <section class="action-bar">
      <div class="summary">
        <span>{{ pdfFiles.length }} 个文件</span>
        <span>{{ totalPages }} 页</span>
        <span>{{ convertedPages }} 张图片</span>
      </div>

      <div class="actions">
        <button type="button" class="ghost-btn" :disabled="!pdfFiles.length || isConverting" @click="clearAll">
          清空
        </button>
        <button v-if="isConverting" type="button" class="danger-btn" @click="requestCancel">
          取消
        </button>
        <button type="button" class="primary-btn" :disabled="!canConvert" @click="convertAll">
          <ElIcon><Refresh /></ElIcon>
          开始转换
        </button>
        <label class="zip-layout-toggle" :class="{ disabled: !canDownloadAll }">
          <input v-model="settings.flatAllZip" type="checkbox" :disabled="!canDownloadAll">
          <span>同一文件夹</span>
        </label>
        <button type="button" class="primary-btn" :disabled="!canDownloadAll" @click="downloadAllZip">
          <ElIcon><FolderOpened /></ElIcon>
          全部打包
        </button>
      </div>
    </section>

    <div v-if="zipProgress" class="zip-progress">
      打包中 {{ zipProgress }}%
    </div>

    <section class="file-list">
      <article
        v-for="item in pdfFiles"
        :key="item.id"
        class="file-item"
      >
        <div class="file-main">
          <div>
            <h2>{{ item.name }}</h2>
            <p>
              {{ formatSize(item.size) }}
              <template v-if="item.pageCount">
                · {{ item.pageCount }} 页
              </template>
              <template v-else-if="item.isInspecting">
                · 页数识别中
              </template>
              · {{ statusText(item.status) }}
            </p>
          </div>

          <button type="button" class="icon-btn" :disabled="isConverting" @click="removeFile(item)">
            ×
          </button>
        </div>

        <div v-if="item.status === 'converting' || item.progress" class="progress-track">
          <span :style="{ width: `${item.progress}%` }" />
        </div>

        <p v-if="item.status === 'converting'" class="muted">
          正在处理第 {{ item.currentPage }} 页
        </p>
        <p v-if="item.error" class="error-text">
          {{ item.error }}
        </p>

        <div v-if="item.results.length" class="result-head">
          <span>{{ item.results.length }} 张图片</span>
          <button type="button" class="ghost-btn" @click="downloadFileZip(item)">
            <ElIcon><Download /></ElIcon>
            下载本文件
          </button>
        </div>

        <div v-if="item.results.length" class="result-grid">
          <div
            v-for="result in item.results"
            :key="result.filename"
            class="result-item"
          >
            <a :href="result.url" target="_blank">
              <img :src="result.url" :alt="result.filename">
            </a>
            <div>
              <strong>第 {{ result.pageNumber }} 页</strong>
              <span>{{ result.width }}×{{ result.height }} · {{ formatSize(result.size) }}</span>
            </div>
            <button type="button" class="ghost-btn" @click="downloadResult(result)">
              下载
            </button>
          </div>
        </div>
      </article>

      <div v-if="!pdfFiles.length" class="empty-state">
        <p>还没有 PDF。</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.pdf-tool-page {
  max-width: 980px;
  margin: 0 auto;
  padding: 32px 24px 96px;
  color: var(--vp-c-text-1);
}

.tool-header {
  margin-bottom: 28px;
}

.back-link,
.tool-kicker {
  color: #e06c75;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 13px;
  text-decoration: none;
}

.tool-kicker {
  margin: 18px 0 8px;
  text-transform: uppercase;
}

.tool-header h1 {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
}

.tool-header p:last-child {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
}

.runtime-loading-effect {
  position: relative;
  min-height: 78px;
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
  padding: 16px 18px;
  overflow: hidden;
  border: 1px solid rgba(224, 108, 117, 0.28);
  border-radius: 8px;
  background:
    linear-gradient(120deg, rgba(224, 108, 117, 0.08), transparent 46%),
    var(--vp-c-bg-soft);
}

.runtime-loading-effect::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(224, 108, 117, 0.12), transparent);
  transform: translateX(-100%);
  animation: loading-sweep 1.6s ease-in-out infinite;
}

.runtime-loading-effect > * {
  position: relative;
  z-index: 1;
}

.runtime-loading-effect strong {
  display: block;
  font-size: 14px;
}

.runtime-loading-effect p {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.orbit-loader {
  position: relative;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
}

.orbit-loader::before {
  content: "";
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(224, 108, 117, 0.32);
  border-radius: 999px;
}

.orbit-loader span {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  animation: orbit-spin 1.4s linear infinite;
}

.orbit-loader span::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 50%;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #e06c75;
  box-shadow: 0 0 14px rgba(224, 108, 117, 0.55);
  transform: translateX(-50%);
}

.orbit-loader span:nth-child(2) {
  animation-delay: -0.46s;
  opacity: 0.72;
}

.orbit-loader span:nth-child(3) {
  animation-delay: -0.92s;
  opacity: 0.45;
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes orbit-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes loading-sweep {
  to {
    transform: translateX(100%);
  }
}

.control-panel {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(320px, 1.2fr);
  gap: 16px;
  margin-bottom: 16px;
}

.drop-zone {
  min-height: 248px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.2s ease;
}

.drop-zone:hover,
.drop-zone.is-dragging {
  border-color: #e06c75;
  background: rgba(224, 108, 117, 0.06);
}

.drop-icon {
  color: #e06c75;
  font-size: 34px;
}

.drop-zone strong,
.drop-zone span {
  display: block;
  text-align: center;
}

.drop-zone span {
  margin-top: 4px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.file-input {
  display: none;
}

.settings-panel {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.settings-panel label {
  display: grid;
  gap: 8px;
}

.settings-panel label > span {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.segmented {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
}

.segmented button,
.primary-btn,
.ghost-btn,
.danger-btn,
.icon-btn {
  border: 0;
  color: var(--vp-c-text-1);
  background: transparent;
  cursor: pointer;
}

.segmented button {
  min-height: 34px;
  border-right: 1px solid var(--vp-c-divider);
}

.segmented button:last-child {
  border-right: 0;
}

.segmented button.active {
  color: #e06c75;
  background: rgba(224, 108, 117, 0.08);
}

.page-mode {
  grid-auto-columns: minmax(0, 1fr);
}

.page-range-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field-input {
  min-height: 36px;
  padding: 0 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.range-input {
  width: 100%;
}

.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px 0;
}

.summary {
  display: flex;
  gap: 12px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.zip-layout-toggle {
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}

.zip-layout-toggle input {
  width: 14px;
  height: 14px;
  margin: 0;
  accent-color: #e06c75;
}

.zip-layout-toggle.disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.primary-btn,
.ghost-btn,
.danger-btn {
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 13px;
}

.primary-btn {
  color: #fff;
  border-color: #e06c75;
  background: #e06c75;
}

.danger-btn {
  color: #fff;
  border-color: #b42318;
  background: #b42318;
}

.primary-btn:disabled,
.ghost-btn:disabled,
.danger-btn:disabled,
.icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.zip-progress {
  margin-bottom: 12px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.file-list {
  display: grid;
  gap: 12px;
}

.file-item {
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.file-main,
.result-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.file-main h2 {
  margin: 0 0 6px;
  font-size: 16px;
  line-height: 1.4;
  word-break: break-all;
}

.file-main p,
.muted {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.icon-btn {
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 18px;
  line-height: 1;
}

.progress-track {
  height: 6px;
  margin: 14px 0 8px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #e06c75;
  transition: width 0.2s ease;
}

.error-text {
  margin: 10px 0 0;
  color: #b42318;
  font-size: 13px;
}

.result-head {
  align-items: center;
  margin-top: 16px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.result-item {
  display: grid;
  gap: 8px;
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.result-item img {
  width: 100%;
  height: 180px;
  object-fit: contain;
  border-radius: 4px;
  background: #fff;
}

.result-item strong,
.result-item span {
  display: block;
}

.result-item span {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.empty-state {
  padding: 32px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.dark .back-link,
.dark .tool-kicker,
.dark .drop-icon,
.dark .segmented button.active {
  color: #ff9e9e;
}

.dark .drop-zone:hover,
.dark .drop-zone.is-dragging,
.dark .segmented button.active {
  background: rgba(255, 158, 158, 0.08);
}

.dark .runtime-loading-effect {
  border-color: rgba(255, 158, 158, 0.28);
  background:
    linear-gradient(120deg, rgba(255, 158, 158, 0.08), transparent 46%),
    var(--vp-c-bg-soft);
}

.dark .runtime-loading-effect::before {
  background: linear-gradient(90deg, transparent, rgba(255, 158, 158, 0.12), transparent);
}

.dark .orbit-loader::before {
  border-color: rgba(255, 158, 158, 0.32);
}

.dark .orbit-loader span::after {
  background: #ff9e9e;
  box-shadow: 0 0 14px rgba(255, 158, 158, 0.55);
}

.dark .drop-zone:hover,
.dark .drop-zone.is-dragging {
  border-color: #ff9e9e;
}

.dark .primary-btn,
.dark .progress-track span {
  border-color: #ff9e9e;
  background: #ff9e9e;
}

@media (max-width: 760px) {
  .pdf-tool-page {
    padding: 24px 16px 72px;
  }

  .control-panel {
    grid-template-columns: 1fr;
  }

  .action-bar,
  .file-main,
  .result-head {
    align-items: stretch;
    flex-direction: column;
  }

  .summary,
  .actions {
    justify-content: flex-start;
  }
}
</style>

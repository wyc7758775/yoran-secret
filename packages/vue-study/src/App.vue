<script setup lang="ts">
import { ref } from 'vue'
import ApiExamples from './components/index.vue'
import FilePreview from './components/虚拟滚动.vue'

const currentView = ref('examples')

function switchView(view: string) {
  currentView.value = view
}
</script>

<template>
  <div style="padding: 16px">
    <!-- 导航栏 -->
    <div style="margin-bottom: 20px; display: flex; gap: 10px;">
      <button 
        @click="switchView('examples')"
        :style="{ 
          padding: '8px 16px', 
          backgroundColor: currentView === 'examples' ? '#1976d2' : '#f0f0f0',
          color: currentView === 'examples' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }"
      >
        API 示例
      </button>
      <button 
        @click="switchView('filePreview')"
        :style="{ 
          padding: '8px 16px', 
          backgroundColor: currentView === 'filePreview' ? '#1976d2' : '#f0f0f0',
          color: currentView === 'filePreview' ? 'white' : 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }"
      >
        文件预览
      </button>
    </div>

    <!-- 内容区域 -->
    <ApiExamples v-if="currentView === 'examples'" />
    <FilePreview v-if="currentView === 'filePreview'" />
  </div>
</template>

<style>
#app {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f7fa;
  min-height: 100vh;
}
</style>

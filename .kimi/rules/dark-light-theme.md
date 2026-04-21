# 规则：所有 UI 修改必须支持白天/黑夜双主题

> 本规则适用于 `packages/blog` 包内所有涉及界面样式、颜色、背景、边框的修改。

## 背景

本项目基于 VitePress，其内置了白天/黑夜主题切换能力。VitePress 通过给 `<html>` 元素添加/移除 `dark` class 来实现主题切换。任何新增或修改的 UI 元素，如果不做暗色适配，在黑夜模式下会出现颜色突兀、对比度不足甚至不可见的问题。

## 必须遵循的规范

### 1. 新增任何带颜色的样式时，必须同时提供暗色版本

**禁止**只写亮色样式。以下情况必须成对出现：

- 背景色 → 同时提供 `dark:` 背景色
- 文字色 → 同时提供 `dark:` 文字色
- 边框色 → 同时提供 `dark:` 边框色
- 阴影/遮罩 → 同时提供暗色版本

### 2. 使用项目已有的技术栈实现暗色适配

本项目使用以下三种方式处理主题，按场景选择：

#### 方式 A：UnoCSS `dark:` 前缀（最常用）

适用于 Vue 模板中的原子类：

```vue
<!-- ✅ 正确：同时定义亮色和暗色边框 -->
<div class="border-[#333] dark:border-primary-50">...</div>

<!-- ✅ 正确：同时定义亮色和暗色背景 -->
<span class="bg-[#d1e8f3ed] dark:bg-[#1e3a4d] dark:text-white">...</span>

<!-- ✅ 正确：hover 状态也支持暗色 -->
<button class="hover:dark:bg-gray-700">...</button>
```

#### 方式 B：UnoCSS shortcuts 成对定义

如果需要在 `unocss.config.ts` 中新增 shortcut，**必须**同时定义亮色和暗色版本：

```ts
// unocss.config.ts
shortcuts: {
  // ✅ 正确：成对定义
  'my-badge': 'bg-[#d1e8f3ed] text-black',
  'my-badge:dark': 'dark:bg-[#1e3a4d] dark:text-white',
}
```

参考现有定义：
- `'highlight': 'bg-[#d1e8f3ed] rounded-[0.225rem] px-[0.25rem]'`
- `'highlight:dark': 'dark:bg-[#1e3a4d] dark:text-white'`

#### 方式 C：CSS 中通过 `.dark` 类选择器覆盖

适用于 `main.css` 等样式文件中的自定义 CSS：

```css
/* ✅ 正确：先写亮色默认，再用 .dark 覆盖 */
.my-component {
  background-color: #fff;
  border-color: var(--vp-c-divider);
}

.dark .my-component {
  background-color: var(--vp-c-bg-alt);
  border-color: var(--vp-c-divider-dark-2);
}
```

参考现有定义：
```css
.dark .VPSidebar::-webkit-scrollbar-thumb {
  background-color: var(--vp-c-divider-dark-2);
}
```

#### 方式 D：组件内通过 `computed` 动态检测并绑定类名

适用于需要复杂逻辑控制的场景：

```vue
<script setup>
import { computed } from 'vue'

const isDarkMode = computed(() => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return document.documentElement.classList.contains('dark')
  }
  return false
})
</script>

<template>
  <div :class="{ 'my-component-dark': isDarkMode }">...</div>
</template>
```

参考现有实现：`pages/components/TocSidebar.vue`

### 3. 涉及外部样式资源（如 CDN CSS）时，必须监听主题变化

如果修改了需要加载外部 CSS 文件的功能（如代码高亮样式），必须使用 `MutationObserver` 监听 `document.documentElement` 的 `class` 属性变化，动态切换资源：

```ts
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      const isDark = document.documentElement.classList.contains('dark')
      // 根据 isDark 切换外部资源
    }
  })
})
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
})
```

参考现有实现：`pages/use-md-render.ts`（highlight.js 暗色/亮色样式切换）

### 4. 推荐使用的颜色值

| 场景 | 亮色模式 | 暗色模式 |
|------|---------|---------|
| 浅色背景/高亮 | `#d1e8f3ed` | `#1e3a4d` |
| 边框/分割线 | `var(--vp-c-divider)` | `var(--vp-c-divider-dark-2)` |
| 深色边框 | `#333` | `primary-50` |
| 通用 hover 背景 | — | `gray-700` |

优先使用 VitePress CSS 变量（`var(--vp-c-*)`），其次是具体的色值。

## 自检清单

在提交任何涉及 UI 的修改前，agent 必须确认：

- [ ] 新增/修改的元素是否有背景色？如果有，是否提供了 `dark:` 版本？
- [ ] 新增/修改的元素是否有文字颜色？如果有，是否提供了 `dark:` 版本？
- [ ] 新增/修改的元素是否有边框？如果有，是否提供了 `dark:` 版本？
- [ ] 是否在 `unocss.config.ts` 中新增 shortcut？如果是，是否成对定义了 `:dark` 版本？
- [ ] 是否在 `main.css` 中新增样式？如果是，是否添加了 `.dark` 覆盖？
- [ ] 是否涉及外部 CSS/图片资源？如果是，是否添加了主题变化监听？

## 违规示例

```vue
<!-- ❌ 错误：只定义了亮色背景，黑夜模式下会突兀 -->
<div class="bg-white text-black">...</div>

<!-- ✅ 正确 -->
<div class="bg-white dark:bg-[#1e3a4d] text-black dark:text-white">...</div>
```

```css
/* ❌ 错误：没有暗色覆盖 */
.my-box {
  border: 1px solid #e5e7eb;
}

/* ✅ 正确 */
.my-box {
  border: 1px solid #e5e7eb;
}
.dark .my-box {
  border-color: var(--vp-c-divider-dark-2);
}
```

const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { test } = require('node:test')

test('observer detail keeps mobile nav above content with an opaque screen', () => {
  const hook = readFileSync('packages/blog/pages/hooks/use-nav-to-static.ts', 'utf8')
  const css = readFileSync('packages/blog/.vitepress/theme/main.css', 'utf8')

  assert.match(hook, /matchMedia\('\(max-width: 767px\)'\)/)
  assert.match(hook, /navElement\.style\.position = mobileQuery\.matches \? 'fixed' : 'static'/)
  assert.match(hook, /navElement\.style\.zIndex = mobileQuery\.matches \? '1000' : '1'/)
  assert.match(css, /\.VPNavScreen/)
  assert.match(css, /--vp-nav-screen-bg-color: var\(--vp-c-bg\)/)
  assert.match(css, /\.VPNavBarHamburger\.active/)
  assert.match(css, /background-color: var\(--vp-c-bg-alt\) !important/)
  assert.doesNotMatch(css, /--vp-c-bg-mute/)
})

test('toc sidebar is hidden immediately on mobile', () => {
  const toc = readFileSync('packages/blog/pages/components/TocSidebar.vue', 'utf8')

  assert.match(toc, /handleResize\(\)/)
  assert.match(toc, /window\.innerWidth < 1000/)
  assert.match(toc, /@media \(max-width: 999px\)/)
  assert.match(toc, /\.toc-sidebar\s*\{[\s\S]*display: none !important/)
})

test('mobile fixes stay inside responsive breakpoints', () => {
  const css = readFileSync('packages/blog/.vitepress/theme/main.css', 'utf8')
  const toc = readFileSync('packages/blog/pages/components/TocSidebar.vue', 'utf8')

  assert.match(css, /@media \(max-width: 767px\) \{[\s\S]*\.VPNavScreen[\s\S]*\.VPNavBarHamburger/)
  assert.match(toc, /@media \(max-width: 999px\) \{[\s\S]*\.toc-sidebar\s*\{[\s\S]*display: none !important/)
  assert.doesNotMatch(css, /@media \(min-width:[\s\S]*\.VPNavScreen[\s\S]*background-color: var\(--vp-c-bg\) !important/)
  assert.doesNotMatch(toc, /@media \(min-width:[\s\S]*\.toc-sidebar\s*\{[\s\S]*display: none !important/)
})

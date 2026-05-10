# Change: 新增 PDF 转图片工具

## Why
当前博客已经新增 `/tools` 工具集合页，但还没有实际可用工具。用户需要一个类似 WPS 的 PDF 转图片能力，要求尽可能高保真、支持批量导入导出，并且当前站点只能以静态方式部署。

PDF 转图片的核心难点不是文件格式转换，而是 PDF 页面渲染。字体、透明、矢量图、扫描图、批注、表单、页面旋转、超大页面和加密文档都会影响最终图片质量。纯静态站无法使用后端的 Ghostscript、Poppler、PDFium 等服务，因此本变更采用“浏览器本地 WASM 渲染 + 批处理导出”的方案，在静态部署限制下尽可能接近专业转换质量。

## What Changes
- 在刚新增的 `/tools` 工具集合路由页面内部新增 `PDF 转图片` 工具入口，并提供独立页面 `/tools/pdf-to-images`
- 使用浏览器本地 PDF 渲染引擎完成转换，不上传用户文件
- 优先评估并接入 MuPDF WebAssembly 渲染方案，以获得更高的复杂 PDF 渲染一致性
- 若 MuPDF 许可或体积不适合当前开源静态站，则保留 PDF.js 作为 Apache-2.0 许可的降级实现
- 支持批量导入多个 PDF 文件
- 支持按页渲染为 PNG / JPEG / WebP
- 支持 `省空间` / `标准` / `高清` / `极清` / `自定义` 清晰度档位
- 支持单页下载、单 PDF 打包下载、全部 PDF 打包下载
- 多页和多文件导出时使用内置 zip 打包
- MuPDF 渲染引擎 SHALL 按需加载，避免进入工具页时立即加载大体积依赖
- 首次加载转换引擎时提供明确、顺滑的 loading 动效
- 提供转换队列、进度、失败原因、取消转换、清空列表等基础交互
- 刷新页面后保留已选择但尚未完成转换的待转换队列
- 对加密 PDF、损坏 PDF、超大 PDF、内存不足等情况给出明确提示

## Non-Goals
- 不接入收费 API
- 不把 PDF 上传到服务器转换
- 不承诺所有 PDF 与 WPS、Adobe Acrobat、系统预览工具逐像素完全一致
- 不在第一版实现 OCR、PDF 编辑、图片重新合成 PDF

## Technical Direction
- 首选方案：MuPDF WebAssembly 本地渲染
  - 优点：专业 PDF 渲染引擎，复杂页面兼容性更强
  - 风险：AGPL / 商业双许可，需要确认当前公开仓库是否接受 AGPL 约束
- 备选方案：PDF.js / `pdfjs-dist`
  - 优点：Apache-2.0，生态成熟，静态站接入简单
  - 风险：复杂 PDF 的渲染一致性弱于专业转换工具
- 打包方案：内置无压缩 zip 生成器，避免额外打包依赖和 dev 缓存失配
- 文件处理：File API、Blob、Object URL、Web Worker
- 性能策略：
  - 按文件、按页排队渲染，避免一次性渲染全部页面导致浏览器崩溃
  - 默认限制并发为 1-2 页
  - 对超大 PDF 提供降低清晰度建议
  - 转换结束后主动释放 canvas、Blob URL 和页面对象

## Impact
- Affected specs: `pdf-to-images-tool`
- Affected code:
  - `packages/blog/tools.md`
  - `packages/blog/pages/Tools.vue`
  - `packages/blog/pages/PdfToImages.vue`
  - `packages/blog/package.json`
  - 可能新增 `packages/blog/pages/tools/` 下的工具组件或 hooks

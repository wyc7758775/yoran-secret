## ADDED Requirements

### Requirement: 工具入口
系统 SHALL 在刚新增的 `/tools` 工具集合路由页面内部提供 PDF 转图片工具入口。

#### Scenario: 用户从工具页进入 PDF 转图片
- **WHEN** 用户访问 `/tools`
- **THEN** 页面 SHALL 在工具列表中显示 `PDF 转图片` 工具入口
- **AND** 点击入口 SHALL 导航到 `/tools/pdf-to-images`
- **AND** 该入口 SHALL 不出现在顶部导航栏

### Requirement: 静态站本地转换
系统 SHALL 在浏览器本地完成 PDF 转图片，不依赖后端转换服务。

#### Scenario: 用户导入 PDF 文件
- **WHEN** 用户选择或拖拽 PDF 文件到工具页面
- **THEN** 系统 SHALL 使用浏览器 File API 读取文件
- **AND** 文件内容 SHALL 不上传到远程服务器
- **AND** 系统 SHALL 在页面中展示文件名、文件大小、页数和转换状态
- **AND** 页数识别 SHALL 作为后台辅助任务执行，不得阻塞用户开始转换

### Requirement: 大体积依赖按需加载
系统 SHALL 避免在进入工具页面时立即加载 PDF 渲染引擎。

#### Scenario: 用户只打开 PDF 转图片页面
- **WHEN** 用户访问 `/tools/pdf-to-images`
- **THEN** 页面 SHALL 先渲染上传区、参数区和操作区
- **AND** 系统 SHALL NOT 立即加载 MuPDF 渲染引擎

#### Scenario: 用户首次开始转换
- **WHEN** 用户首次点击开始转换
- **THEN** 系统 SHALL 按需加载 MuPDF 渲染引擎
- **AND** 页面 SHALL 显示转换引擎加载中的视觉动效

#### Scenario: 用户首次打包下载
- **WHEN** 用户首次触发单文件或全部 zip 下载
- **THEN** 系统 SHALL 使用内置 zip 生成器完成打包
- **AND** 页面 SHALL 显示打包进度

### Requirement: 高保真页面渲染
系统 SHALL 使用当前静态站可行的高保真 PDF 渲染方案，将 PDF 页面渲染为图片。

#### Scenario: 转换普通 PDF
- **WHEN** 用户开始转换包含文字、图片和矢量元素的 PDF
- **THEN** 系统 SHALL 按页面顺序渲染 PDF
- **AND** 输出图片 SHALL 保持原页面比例
- **AND** 输出图片 SHALL 尽可能保留字体、颜色、透明度、图片和矢量元素的视觉效果
- **AND** 用户 SHALL 可以选择 `省空间` / `标准` / `高清` / `极清` / `自定义` 清晰度

#### Scenario: 转换扫描型 PDF
- **WHEN** 用户转换主要由扫描图片组成的 PDF
- **THEN** 系统 SHALL 按页面视觉内容输出图片
- **AND** 输出图片 SHALL 不裁切页面内容
- **AND** 输出图片 SHALL 保持页面方向

### Requirement: 批量导入
系统 SHALL 支持一次导入多个 PDF 文件。

#### Scenario: 用户一次选择多个 PDF
- **WHEN** 用户选择多个 `.pdf` 文件
- **THEN** 系统 SHALL 将所有合法 PDF 添加到转换队列
- **AND** 系统 SHALL 拒绝非 PDF 文件并显示提示
- **AND** 每个 PDF SHALL 独立展示页数、状态、进度和错误信息

### Requirement: 待转换队列持久化
系统 SHALL 在浏览器刷新后保留已经选择但尚未完成转换的 PDF。

#### Scenario: 用户刷新页面
- **WHEN** 用户已选择 PDF 且该 PDF 尚未完成转换
- **AND** 用户刷新 `/tools/pdf-to-images`
- **THEN** 系统 SHALL 从本地浏览器存储恢复待转换队列
- **AND** 恢复后的文件 SHALL 保持为待转换状态
- **AND** 已完成转换并生成的图片结果 SHALL NOT 持久化保存

#### Scenario: 用户完成或删除文件
- **WHEN** 某个 PDF 转换完成、被删除或用户清空列表
- **THEN** 系统 SHALL 从本地待转换队列中移除对应文件

### Requirement: 输出格式
系统 SHALL 支持将 PDF 页面导出为常见图片格式。

#### Scenario: 用户选择输出格式
- **WHEN** 用户选择 PNG / JPEG / WebP 中任一格式
- **THEN** 系统 SHALL 按所选格式生成页面图片
- **AND** 当用户选择 JPEG 或 WebP 时，系统 SHALL 允许设置图片质量
- **AND** 默认输出格式 SHALL 为 PNG

### Requirement: 页码选择
系统 SHALL 默认转换全部页面，并在用户需要时提供纯数字页码范围选择。

#### Scenario: 用户不调整页码
- **WHEN** 用户导入 PDF 后直接开始转换
- **THEN** 系统 SHALL 转换该 PDF 的全部页面

#### Scenario: 用户选择指定页
- **WHEN** 用户切换到 `指定页`
- **THEN** 系统 SHALL 显示起始页和结束页两个数字输入框
- **AND** 用户 SHALL 可以通过纯数字指定转换范围
- **AND** 系统 SHALL 校验页码必须是有效数字且不超出 PDF 页数

### Requirement: 批量导出
系统 SHALL 支持单页、单文件和全量批量导出。

#### Scenario: 用户下载单页图片
- **WHEN** 某一页转换完成
- **THEN** 用户 SHALL 可以单独下载该页图片
- **AND** 文件名 SHALL 包含 PDF 原文件名和页码

#### Scenario: 用户下载单个 PDF 的全部页面
- **WHEN** 一个 PDF 的页面转换完成
- **THEN** 用户 SHALL 可以下载该 PDF 对应的 zip 文件
- **AND** zip 内图片 SHALL 按页码顺序命名

#### Scenario: 用户下载全部转换结果
- **WHEN** 多个 PDF 完成转换
- **THEN** 用户 SHALL 可以下载包含全部结果的 zip 文件
- **AND** zip 内 SHALL 按 PDF 原文件名创建目录
- **AND** 每个目录内 SHALL 按页码顺序保存图片

#### Scenario: 用户选择同一文件夹打包
- **WHEN** 用户开启 `同一文件夹` 选项后下载全部转换结果
- **THEN** zip 内 SHALL 将所有图片放在同一层级
- **AND** 系统 SHALL 自动处理重名图片，避免 zip 内文件相互覆盖

### Requirement: 转换进度与控制
系统 SHALL 提供清晰的批量转换进度和控制能力。

#### Scenario: 用户开始批量转换
- **WHEN** 转换任务运行中
- **THEN** 页面 SHALL 显示总进度
- **AND** 页面 SHALL 显示当前正在处理的文件和页码
- **AND** 用户 SHALL 可以取消当前转换任务
- **AND** 用户 SHALL 可以清空文件列表和转换结果

### Requirement: 异常处理
系统 SHALL 对无法转换的 PDF 给出明确提示。

#### Scenario: PDF 无法读取
- **WHEN** 用户导入加密、损坏或浏览器无法解析的 PDF
- **THEN** 系统 SHALL 标记该文件为失败
- **AND** 系统 SHALL 展示可理解的失败原因
- **AND** 其他文件 SHALL 继续转换，不受该文件影响

#### Scenario: 浏览器资源不足
- **WHEN** 页面渲染超大 PDF 时出现内存不足或 canvas 限制
- **THEN** 系统 SHALL 停止当前文件转换
- **AND** 系统 SHALL 提示用户降低清晰度、缩小页码范围或分批转换

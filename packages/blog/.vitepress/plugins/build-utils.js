const fsPromises = require('node:fs/promises')
const path = require('node:path')
const { execSync } = require('node:child_process')
const matter = require('gray-matter')

const supportedArticleExtensions = new Set(['.md', '.html'])

function isSupportedArticleFile(filePath) {
  return supportedArticleExtensions.has(path.extname(filePath).toLowerCase())
}

/**
 * 从日记文件中提取第一张图片的 src
 * @param {string} filePath
 * @returns {Promise<string|null>}
 */
async function getFirstImage(filePath) {
  if (isSupportedArticleFile(filePath)) {
    const fileContent = await fsPromises.readFile(filePath, 'utf-8')
    const firstImageMatch = fileContent.match(
      /!\[.*?\]\((.*?)\)|<img.*?src=["'](.*?)["']/,
    )

    if (firstImageMatch) {
      return firstImageMatch[1] || firstImageMatch[2]
    }
  }
  return null
}

/**
 * 从日记文件中提取 date 字段
 * @param {string} filePath
 * @returns {Promise<Date|null>}
 */
async function getFrontmatterDate(filePath) {
  if (isSupportedArticleFile(filePath)) {
    const fileContent = await fsPromises.readFile(filePath, 'utf-8')
    const { data } = matter(fileContent)
    if (data.date) {
      const d = new Date(data.date)
      if (!Number.isNaN(d.getTime())) {
        return d
      }
    }

    const commentDateMatch = fileContent.match(/<!--\s*date:\s*([\s\S]*?)\s*-->/i)
    if (commentDateMatch) {
      const d = new Date(commentDateMatch[1].trim())
      if (!Number.isNaN(d.getTime())) {
        return d
      }
    }
  }
  return null
}

/**
 * 通过 git log 获取文件的首次提交日期
 * @param {string} filePath
 * @param {string} [cwd] - git 命令的工作目录，默认为项目根目录
 * @returns {Date|null}
 */
function getGitFirstCommitDate(filePath, cwd) {
  try {
    const stdout = execSync(
      `git log --follow --format="%ad" --date=iso -- "${filePath}" | tail -n 1`,
      { encoding: 'utf-8', cwd: cwd || path.resolve(__dirname, '../../..') },
    )
    const d = new Date(stdout.trim())
    if (!Number.isNaN(d.getTime())) {
      return d
    }
  }
  catch {
    // 忽略 git 命令失败的情况
  }
  return null
}

/**
 * 将 Markdown 内容转换为纯文本
 * @param {string} markdown
 * @returns {string}
 */
function stripMarkdownToPlainText(markdown) {
  return markdown
    // 移除日记 HTML 元数据
    .replace(/<!--\s*date:\s*[\s\S]*?-->/gi, '')
    // 移除 frontmatter
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    // 移除 HTML 样式与脚本块，避免 HTML 日记的内联 CSS 污染摘要
    .replace(/<(style|script)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    // 移除代码块
    .replace(/```[\s\S]*?```/g, '')
    // 移除行内代码
    .replace(/`([^`]+)`/g, '$1')
    // 移除图片
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // 将链接转为纯文本
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 移除 HTML 标签
    .replace(/<[^>]+>/g, '')
    // 移除标题标记
    .replace(/^#{1,6}\s+/gm, '')
    // 移除引用标记
    .replace(/^>\s?/gm, '')
    // 移除列表标记
    .replace(/^[-*+\d]+\.\s+/gm, '')
    // 移除强调标记
    .replace(/(\*{1,2}|_{1,2})(.*?)\1/g, '$2')
    // 移除水平分割线
    .replace(/^-{3,}\s*$/gm, '')
    // 合并多余空行
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * 提取日记文件的正文纯文本预览（去除 Markdown/HTML 语法后前200字符）
 * @param {string} filePath
 * @returns {Promise<string|null>}
 */
async function getPreviewText(filePath) {
  if (isSupportedArticleFile(filePath)) {
    const fileContent = await fsPromises.readFile(filePath, 'utf-8')
    const { content } = matter(fileContent)
    const plainText = stripMarkdownToPlainText(content)
    if (plainText) {
      return plainText.length > 200 ? `${plainText.substring(0, 200)}...` : plainText
    }
  }
  return null
}

/**
 * 提取 Markdown 文件中第一个 h1 标题后的内容（直到下一个标题或空行）
 * @param {string} filePath
 * @returns {Promise<string|null>}
 */
async function getPostSummary(filePath) {
  if (filePath.endsWith('.md')) {
    const fileContent = await fsPromises.readFile(filePath, 'utf-8')
    const h1ContentMatch = fileContent.match(/^# .+\n+([\s\S]*?)(?=^#|^$|$)/m)
    if (h1ContentMatch && h1ContentMatch[1]) {
      const content = h1ContentMatch[1].trim()
      return content.length > 200 ? `${content.substring(0, 200)}...` : content
    }
  }
  return null
}

/**
 * 格式化日期为博客标准格式
 * @param {Date|string|number} date
 * @returns {string}
 */
function formatDate(date) {
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
  ]

  const d = new Date(date)
  const month = months[d.getMonth()]
  const day = d.getDate()
  const year = d.getFullYear()

  return `${month} ${day}, ${year} · Yoran`
}

module.exports = {
  getFirstImage,
  getFrontmatterDate,
  getGitFirstCommitDate,
  stripMarkdownToPlainText,
  getPreviewText,
  getPostSummary,
  isSupportedArticleFile,
  formatDate,
}

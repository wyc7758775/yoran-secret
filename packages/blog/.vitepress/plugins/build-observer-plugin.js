const crypto = require('node:crypto')
const fsPromises = require('node:fs/promises')
const path = require('node:path')
const process = require('node:process')
const matter = require('gray-matter')
const {
  getFirstImage,
  getFrontmatterDate,
  getGitFirstCommitDate,
  getPostSummary,
  formatDate,
} = require('./build-utils')

const argv = process.argv
const DEV = 'dev'

const observerPath = () => path.resolve(__dirname, '../../observer')
const outPutBasePath = () => path.resolve(__dirname, '../router')

const excludeDir = 'temp'

function normalizeSlug(slug) {
  if (typeof slug !== 'string') {
    return ''
  }

  return slug
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function createFallbackSlug(src) {
  return `p-${crypto.createHash('sha1').update(src).digest('hex').slice(0, 8)}`
}

function createObserverSlug({ frontmatterSlug, src }) {
  return normalizeSlug(frontmatterSlug) || createFallbackSlug(src)
}

function assertUniqueObserverSlugs(observerPosts) {
  const slugMap = new Map()

  observerPosts.forEach((post) => {
    if (slugMap.has(post.slug)) {
      const existingPost = slugMap.get(post.slug)
      throw new Error(`重复的 Observer slug: ${post.slug} (${existingPost.src}, ${post.src})`)
    }
    slugMap.set(post.slug, post)
  })
}

async function getObserverPosts() {
  const resolvePath = observerPath()

  let dirArr = await fsPromises.readdir(resolvePath)

  // DEV 环境有一些目录是不需要生产路由的
  if (argv[2] !== DEV) {
    dirArr = dirArr.filter(item => item !== excludeDir)
  }

  return Promise.all(
    dirArr.map(async (dirItemPath) => {
      const dirPath = `${resolvePath}/${dirItemPath}`
      const stat = await fsPromises.stat(dirPath)

      // 如果不是文件或者不是图片格式则跳过
      if (!stat.isFile()) {
        return null
      }
      if (stat.isFile()) {
        const src = `/observer/${dirItemPath}`
        const fileContent = await fsPromises.readFile(dirPath, 'utf-8')
        const { data: frontmatterData } = matter(fileContent)
        // 获取文件名（不包含扩展名）作为 caption
        const caption = path.parse(dirItemPath).name
        // 优先级：frontmatter date > git 首次提交时间 > 文件创建时间
        const frontmatterDate = await getFrontmatterDate(dirPath)
        const gitDate = getGitFirstCommitDate(dirPath)
        const dateObj = frontmatterDate || gitDate || stat.birthtime
        const createTime = formatDate(dateObj)

        // 获取文章的第一张图片
        const firstImage = await getFirstImage(dirPath)
        // 获取文章中第一个 h1 标签下面的描述
        const postSummary = await getPostSummary(dirPath)

        return {
          src,
          slug: createObserverSlug({
            frontmatterSlug: frontmatterData.slug,
            src,
          }),
          firstImage: firstImage ?? '',
          postSummary,
          caption,
          createTime,
          _sortDate: dateObj.getTime(),
        }
      }
      return null
    }),
  )
}

async function init() {
  const observerArr = await getObserverPosts()
  const validObserverArr = observerArr.filter(item => item !== null)

  assertUniqueObserverSlugs(validObserverArr)

  const sortedArr = validObserverArr
    .sort((a, b) => b._sortDate - a._sortDate)
    .map(({ _sortDate, ...rest }) => rest)

  const outPutFile = `${outPutBasePath()}/observer.js`
  const outPutDir = path.dirname(outPutFile)
  await fsPromises.mkdir(outPutDir, { recursive: true })

  await fsPromises.writeFile(
    outPutFile,
    `export default ${JSON.stringify(sortedArr)}`,
    {
      encoding: 'utf-8',
    },
  )
}

if (require.main === module) {
  init()
}

module.exports = {
  assertUniqueObserverSlugs,
  createObserverSlug,
}

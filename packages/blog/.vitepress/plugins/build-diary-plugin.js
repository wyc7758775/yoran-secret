const fsPromises = require('node:fs/promises')
const path = require('node:path')
const process = require('node:process')
const {
  getFirstImage,
  getFrontmatterDate,
  getGitFirstCommitDate,
  getPreviewText,
  isSupportedArticleFile,
  formatDate,
} = require('./build-utils')

const argv = process.argv
const DEV = 'dev'

const diaryPath = () => path.resolve(__dirname, '../../diary')
const outPutBasePath = () => path.resolve(__dirname, '../router')

const excludeDir = 'temp'

async function getDiaryPosts() {
  const resolvePath = diaryPath()

  let dirArr = []
  try {
    dirArr = await fsPromises.readdir(resolvePath)
  }
  catch {
    // 目录不存在或为空
    return []
  }

  if (argv[2] !== DEV) {
    dirArr = dirArr.filter(item => item !== excludeDir)
  }

  return Promise.all(
    dirArr.map(async (dirItemPath) => {
      const dirPath = `${resolvePath}/${dirItemPath}`
      const stat = await fsPromises.stat(dirPath)

      if (!stat.isFile()) {
        return null
      }
      if (stat.isFile()) {
        if (!isSupportedArticleFile(dirPath)) {
          return null
        }

        const caption = path.parse(dirItemPath).name
        const frontmatterDate = await getFrontmatterDate(dirPath)
        const gitDate = getGitFirstCommitDate(dirPath)
        const dateObj = frontmatterDate || gitDate || stat.birthtime
        const createTime = formatDate(dateObj)

        const firstImage = await getFirstImage(dirPath)
        const previewText = await getPreviewText(dirPath)

        return {
          src: `/diary/${dirItemPath}`,
          firstImage: firstImage ?? '',
          previewText,
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
  const diaryArr = await getDiaryPosts()
  const sortedArr = diaryArr
    .filter(item => item !== null)
    .sort((a, b) => b._sortDate - a._sortDate)
    .map(({ _sortDate, ...rest }) => rest)

  const outPutFile = `${outPutBasePath()}/diary.js`
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
init()

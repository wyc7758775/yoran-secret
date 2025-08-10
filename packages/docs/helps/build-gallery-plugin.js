/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fsPromises = require('fs/promises')

const argv = process.argv
const dev = 'dev'

const galleryPath = () => path.resolve(__dirname, '../assets/gallery')
const outPutBasePath = () => path.resolve(__dirname, '../.vitepress/router')

const mdFilePath = '/JSCore'
const excludeDir = 'temp'

const getGalleryItems = async (filePath) => {
  const resolvePath = galleryPath() 

  let dirArr = await fsPromises.readdir(resolvePath)

  // dev 环境有一些目录是不需要生产路由的
  if (argv[2] !== dev) {
    dirArr = dirArr.filter((item) => item !== excludeDir)
  }

  return Promise.all(
    dirArr.map(async (dirItemPath) => {
      const dirPath = `${resolvePath}/${dirItemPath}`
      const stat = await fsPromises.stat(dirPath)
      // 定义支持的图片格式
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
      // 获取文件扩展名
      const ext = path.extname(dirItemPath).toLowerCase()
      // 如果不是文件或者不是图片格式则跳过
      if (!stat.isFile() || !imageExtensions.includes(ext)) {
        return null
      }
      if (stat.isFile()) {
        // 获取文件名（不包含扩展名）作为 caption
        const caption = path.parse(dirItemPath).name
        // 获取文件创建时间
        const createTime = stat.birthtime.toISOString()
        return {
          src: `/gallery/${dirItemPath}`,
          caption,
          createTime
        }
      }
      return null
    })
  )
}

async function init() {
  const sideBarArr = await getGalleryItems(mdFilePath)
  const outPutFile = `${outPutBasePath()}/gallery.json`
  const outPutDir = path.dirname(outPutFile)
  await fsPromises.mkdir(outPutDir, { recursive: true })

  await fsPromises.writeFile(outPutFile, JSON.stringify(sideBarArr), {
    encoding: 'utf-8'
  })
}
init()

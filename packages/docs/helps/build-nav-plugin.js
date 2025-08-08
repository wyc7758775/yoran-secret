/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fsPromises = require('fs/promises')

const argv = process.argv
const dev = 'dev'

const documentsPath = () => path.resolve(__dirname, '../documents')
const outPutBasePath = () => path.resolve(__dirname, '../.vitepress/router')

const mdFilePath = '/JSCore'
const excludeDir = 'temp'

const getComponentsSideBar = async (filePath) => {
  const resolvePath = documentsPath() 

  let dirArr = await fsPromises.readdir(resolvePath)

  if (argv[2] !== dev) {
    dirArr = dirArr.filter((item) => item !== excludeDir)
  }

  return Promise.all(
    dirArr.map(async (dirItemPath) => {
      const dirPath = `${resolvePath}/${dirItemPath}`
      const fileArr = await fsPromises.readdir(dirPath)
      return {
        text: dirItemPath,
        collapsible: true,
        collapsed: false,
        items: await Promise.all(
          fileArr.map(async (fileName) => {
          const sideName = fileName.split('.')[0]
            return {
              text: sideName,
              link: `/documents/${dirItemPath}/${
                fileName.split('.')[0]
              }`
            }
          })
        )
      }
    })
  )
}

async function init() {
  const sideBarArr = await getComponentsSideBar(mdFilePath)
  const outPutFile = `${outPutBasePath()}/documentsRouter.json`
  const outPutDir = path.dirname(outPutFile)
  await fsPromises.mkdir(outPutDir, { recursive: true })

  await fsPromises.writeFile(outPutFile, JSON.stringify(sideBarArr), {
    encoding: 'utf-8'
  })
}
init()

// TODO: buildStart这个钩子会出现无限重启服务器的问题
// export default function sideBarPlugin() {
//   return {
//     buildStart: async () => {
//       const sideBarArr = await getComponentsSideBar(mdFilePath)
//       const outPutFile = `${outPutBasePath()}\\componentsSideBar.json`
//       console.log({ sideBarArr, outPutFile })
//       await fsPromises.writeFile(outPutFile, JSON.stringify(sideBarArr), {
//         encoding: 'utf-8'
//       })
//     }
//   }
// }
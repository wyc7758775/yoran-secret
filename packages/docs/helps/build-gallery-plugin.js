/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fsPromises = require("fs/promises");

const argv = process.argv;
const dev = "dev";

const galleryPath = () => path.resolve(__dirname, "../assets/gallery");
const outPutBasePath = () => path.resolve(__dirname, "../.vitepress/router");

const excludeDir = "temp";

const getGalleryItems = async () => {
  const resolvePath = galleryPath();
  let dirArr = await fsPromises.readdir(resolvePath);

  // 过滤掉不需要的目录
  if (argv[2] !== dev) {
    dirArr = dirArr.filter((item) => item !== excludeDir);
  }

  return Promise.all(
    dirArr.map(async (dirItemPath) => {
      const dirPath = `${resolvePath}/${dirItemPath}`;
      const stat = await fsPromises.stat(dirPath);
      // 定义支持的图片格式
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".bmp",
        ".svg",
      ];
      // 获取文件扩展名
      const ext = path.extname(dirItemPath).toLowerCase();
      // 如果不是文件或者不是图片格式则跳过
      if (!stat.isFile() || !imageExtensions.includes(ext)) {
        return null;
      }

      // 获取文件名（不包含扩展名）作为 caption
      const caption = path.parse(dirItemPath).name;
      // 获取文件创建时间
      const createTime = stat.birthtime.toISOString();
      return {
        src: dirItemPath, // 只保留文件名
        caption,
        createTime,
      };
    })
  );
};

async function init() {
  const galleryItems = await getGalleryItems();
  const outPutFile = `${outPutBasePath()}/gallery.js`;
  const outPutDir = path.dirname(outPutFile);
  await fsPromises.mkdir(outPutDir, { recursive: true });

  // 生成导入语句和数据
  const content = `// 自动生成的图片数据
// 此文件由build-gallery-plugin.js生成

export default ${JSON.stringify(galleryItems)};
`;

  await fsPromises.writeFile(outPutFile, content, {
    encoding: "utf-8",
  });
  console.log("gallery数据生成成功!");
}
init();

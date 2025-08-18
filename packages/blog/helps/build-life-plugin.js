/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fsPromises = require("fs/promises");

const argv = process.argv;
const DEV = "dev";

const lifePath = () => path.resolve(__dirname, "../life");
const outPutBasePath = () => path.resolve(__dirname, "../.vitepress/router");

const excludeDir = "temp";

const getFirstImage = async (filePath) => {
  if (filePath.endsWith(".md")) {
    const fileContent = await fsPromises.readFile(filePath, "utf-8");
    const firstImageMatch = fileContent.match(/!\[.*?\]\((.*?)\)/);
    if (firstImageMatch) {
      return firstImageMatch[1];
    }
  }
  return null;
};
const getPostSummary = async (filePath) => {
  if (filePath.endsWith(".md")) {
    const fileContent = await fsPromises.readFile(filePath, "utf-8");
    // 匹配h1标签后的普通文本内容，直到下一个标题、空行或文档结束
    // 正则表达式解释：
    // ^# .+ 匹配h1标题行
    // \n+ 匹配一个或多个换行符
    // ([\s\S]*?) 非贪婪模式匹配任意字符（包括换行符），直到遇到以下情况之一：
    //   (?=^#|^$|$) 前瞻断言，匹配下一个标题行、空行或文档结束
    const h1ContentMatch = fileContent.match(/^# .+\n+([\s\S]*?)(?=^#|^$|$)/m);
    if (h1ContentMatch && h1ContentMatch[1]) {
      // 去除首尾空白字符
      const content = h1ContentMatch[1].trim();
      // 可以选择限制返回内容的长度，以防文本过长
      return content.length > 200 ? content.substring(0, 200) + "..." : content;
    }
  }
  return null;
};
const getLifePosts = async () => {
  const resolvePath = lifePath();

  let dirArr = await fsPromises.readdir(resolvePath);

  // DEV 环境有一些目录是不需要生产路由的
  if (argv[2] !== DEV) {
    dirArr = dirArr.filter((item) => item !== excludeDir);
  }

  return Promise.all(
    dirArr.map(async (dirItemPath) => {
      const dirPath = `${resolvePath}/${dirItemPath}`;
      const stat = await fsPromises.stat(dirPath);

      // 如果不是文件或者不是图片格式则跳过
      if (!stat.isFile()) {
        return null;
      }
      if (stat.isFile()) {
        // 获取文件名（不包含扩展名）作为 caption
        const caption = path.parse(dirItemPath).name;
        // 获取文件创建时间并格式化
        const createTime = formatDate(stat.birthtime);

        // 获取文章的第一章图片
        const firstImage = await getFirstImage(dirPath);
        // 获取文章中第一个 h1 标签下面的描述
        const postSummary = await getPostSummary(dirPath);

        return {
          src: `/life/${dirItemPath}`,
          firstImage,
          postSummary,
          caption,
          createTime,
        };
      }
      return null;
    })
  );
};

async function init() {
  const lifeArr = await getLifePosts();
  const outPutFile = `${outPutBasePath()}/life.js`;
  const outPutDir = path.dirname(outPutFile);
  await fsPromises.mkdir(outPutDir, { recursive: true });

  await fsPromises.writeFile(
    outPutFile,
    `export default ${JSON.stringify(lifeArr)}`,
    {
      encoding: "utf-8",
    }
  );
}
init();

// 在文件顶部添加日期格式化函数
const formatDate = (date) => {
  // 月份缩写
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const d = new Date(date);
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  // 格式化为：DEC 25, 2024 · MARVIX
  return `${month} ${day}, ${year} · MARVIX`;
};

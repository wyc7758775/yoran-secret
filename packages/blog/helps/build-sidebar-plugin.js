/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fsPromises = require("fs/promises");

const argv = process.argv;
const dev = "dev";

const documentsPath = () => path.resolve(__dirname, "../posts");
const outPutBasePath = () => path.resolve(__dirname, "../.vitepress/router");

const mdFilePath = "/JSCore";
const excludeDir = "temp";

const getComponentsSideBar = async () => {
  const resolvePath = documentsPath();

  let dirArr = await fsPromises.readdir(resolvePath);

  if (argv[2] !== dev) {
    dirArr = dirArr.filter((item) => item !== excludeDir);
  }

  dirArr = dirArr.filter((item) => item !== ".DS_Store");

  return Promise.all(
    dirArr.map(async (dirItemPath) => {
      const dirPath = `${resolvePath}/${dirItemPath}`;
      let fileArr = await fsPromises.readdir(dirPath);
      fileArr = fileArr.filter((item) => item !== ".DS_Store");
      return {
        text: dirItemPath,
        collapsible: true,
        collapsed: false,
        items: await Promise.all(
          fileArr.map(async (fileName) => {
            const sideName = fileName.split(".")[0];
            return {
              text: sideName,
              link: `/posts/${dirItemPath}/${fileName.split(".")[0]}`,
            };
          })
        ),
      };
    })
  );
};

async function writeSidebarData() {
  const sideBarArr = await getComponentsSideBar(mdFilePath);
  const outPutFile = `${outPutBasePath()}/sidebar.json`;
  const outPutDir = path.dirname(outPutFile);
  await fsPromises.mkdir(outPutDir, { recursive: true });

  await fsPromises.writeFile(outPutFile, JSON.stringify(sideBarArr), {
    encoding: "utf-8",
  });
}
// writeSidebarData();

// 导出VitePress插件
module.exports = function sideBarPlugin() {
  let watcher = null;
  let lastWriteTime = 0;
  const DEBOUNCE_TIME = 1000; // 防抖时间，避免频繁更新

  return {
    name: "build-nav-plugin",
    async buildStart() {
      // 首次构建时生成侧边栏
      await writeSidebarData();
    },

    configureServer(server) {
      // 开发服务器启动时设置文件监听
      if (server && server.watcher) {
        watcher = server.watcher;

        // 监听posts目录下的所有变化
        watcher.add(documentsPath());

        // 监听文件变化事件
        watcher.on("add", (path) => handleFileChange(path));
        watcher.on("change", (path) => handleFileChange(path));
        watcher.on("unlink", (path) => handleFileChange(path));
      }
    },

    closeBundle() {
      // 构建完成时再次更新侧边栏
      if (!watcher) {
        writeSidebarData();
      }
    },
  };

  // 处理文件变化的防抖函数
  function handleFileChange(path) {
    const now = Date.now();
    // 只处理posts目录下的md文件和目录变化
    if (
      path.includes("/posts/") &&
      (path.endsWith(".md") || isDirectoryPath(path))
    ) {
      if (now - lastWriteTime > DEBOUNCE_TIME) {
        lastWriteTime = now;
        setTimeout(() => {
          console.log(`检测到变化: ${path}`);
          writeSidebarData();
        }, DEBOUNCE_TIME);
      }
    }
  }

  // 判断路径是否可能是目录（简化判断）
  function isDirectoryPath(path) {
    return !path.includes(".") || path.endsWith("/");
  }
};

// 允许直接运行该脚本
if (require.main === module) {
  writeSidebarData();
}

/* eslint-disable @typescript-eslint/no-var-requires */
import path from "path";
import fsPromises from "fs/promises";
import process from "process";

const argv = process.argv;
const dev = "dev";

const documentsPath = () =>
  path.resolve(new URL(".", import.meta.url).pathname, "../posts");
const outPutBasePath = () =>
  path.resolve(new URL(".", import.meta.url).pathname, "../.vitepress/router");
const sidebarOutputPath = () => path.resolve(outPutBasePath(), "sidebar.json");

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
  const outPutFile = sidebarOutputPath();
  const outPutDir = path.dirname(outPutFile);

  // 确保目录存在
  await fsPromises.mkdir(outPutDir, { recursive: true });

  // 写入文件
  await fsPromises.writeFile(outPutFile, JSON.stringify(sideBarArr), {
    encoding: "utf-8",
  });
}

writeSidebarData();

const fs = require("fs");
const path = require("path");
const https = require("https"); // 使用Node.js内置的https模块发起请求

/**
 * 从B站视频URL中提取BV号
 */
function extractBvNumber(url) {
  const match = url.match(/BV[0-9A-Za-z]+/);
  return match ? match[0] : "";
}

/**
 * 通过API接口获取B站视频封面URL
 * @param {string} bv - B站视频BV号
 * @returns {Promise<string>} - 返回封面图片URL
 */
function getBilibiliCoverUrlByApi(bv) {
  return new Promise((resolve, reject) => {
    // 从BV号中提取ID部分（去掉开头的"BV"）
    const bvId = bv.replace("BV", "");

    const apiUrl = `https://apiv2.magecorn.com/bilicover/get?type=bv&id=${bvId}&client=2.6.0`;

    https
      .get(apiUrl, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            // 根据API返回的结构解析封面URL
            if (result.code === 0) {
              resolve({
                title: result.title,
                cover: result.url,
                desc: result.desc,
              });
            } else {
              console.warn(`API返回错误: ${result || "未知错误"}`);
              resolve({});
            }
          } catch (error) {
            console.error("解析API返回数据失败:", error);
            resolve({});
          }
        });
      })
      .on("error", (error) => {
        console.error("API请求失败:", error);
        resolve({});
      });
  });
}

/**
 * 处理视频源数据，为每个视频添加封面URL
 * @param {Array} videoSource - 视频源数据
 * @returns {Promise<Array>} - 处理后的视频数据
 */
async function processVideoData(videoSource) {
  const processedVideos = [];

  // 逐个处理视频，确保API调用完成
  for (const video of videoSource) {
    const bvNumber = extractBvNumber(video.src);

    if (!bvNumber) {
      processedVideos.push({
        ...video,
      });
      continue;
    }

    const { title, cover, desc } = await getBilibiliCoverUrlByApi(bvNumber);

    processedVideos.push({
      ...video,
      bv: bvNumber,
      cover,
      title,
      desc,
    });
  }

  return processedVideos;
}

/**
 * 将处理后的视频数据写入到video-cover.js文件
 */
function writeVideoCoverFile(processedData) {
  const outputPath = path.resolve(
    __dirname,
    "../.vitepress/router/video-cover.js"
  );

  // 生成导出的JavaScript代码
  const fileContent = `// 自动生成的视频封面数据
export default ${JSON.stringify(processedData, null, 2)};
`;

  // 写入文件
  fs.writeFileSync(outputPath, fileContent, "utf-8");
  console.log(`视频封面数据已成功生成到: ${outputPath}`);
  return processedData;
}

/**
 * 读取并解析video.js文件内容
 */
function readVideoSource() {
  const videoJsPath = path.resolve(__dirname, "../.vitepress/router/video.js");

  try {
    const fileContent = fs.readFileSync(videoJsPath, "utf-8");

    // 更稳健的解析方法：移除export default语句，使用Function构造函数安全评估
    const arrayContent = fileContent.replace(/^export\s+default\s+/, "");

    // 使用Function构造函数安全地评估JavaScript数组
    const videoData = Function(`return ${arrayContent}`)();

    return videoData;
  } catch (error) {
    console.error("读取video.js文件时出错:", error);
    throw error;
  }
}

/**
 * 主函数：读取视频数据、处理并生成封面数据文件
 */
async function main() {
  try {
    // 读取video.js文件内容
    const videoSource = readVideoSource();

    // 处理视频数据，添加封面URL（异步处理）
    const processedData = await processVideoData(videoSource);

    // 写入到video-cover.js文件
    writeVideoCoverFile(processedData);

    console.log("视频封面数据生成成功！");
  } catch (error) {
    console.error("生成视频封面数据时出错:", error);
    process.exit(1);
  }
}

// 执行主函数
main();

// 为了兼容可能的CommonJS模块导入
module.exports = {
  extractBvNumber,
  getBilibiliCoverUrlByApi,
  processVideoData,
  writeVideoCoverFile,
  readVideoSource,
};

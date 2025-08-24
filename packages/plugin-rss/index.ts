import fs from "fs";
import path from "path";
import { Feed } from "feed";
import matter from "gray-matter";

const baseUrl = "https://wyc7758775.github.io/yoran-secret/";
const authorName = "Yoran";
const email = "295563358@qq.com";

/**
 * 作者信息接口
 */
interface Author {
  name: string;
  email: string;
}

/**
 * RSS插件选项接口
 */
interface RssPluginOptions {
  baseUrl?: string;
  feedPath?: string;
  title?: string;
  description?: string;
  author?: Author;
  contentDir?: string;
  publishedDateExtractor?: (content: string) => Date;
}

/**
 * 文章信息接口
 */
interface Article {
  title: string;
  content: string;
  date: Date;
  link: string;
}

/**
 * 输出包接口
 */
interface OutputBundle {
  [key: string]: { 
    type: string;
    name?: string;
    source: string;
    fileName: string;
  };
}

/**
 * Vite插件接口
 */
interface VitePlugin {
  name: string;
  enforce: string;
  generateBundle: (options: any, bundle: OutputBundle) => Promise<void>;
}

/**
 * VitePress RSS 插件
 * 用于生成博客的RSS订阅源
 * @param options 插件配置选项
 * @returns Vite插件对象
 */
export default function rssPlugin(options: Record<string, any> = {}): VitePlugin {
  // 默认配置
  const defaultOptions: Required<RssPluginOptions> = {
    baseUrl,
    feedPath: "/rss.xml",
    title: "Blog Posts",
    description: "Latest blog posts",
    author: {
      name: authorName,
      email,
    },
    contentDir: "posts",
    publishedDateExtractor: (fileContent: string) => {
      // 尝试从文件内容中提取发布日期
      const match = fileContent.match(/发布日期[:：]\s*([\d\-]+)/);
      return match ? new Date(match[1]) : new Date();
    },
  };

  const config: Required<RssPluginOptions> = { ...defaultOptions, ...options };

  return {
    name: "vitepress-plugin-rss",
    enforce: "post",
    async generateBundle(_: any, bundle: OutputBundle): Promise<void> {
      try {
        // 创建Feed实例
        const feed = new Feed({
          title: config.title,
          description: config.description,
          id: config.baseUrl,
          link: config.baseUrl,
          language: "zh-CN",
          image: `${config.baseUrl}/favicon.ico`,
          favicon: `${config.baseUrl}/favicon.ico`,
          copyright: `All rights reserved ${new Date().getFullYear()}, ${config.author.name}`,
          author: config.author,
        });

        // 读取所有文章文件
        const postsDir = path.resolve(process.cwd(), config.contentDir);
        const articles = await collectArticles(postsDir, config);

        // 按发布日期排序，最新的在前
        articles.sort((a: Article, b: Article) => b.date.getTime() - a.date.getTime());

        // 添加文章到Feed
        for (const article of articles) {
          // 获取文章内容的纯文本摘要（前300个字符）
          const plainText = article.content
            .replace(/\[(.+?)\]\(.+?\)/g, "$1") // 移除链接
            .replace(/[#*_~`]/g, "") // 移除Markdown标记
            .replace(/\n+/g, " ") // 替换换行符为空格
            .trim();

          const summary = 
            plainText.length > 300
              ? plainText.substring(0, 300) + "..."
              : plainText;

          // 构建文章链接
          const articleLink = `${config.baseUrl}${article.link}`;

          // 添加到Feed
          feed.addItem({
            title: article.title,
            id: articleLink,
            link: articleLink,
            description: summary,
            content: article.content,
            author: [config.author],
            contributor: [config.author],
            date: article.date,
          });
        }

        // 生成XML格式的RSS
        const rssXml = feed.rss2();

        // 将RSS内容添加到输出包中
        bundle["rss.xml"] = {
          type: "asset",
          name: "RSS Feed",
          source: rssXml,
          fileName: "rss.xml",
        };

        console.log("✅ RSS feed generated successfully");
      } catch (error: any) {
        console.error("❌ Failed to generate RSS feed:", error);
      }
    },
  };
}

/**
 * 收集所有文章信息
 * @param dir 文章目录路径
 * @param config 配置对象
 * @returns {Promise<Article[]>} 文章信息数组
 */
async function collectArticles(dir: string, config: Required<RssPluginOptions>): Promise<Article[]> {
  const articles: Article[] = [];

  // 递归读取目录
  async function readDir(currentDir: string): Promise<void> {
    const entries = await fs.promises.readdir(currentDir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await readDir(fullPath);
      } else if (entry.isFile() && path.extname(entry.name) === ".md") {
        // 读取Markdown文件内容
        const content = await fs.promises.readFile(fullPath, "utf-8");
        const { data } = matter(content);

        // 提取文章标题（从文件名或frontmatter中）
        const title = data.title || path.basename(entry.name, ".md");

        // 提取发布日期
        const date = data.date
          ? new Date(data.date)
          : config.publishedDateExtractor(content);

        // 构建文章链接（基于文件路径）
        const relativePath = path.relative(
          path.resolve(process.cwd(), config.contentDir),
          fullPath
        );
        const link = `/${config.contentDir}/${relativePath.replace(
          /\.md$/,
          ""
        )}`;

        articles.push({
          title: title as string,
          content,
          date,
          link,
        });
      }
    }
  }

  await readDir(dir);
  return articles;
}

// 导出插件默认函数
export { rssPlugin };

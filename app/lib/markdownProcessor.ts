/**
 * 文章管理模塊
 * 
 * 負責處理文章的讀取、解析和管理。
 * 使用文件系統存儲文章，支持 Markdown 格式和 frontmatter 元數據。
 * 
 * 被以下組件使用：
 * 1. app/blog/[slug]/page.tsx - 獲取單篇文章數據
 * 2. app/blog/page.tsx - 獲取文章列表
 * 3. app/blog/category/[category]/page.tsx - 獲取特定分類的文章
 * 
 * 依賴的外部模塊：
 * - fs: 文件系統操作
 * - path: 路徑處理
 * - gray-matter: Markdown frontmatter 解析
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';  // 需要安裝: npm install gray-matter
import { Article } from '@/app/types/article';

/**
 * 文章存儲目錄的絕對路徑
 */
const articlesDirectory = path.join(process.cwd(), 'content/posts');

/**
 * 獲取所有 MDX 文件
 */
async function getAllArticleFiles(dir: string): Promise<string[]> {
  let results: string[] = [];
  const items = await fs.promises.readdir(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.promises.stat(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(await getAllArticleFiles(fullPath));
    } else if (item.endsWith('.mdx')) {  // 改為 .mdx
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * 在所有分類目錄中尋找文章文件
 */
async function findArticleFile(id: string): Promise<string | null> {
  try {
    // 1. 獲取所有分類目錄
    const categories = await fs.promises.readdir(articlesDirectory);
    
    // 2. 在每個分類目錄中尋找文件
    for (const category of categories) {
      const categoryPath = path.join(articlesDirectory, category);
      const stat = await fs.promises.stat(categoryPath);
      
      // 跳過非目錄
      if (!stat.isDirectory()) continue;
      
      const filePath = path.join(categoryPath, `${id}.mdx`);
      
      // 檢查文件是否存在
      if (await fs.promises.access(filePath).then(() => true).catch(() => false)) {
        return filePath;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error finding article file ${id}:`, error);
    return null;
  }
}

/**
 * 獲取單篇文章數據
 */
export async function getArticle(id: string): Promise<Article | null> {
  try {
    // 使用動態導入替代文件讀取
    const { default: MDXContent, frontmatter } = await import(
      `@/content/posts/${id}.mdx`
    );

    // 驗證必要字段
    if (!frontmatter.title || !frontmatter.categories) {
      console.warn(`Article ${id} is missing required fields`);
      return null;
    }

    return {
      id,
      title: frontmatter.title,
      date: frontmatter.date,
      categories: Array.isArray(frontmatter.categories) ? frontmatter.categories : [frontmatter.category],
      coverImageUrl: frontmatter.coverImageUrl,
      excerpt: frontmatter.excerpt,
      content: MDXContent
    };
  } catch (error) {
    console.error(`Error processing article ${id}:`, error);
    return null;
  }
}

/**
 * 獲取所有文章數據
 */
export async function getAllArticles(): Promise<Article[]> {
  try {
    if (!await fs.promises.access(articlesDirectory).then(() => true).catch(() => false)) {
      console.warn('Articles directory does not exist:', articlesDirectory);
      return [];
    }

    const filePaths = await getAllArticleFiles(articlesDirectory);
    
    if (!filePaths.length) {
      console.warn('No articles found in directory:', articlesDirectory);
      return [];
    }
    
    const articles = await Promise.all(
      filePaths.map(async filePath => {
        try {
          // 只取文件名，不包含路徑和副檔名
          const id = path.basename(filePath, '.mdx');
          
          const article = await getArticle(id);
          return article;
        } catch (error) {
          console.error(`Error processing file ${filePath}:`, error);
          return null;
        }
      })
    );

    return articles
      .filter((article): article is Article => article !== null)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error in getAllArticles:', error);
    return [];
  }
}

/**
 * 獲取特定分類的文章
 */
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter(article => 
    article.categories.includes(category)  // 直接使用 categories 數組
  );
}

/**
 * 文件結構說明：
 * content/posts/
 * ├── category1/
 * │   ├── post1.mdx
 * │   └── post2.mdx
 * └── category2/
 *     └── post3.mdx
 * 
 * MDX 文件格式：
 * ---
 * title: 文章標題
 * categories: [分類1, 分類2]  # 必需，至少包含一個分類
 * date: YYYY-MM-DD
 * coverImageUrl: 封面圖片URL
 * excerpt: 文章摘要
 * ---
 * 
 * 文章內容...
 * 
 * <MDXImage 
 *   src="/path/to/image.jpg"
 *   seo={{ altText: "圖片描述" }}
 *   pin={{ description: "Pinterest 描述" }}
 * />
 */ 
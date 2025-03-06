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

/**
 * 單篇文章的完整數據結構
 * 定義了從 Markdown 文件中解析出的所有必要屬性
 */
interface SingleArticle {
  /** 文章唯一標識符，基於文件名生成 */
  id: string;
  /** Markdown 格式的文章內容 */
  content: string;
  /** 文章標題 */
  title: string;
  /** 文章分類列表，支持多分類 */
  categories: string[];
  /** 發布日期，格式：YYYY-MM-DD */
  date: string;
  /** 文章封面圖片 URL */
  coverImageUrl: string;
  /** 文章摘要，用於列表展示 */
  excerpt: string;
}

/** 文章存儲目錄的絕對路徑 */
const postsDirectory = path.join(process.cwd(), 'content/posts');

/**
 * 遞迴獲取指定目錄下的所有 Markdown 文件
 * 
 * 遍歷目錄及其子目錄，收集所有 .md 文件的路徑。
 * 支持任意深度的目錄結構。
 * 
 * @param dir - 要搜索的目錄路徑
 * @returns 所有找到的 Markdown 文件的完整路徑數組
 */
function getAllMarkdownFiles(dir: string): string[] {
  let results: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 遞迴處理子目錄
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      // 收集 Markdown 文件
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * 獲取所有文章數據
 * 
 * 讀取並解析所有 Markdown 文件，提取文章內容和元數據。
 * 包含錯誤處理和數據驗證。
 * 
 * 功能：
 * 1. 遞迴讀取所有文章文件
 * 2. 解析 frontmatter 和 Markdown 內容
 * 3. 驗證必要字段
 * 4. 按日期排序
 * 
 * 錯誤處理：
 * - 目錄不存在時返回空數組
 * - 單個文件處理失敗時跳過該文件
 * - 所有錯誤都會被記錄
 * 
 * @returns 處理後的文章數組，按日期降序排序
 */
export function getAllPosts(): SingleArticle[] {
  try {
    // 確保目錄存在
    if (!fs.existsSync(postsDirectory)) {
      console.warn('Posts directory does not exist:', postsDirectory);
      return [];
    }

    // 獲取所有 .md 文件的路徑
    const filePaths = getAllMarkdownFiles(postsDirectory);
    
    // 如果沒有文件，返回空數組
    if (!filePaths || filePaths.length === 0) {
      console.warn('No posts found in directory:', postsDirectory);
      return [];
    }
    
    // 處理每個文件
    const allArticles = filePaths.map((filePath) => {
      try {
        // 從文件路徑生成 id（只使用文件名）
        const relativePath = path.relative(postsDirectory, filePath);
        const pathParts = relativePath.split(path.sep);
        const id = pathParts[pathParts.length - 1].replace(/\.md$/, '');

        // 讀取並解析 Markdown 文件
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        // 驗證必要字段
        if (!data.title || !data.categories || !Array.isArray(data.categories)) {
          console.warn(`Post ${filePath} is missing required fields`);
          return null;
        }

        // 驗證分類格式
        const invalidCategories = data.categories.filter(
          (category: string) => 
            typeof category !== 'string' || 
            category.trim().length === 0
        );
        
        if (invalidCategories.length > 0) {
          console.warn(
            `Post ${filePath} has invalid category format. Categories must be non-empty strings.`
          );
          return null;
        }

        // 組合並返回文章數據
        return {
          id,
          content,
          ...(data as Omit<SingleArticle, 'id' | 'content'>),
        };
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        return null;
      }
    }).filter((article): article is SingleArticle => article !== null);  // 過濾掉處理失敗的文章

    // 按日期降序排序並返回
    return allArticles.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    return [];
  }
}

/**
 * 文件結構說明：
 * content/posts/
 * ├── category1/
 * │   ├── post1.md
 * │   └── post2.md
 * └── category2/
 *     └── post3.md
 * 
 * Markdown 文件格式：
 * ---
 * title: 文章標題
 * categories: [分類1, 分類2]
 * date: YYYY-MM-DD
 * coverImageUrl: 封面圖片URL
 * excerpt: 文章摘要
 * ---
 * 
 * 文章內容...
 */ 
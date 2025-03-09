/**
 * 文章管理模塊
 * 
 * 負責處理文章的讀取和管理。
 * 使用文件系統存儲文章，支持 MDX 格式和 frontmatter 元數據。
 * 
 * 被以下組件使用：
 * 1. app/blog/[slug]/page.tsx - 獲取單篇文章數據
 * 2. app/blog/page.tsx - 獲取文章列表
 * 3. app/blog/category/[category]/page.tsx - 獲取特定分類的文章
 * 
 * 依賴的外部模塊：
 * - fs: 文件系統操作
 * - path: 路徑處理
 */

import fs from 'fs';
import path from 'path';
import { Article } from '@/app/types/article';
import { ComponentType } from 'react';
import { getImageUrl } from './imageUtils';

interface AllSlugsWithRelativePath {
  /** 文章的唯一標識符（文件名，不含副檔名） */
  slug: string;
  /** 文章的相對路徑 */
  relativePath: string;
}
/**
 * 文章存儲目錄的絕對路徑
 */
const articlesDirectory = path.join(process.cwd(), 'content/posts');

/**
 * 獲取所有文章路徑（包含分類信息）
 * 用於生成靜態路徑和導入文章
 */
async function getAllSlugsWithRelativePath(): Promise<AllSlugsWithRelativePath[]> {
  try {
    const allSlugsWithRelativePath: AllSlugsWithRelativePath[] = [];
    const allRelativePaths = await fs.promises.readdir(articlesDirectory);

    for (const relativePath of allRelativePaths) {
      const absolutePath = path.join(articlesDirectory, relativePath);
      const stat = await fs.promises.stat(absolutePath);
      
      // 跳過非目錄
      if (!stat.isDirectory()) continue;

      const files = await fs.promises.readdir(absolutePath);
      files
        .filter(file => file.endsWith('.mdx'))
        .forEach(file => {
          allSlugsWithRelativePath.push({
            slug: file.replace(/\.mdx$/, ''),
            relativePath
          });
        });
    }
    return allSlugsWithRelativePath;
  } catch (error) {
    console.error('Error in getAllSlugWithRelativePath:', error);
    return [];
  }
}

/**
 * 獲取所有文章數據
 * 用於文章列表頁面和分類頁面
 */
export async function getAllArticles(): Promise<Article[]> {
  console.log('getAllArticles called'); // 日誌函數被調用
  try {
    const allSlugsWithRelativePath: AllSlugsWithRelativePath[] = await getAllSlugsWithRelativePath();
    console.log('All Article Slugs with Category:', allSlugsWithRelativePath); // 日誌所有文章的 slug 和分類

    const articles: (Article | null)[] = await Promise.all(
      allSlugsWithRelativePath.map(async ({ slug, relativePath }) => {
        try {
          const { default: MDXContent, frontmatter }: { default: ComponentType; frontmatter: any } = await import(
            `@/content/posts/${relativePath}/${slug}.mdx`
          );

          // 驗證必要字段
          if (!frontmatter.title || !frontmatter.categories) {
            console.warn(`Article ${slug} is missing required fields`);
            return null;
          }

          console.log(`Processing article: ${slug}, Category: ${relativePath}`); // 日誌正在處理的文章

          return {
            id: slug,
            title: frontmatter.title,
            date: frontmatter.date,
            categories: Array.isArray(frontmatter.categories) ? frontmatter.categories : [frontmatter.category],
            coverImageUrl: getImageUrl(frontmatter.coverImageUrl, 'hero'),
            excerpt: frontmatter.excerpt,
            content: MDXContent
          } as Article;
        } catch (error) {
          console.error(`Error processing article ${slug}:`, error);
          return null;
        }
      })
    );

    console.log('Articles fetched:', articles); // 日誌獲取的所有文章
    return articles.filter((article): article is Article => article !== null)
                   .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error in getAllArticles:', error);
    return [];
  }
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
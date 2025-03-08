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

interface AllArticleSlugWithCategory {
  /** 文章的唯一標識符（文件名，不含副檔名） */
  slug: string;
  /** 文章所屬分類（目錄名） */
  category: string;
}
/**
 * 文章存儲目錄的絕對路徑
 */
const articlesDirectory = path.join(process.cwd(), 'content/posts');

/**
 * 獲取所有文章路徑（包含分類信息）
 * 用於生成靜態路徑和導入文章
 */
async function getAllArticleSlugWithCategory(): Promise<AllArticleSlugWithCategory[]> {
  try {
    const allArticleSlugsWithCategory: AllArticleSlugWithCategory[] = [];
    const categories = await fs.promises.readdir(articlesDirectory);

    for (const category of categories) {
      const categoryPath = path.join(articlesDirectory, category);
      const stat = await fs.promises.stat(categoryPath);
      
      // 跳過非目錄
      if (!stat.isDirectory()) continue;

      const files = await fs.promises.readdir(categoryPath);
      files
        .filter(file => file.endsWith('.mdx'))
        .forEach(file => {
          allArticleSlugsWithCategory.push({
            slug: file.replace(/\.mdx$/, ''),
            category
          });
        });
    }
    return allArticleSlugsWithCategory;
  } catch (error) {
    console.error('Error in getAllArticleSlugsWithCategory:', error);
    return [];
  }
}

/**
 * 獲取所有文章數據
 * 用於文章列表頁面和分類頁面
 */
export async function getAllArticles(): Promise<Article[]> {
  try {
    const allArticleSlugsWithCategory: AllArticleSlugWithCategory[] = await getAllArticleSlugWithCategory();
    
    const articles: (Article | null)[] = await Promise.all(
      allArticleSlugsWithCategory.map(async ({ slug, category }) => {
        try {
          // 使用完整路徑導入 MDX
          const { default: MDXContent, frontmatter }: { default: ComponentType; frontmatter: any } = await import(
            `@/content/posts/${category}/${slug}.mdx`
          );

          // 驗證必要字段
          if (!frontmatter.title || !frontmatter.categories) {
            console.warn(`Article ${slug} is missing required fields`);
            return null;
          }

          return {
            id: slug,
            title: frontmatter.title,
            date: frontmatter.date,
            categories: Array.isArray(frontmatter.categories) ? frontmatter.categories : [frontmatter.category],
            coverImageUrl: getImageUrl(frontmatter.coverImageUrl, 'hero'), // 使用 getImageUrl 處理 coverImageUrl
            excerpt: frontmatter.excerpt,
            content: MDXContent
          }as Article; // 確保返回的物件符合 Article 類型
        } catch (error) {
          console.error(`Error processing article ${slug}:`, error);
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
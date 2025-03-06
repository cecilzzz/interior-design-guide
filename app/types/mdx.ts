import type { ReactNode } from 'react';
import type { ImageData } from './image';

/**
 * MDX 組件的 props 類型
 */
export interface MDXComponentProps {
  /** 自定義組件映射表 */
  components?: Record<string, React.ComponentType<any>>;
}

/**
 * MDX 文章的 frontmatter 類型
 */
export interface MDXFrontmatter {
  /** 文章標題 */
  title: string;
  /** 發布日期 */
  date: string;
  /** 文章分類 */
  category: string;
  /** 文章封面圖片 URL */
  coverImageUrl: string;
  /** 文章摘要 */
  excerpt: string;
  /** 文章分類（可選，用於多分類） */
  categories?: string[];
}

/**
 * MDX 文章的完整類型
 */
export interface MDXArticle {
  /** 文章的 frontmatter 數據 */
  frontmatter: MDXFrontmatter;
  /** 編譯後的 MDX 代碼 */
  code: string;
} 
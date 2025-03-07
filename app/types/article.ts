import { ComponentType } from 'react';

/**
 * 單篇文章的完整數據結構
 * 定義了從 Markdown 文件中解析出的所有必要屬性
 */
export interface Article {
  /** 文章唯一標識符，基於文件名生成 */
  id: string;
  /** 文章內容組件 */
  content: ComponentType;
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

/**
 * 相關文章的數據結構
 * 用於文章詳情頁面中顯示相關文章
 */
export interface RelatedArticle {
  /** 文章分類 */
  category: string;
  /** 文章標題 */
  title: string;
  /** 文章封面圖片 URL */
  coverImageUrl: string;
  /** 文章鏈接 */
  link: string;
}

/**
 * 推薦文章的數據結構
 * 用於側邊欄顯示推薦文章
 */
export interface RecommendedArticle {
  /** 文章標題 */
  title: string;
  /** 文章封面圖片 URL */
  coverImageUrl: string;
  /** 文章鏈接 */
  link: string;
} 
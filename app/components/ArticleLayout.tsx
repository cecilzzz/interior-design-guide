import ArticleRenderer from "./ArticleRenderer";
import RelatedPosts from "./RelatedPosts";
import { getImageUrl } from '@/app/lib/imageUtils';
import ReactMarkdown from 'react-markdown';
import { Article, RelatedArticle } from '@/app/types/article';
/**
 * ArticleLayout 組件
 * 
 * 負責文章頁面的整體佈局結構，組織主要內容和相關內容。
 * 這是一個純佈局組件，不包含具體的渲染邏輯。
 * 
 * 被以下組件使用：
 * - ArticlePage (app/blog/[slug]/ArticlePage.tsx) - 作為客戶端渲染的容器
 * 
 * 使用的子組件：
 * - ArticleRenderer: 渲染文章主體內容
 * - RelatedPosts: 顯示相關文章列表
 * 
 * 功能：
 * 1. 組織文章頁面的整體結構
 * 2. 整合主要文章內容和相關文章
 * 3. 控制內容間的間距和佈局
 * 
 * 佈局特點：
 * - 使用 space-y-16 確保主要內容和相關文章之間有適當間距
 * - 純組合型組件，將渲染邏輯委託給子組件
 */

interface ArticleLayoutProps {
  /** 當前文章數據 */
  currentArticle: Omit<Article, 'id' | 'categories' | 'excerpt'> & { category: string };
  /** 相關文章列表 */
  relatedArticles: RelatedArticle[];
}

/**
 * 文章頁面的佈局組件
 * 
 * @param props - 組件屬性
 * @param props.currentArticle - 當前文章的完整數據
 * @param props.relatedArticles - 相關文章列表
 */
export default function ArticleLayout({ currentArticle, relatedArticles }: ArticleLayoutProps) {
  return (
    <div className="space-y-16">
      {/* 主要文章內容 */}
      <ArticleRenderer currentArticle={currentArticle} />
      {/* 相關文章列表 */}
      <RelatedPosts posts={relatedArticles} />
    </div>
  );
}

/**
 * 組件職責說明：
 * 1. 作為頁面主要內容的容器
 * 2. 組織主要文章和相關文章的佈局
 * 3. 通過 props 傳遞數據給子組件
 * 
 * 注意：Markdown 的處理已經移到 ArticleRenderer 組件中，
 * 該組件使用 ReactMarkdown 來渲染內容並處理圖片優化 
 */
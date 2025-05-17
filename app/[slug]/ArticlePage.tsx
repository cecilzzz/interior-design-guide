'use client';

import { useEffect } from 'react';
import ArticleLayout from '@/app/components/ArticleLayout';
import { trackArticleRead, trackScrollDepth, trackTimeOnPage } from '@/app/lib/analytics';
import { Article } from 'contentlayer/generated';

/**
 * ArticlePage 組件
 * 
 * 客戶端容器組件，負責處理所有客戶端特定的功能和分析追蹤。
 * 這是一個 Client Component，使用 'use client' 指令。
 * 
 * 被以下組件使用：
 * - app/blog/[slug]/page.tsx - 作為頁面的客戶端入口點
 * 
 * 使用的子組件：
 * - ArticleLayout: 處理文章頁面的整體佈局
 * 
 * 依賴的工具：
 * - @/app/utils/analytics: 提供各種分析追蹤功能
 * 
 * 功能：
 * 1. 初始化並管理所有分析追蹤
 * 2. 處理文章閱讀相關的客戶端邏輯
 * 3. 作為客戶端功能的容器
 * 
 * 追蹤功能：
 * - 文章閱讀追蹤
 * - 頁面滾動深度追蹤
 * - 停留時間追蹤
 */

interface ArticlePageProps {
  /** 當前文章數據 */
  article: Article;
  /** 相關文章列表 */
  relatedArticles: Article[];
  /** 推薦文章列表 */
  recommendedArticles: Article[];
}

/**
 * 文章頁面的客戶端容器組件
 * 
 * @param props - 組件屬性
 * @param props.currentArticle - 當前文章完整數據
 * @param props.relatedArticles - 相關文章列表
 * @param props.recommendedArticles - 推薦文章列表
 */
export default function ArticlePage({ 
  article, 
  relatedArticles, 
  recommendedArticles 
}: ArticlePageProps) {
  useEffect(() => {
    // 初始化所有追蹤功能
    const cleanupArticleRead = trackArticleRead(article.title);
    const cleanupScrollDepth = trackScrollDepth();
    const cleanupTimeOnPage = trackTimeOnPage();

    // 組件卸載時清理所有追蹤
    return () => {
      cleanupArticleRead();
      cleanupScrollDepth();
      cleanupTimeOnPage();
    };
  }, [article.title]);

  return (
    <ArticleLayout 
      article={article} 
      relatedArticles={relatedArticles}
      recommendedArticles={recommendedArticles}
    />
  );
}

/**
 * 組件職責說明：
 * 1. 作為客戶端功能的容器
 * 2. 管理分析追蹤的生命週期
 * 3. 將數據傳遞給純展示組件
 * 
 * 注意：
 * - 使用 useEffect 確保追蹤只在客戶端執行
 * - 當文章標題改變時重新初始化追蹤
 * - 提供清理函數以防止內存洩漏
 */ 
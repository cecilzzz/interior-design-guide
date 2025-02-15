'use client';

import { useEffect } from 'react';
import ArticleLayout from '@/app/components/ArticleLayout';
import { trackArticleRead, trackScrollDepth, trackTimeOnPage } from '@/app/utils/analytics';

/**
 * ArticlePage 組件
 * 客戶端容器組件，負責：
 * 1. 處理客戶端特定的功能（分析追蹤）
 * 2. 渲染文章頁面的整體佈局
 */
type ArticlePageProps = {
  post: {
    category: string;
    title: string;
    date: string;
    image: string;
    content: string;
  };
  relatedPosts: Array<{
    category: string;
    title: string;
    image: string;
    link: string;
  }>;
};

export default function ArticlePage({ post, relatedPosts }: ArticlePageProps) {
  useEffect(() => {
    // 開始所有追蹤
    const cleanupArticleRead = trackArticleRead(post.title);
    const cleanupScrollDepth = trackScrollDepth();
    const cleanupTimeOnPage = trackTimeOnPage();

    // 返回清理函數
    return () => {
      cleanupArticleRead();
      cleanupScrollDepth();
      cleanupTimeOnPage();
    };
  }, [post.title]);

  return <ArticleLayout post={post} relatedPosts={relatedPosts} />;
} 
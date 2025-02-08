'use client';

import { useEffect } from 'react';
import BlogContent from '@/app/components/BlogContent';
import { trackArticleRead, trackScrollDepth, trackTimeOnPage } from '@/app/utils/analytics';

type BlogPostClientProps = {
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

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
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

  return <BlogContent post={post} relatedPosts={relatedPosts} />;
} 
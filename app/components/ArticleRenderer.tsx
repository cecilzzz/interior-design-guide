'use client';

import React from 'react';
import { Article } from 'contentlayer/generated';
import { format } from 'date-fns';
import { getMDXComponent } from 'next-contentlayer/hooks';
import { useMDXComponents } from '@/mdx-components';
import { MDXImage } from './MDXImage';

/**
 * ArticleRenderer 組件
 * 
 * 數據流向說明：
 * 1. page.tsx 從文件系統讀取 Markdown 文件
 * 2. ArticlePage 接收並傳遞數據
 * 3. ArticleLayout 解構並傳遞 post 對象
 * 4. ArticleRenderer 接收最終的數據並渲染
 * 
 * 負責渲染文章的完整內容，包括標題區、主圖和 Markdown 內容。
 * 這是最基礎的內容渲染組件，不包含任何佈局邏輯。
 * 
 * 被以下組件使用：
 * - ArticleLayout (app/components/ArticleLayout.tsx) - 作為主要內容渲染器
 * 
 * 依賴的組件和工具：
 * - MDXImage: 統一的圖片渲染組件，包含結構化數據和 Pinterest 分享
 * - next-contentlayer: MDX 內容處理
 * 
 * 功能：
 * 1. 渲染文章標題區（類別、標題、日期）
 * 2. 顯示文章封面圖片，使用 MDXImage 組件保持一致性
 * 3. 將 MDX 內容轉換為 HTML
 * 4. 提供統一的圖片處理和 SEO 優化
 * 
 * 注意事項：
 * - 封面圖片使用 MDXImage 組件，確保與內容圖片的一致性
 * - 包含結構化數據和 Pinterest 分享功能
 * - 使用 Tailwind 的 prose 類來美化 MDX 內容
 */

interface ArticleRendererProps {
  article: Article;
}

/**
 * 渲染文章內容的主要組件
 * 
 * @param props - 文章相關屬性
 * @param props.article - 當前文章的完整數據
 */
export default function ArticleRenderer({ article }: ArticleRendererProps) {
  // Pinterest 分享功能需要頁面 URL
  const [pageUrl, setPageUrl] = React.useState('');
  const MDXContent = getMDXComponent(article.body.code);

  React.useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  // 構造封面圖片的 MDXImage 參數
  const coverImageData = article.coverImage ? {
    localPath: {
      originalFileName: `${article.coverImage}.png`, // 添加副檔名以符合 originalFileName 格式
      articleSlug: article.slug
    },
    seo: {
      seoFileName: article.coverImage, // 這裡是不帶副檔名的 seoFileName
      altText: article.coverImageAlt || article.title
    },
    pin: {
      title: article.title,
      description: article.excerpt
    }
  } : null;

  return (
    <article>
      {/* 標題區域 */}
      <div className="text-left mb-12">
        <h1 className="font-playfair text-3xl md:text-4xl mb-4 sm:mb-6">{article.title}</h1>
        <div className="text-gray-400 text-xs sm:text-sm tracking-wider">
          {format(new Date(article.date), 'MMMM dd, yyyy')}
        </div>
        <div className="font-montserrat text-coral-400 uppercase tracking-[0.2em] text-xs sm:text-sm mt-3 font-light">
          {article.categories[0]} / <span className="text-gray-500">DESIGN</span>
        </div>
      </div>
      
      {/* 封面圖片區域 - 使用 MDXImage 組件保持一致性 */}
      {coverImageData && (
        <div className="mb-8">
          <MDXImage {...coverImageData} />
        </div>
      )}
      
      {/* MDX 內容區域 */}
      <MDXContent components={useMDXComponents({})} />
      
      {/* 社交分享區域 */}
      <div className="flex justify-center space-x-4 mt-8">
        <a href="#" className="text-gray-500 hover:text-gray-700">
          <span className="sr-only">Facebook</span>
          {/* Facebook icon */}
        </a>
        {/* 其他社交媒體圖標 */}
      </div>
    </article>
  );
}
'use client';

import React from 'react';
import Image from "next/image";
import PinterestButton from './PinterestButton';
import { Article } from 'contentlayer/generated';
import { format } from 'date-fns';
import { getMDXComponent } from 'next-contentlayer/hooks';
import { useMDXComponents } from '@/mdx-components';

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
 * - next/image: 圖片優化組件
 * - react-markdown: Markdown 渲染
 * - @/app/lib/imageUtils: 圖片 URL 處理
 * 
 * 功能：
 * 1. 渲染文章標題區（類別、標題、日期）
 * 2. 顯示文章主圖，帶有懸停效果
 * 3. 將 Markdown 內容轉換為 HTML
 * 4. 優化文章中的圖片，使用 Next.js Image 組件
 * 
 * 注意事項：
 * - 主圖使用 fill 模式，需要父元素設置尺寸
 * - Markdown 中的圖片會被轉換為優化後的 Image 組件
 * - 使用 Tailwind 的 prose 類來美化 Markdown 內容
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

  return (
    <article>
      {/* 標題區域 */}
      <div className="text-center mb-12">
        <div className="text-coral-400 uppercase tracking-[0.2em] text-xs sm:text-sm mb-4 sm:mb-6 font-light">
          {article.categories[0]} / <span className="text-gray-500">DESIGN</span>
        </div>
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">{article.title}</h1>
        <div className="text-gray-400 text-xs sm:text-sm tracking-wider">{format(new Date(article.date), 'MMMM dd, yyyy')}</div>
      </div>
      
      {/* 主圖區域 */}
      <div className="mb-8 relative aspect-[16/9] overflow-hidden rounded-lg group">
        <Image
          src={article.coverImageUrl}
          alt={article.title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
          sizes="(min-width: 1024px) 65vw, (min-width: 768px) 75vw, 100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {pageUrl && (
          <PinterestButton 
            url={pageUrl}
            media={article.coverImageUrl}
            description={article.title}
          />
        )}
      </div>
      
      {/* MDX 內容區域 */}
      <div className="prose prose-lg max-w-none">
        <MDXContent components={useMDXComponents({})} />
      </div>
      
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
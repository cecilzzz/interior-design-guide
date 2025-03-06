'use client';

import Image from "next/image";
import { MDXProvider } from '@mdx-js/react';
import { getImageUrl } from '@/app/lib/imageUtils';
import PinterestButton from './PinterestButton';
import React, { useEffect, useState } from 'react';
import { Article } from '@/app/types/article';
import type { HTMLAttributes } from 'react';
import CategoryPage from "../blog/category/[category]/page";

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
  /** 當前文章數據 */
  currentArticle: Omit<Article, 'id' | 'categories' | 'excerpt'> & { category: string };
}

/**
 * 渲染文章內容的主要組件
 * 
 * @param props - 文章相關屬性
 * @param props.currentArticle - 當前文章的完整數據
 */
export default function ArticleRenderer({ currentArticle }: ArticleRendererProps) {
  const { category, title, date, coverImageUrl, content } = currentArticle;
  
  // 檢查整個 currentArticle 對象
  console.log('Current Article:', {
    title,
    date,
    category,
    contentPreview: content.slice(0, 500) // 只顯示前 500 個字符
  });

  // 檢查 content 的類型
  console.log('Content type:', typeof content);

  // Pinterest 分享功能需要頁面 URL
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const createPinData = (media: string, imageAltText: string) => {
    return {
      url: pageUrl,
      media,
      description: `${title} - ${imageAltText}`,
    };
  };

  console.log('MDX Content Type:', typeof content);
  console.log('MDX Content Preview:', content?.substring(0, 100));
  console.log('MDX Content Length:', content?.length);

  return (
    <article>
      {/* 標題區域 */}
      <div className="text-center mb-12">
        <div className="text-coral-400 uppercase tracking-[0.2em] text-xs sm:text-sm mb-4 sm:mb-6 font-light">
          {category} / <span className="text-gray-500">DESIGN</span>
        </div>
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">{title}</h1>
        <div className="text-gray-400 text-xs sm:text-sm tracking-wider">{date}</div>
      </div>
      
      {/* 主圖區域 */}
      <div className="mb-8 relative aspect-[16/9] overflow-hidden rounded-lg group">
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
          sizes="(min-width: 1024px) 65vw, (min-width: 768px) 75vw, 100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {pageUrl && (
          <PinterestButton 
            {...createPinData(coverImageUrl, 'Cover Image')}
          />
        )}
      </div>
      
      {/* MDX 內容區域 */}
      <div className="prose max-w-none">
        {content}
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
'use client';

import Image from "next/image";
import ReactMarkdown from 'react-markdown';  // 需要安裝: npm install react-markdown
import { getImageUrl } from '@/app/lib/imageUtils';
import PinterestButton from './PinterestButton';
import React, { useEffect, useState } from 'react';

/**
 * ArticleRenderer 組件
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
  /** 文章分類 */
  category: string;
  /** 文章標題 */
  title: string;
  /** 發布日期 */
  date: string;
  /** 主圖 URL */
  image: string;
  /** Markdown 格式的文章內容 */
  content: string;
}

/**
 * 渲染文章內容的主要組件
 * 
 * @param props - 文章相關屬性
 * @param props.category - 文章分類，顯示在標題上方
 * @param props.title - 文章標題
 * @param props.date - 發布日期
 * @param props.image - 主圖 URL
 * @param props.content - Markdown 格式的文章內容
 */
export default function ArticleRenderer({ 
  category, 
  title, 
  date, 
  image, 
  content,
}: ArticleRendererProps) {
  // 使用 state 來存儲 URL
  const [pageUrl, setPageUrl] = useState('');

  // 在客戶端設置 URL
  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  // 創建 Pin 數據的函數
  const createPinData = (media: string, imageAltText: string) => {
    return {
      url: pageUrl,
      media,
      description: `${title} - ${imageAltText}`,
    };
  };

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
          src={image}
          alt={title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
          sizes="(min-width: 1024px) 65vw, (min-width: 768px) 75vw, 100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {pageUrl && (  // 只在有 URL 時渲染 Pinterest 按鈕
          <PinterestButton 
            {...createPinData(image, 'Cover Image')}
          />
        )}
      </div>
      
      {/* Markdown 內容區域 */}
      <div className="prose max-w-none">
        <ReactMarkdown
          components={{
            img: ({ src, alt }) => {
              if (!src) return null;
              const optimizedSrc = src.startsWith('http') ? src : getImageUrl(src, 'content');
              const imageAltText = alt || title;
              
              return (
                <span className="block relative group my-8">
                  <Image
                    src={optimizedSrc}
                    alt={imageAltText}
                    width={800}
                    height={450}
                    className="rounded-lg w-full h-auto"
                  />
                  {pageUrl && (
                    <PinterestButton 
                      {...createPinData(optimizedSrc, imageAltText)}
                    />
                  )}
                </span>
              );
            },
            p: ({ children }) => {
              return <span className="block mb-4">{children}</span>;
            },
          }}
        >
          {content}
        </ReactMarkdown>
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
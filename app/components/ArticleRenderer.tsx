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
  
  // 🔑 關鍵邏輯 1: Contentlayer 編譯時 MDX 處理機制
  // 
  // getMDXComponent 是 next-contentlayer/hooks 提供的官方函數
  // 這個函數體現了我們選擇 Contentlayer 而非 next-mdx-remote 的核心原因
  // 
  // 技術背景：
  // - @next/mdx: Next.js 13 早期 bug 太多，放棄
  // - next-mdx-remote: 執行時編譯，不支援靜態匯出，放棄  
  // - Contentlayer: 編譯時處理，完美支援靜態網站生成 ✅
  // 
  // 參數解析：article.body.code
  // ❌ 不是普通字符串或 Markdown 文本
  // ❌ 不是未編譯的 MDX 語法  
  // ✅ 是 Contentlayer 在建置時預編譯的 JavaScript 程式碼字符串
  // ✅ 包含完整的 React 元件定義和 JSX 結構
  // ✅ 格式類似：function MDXContent(props) { return jsx(...); } export default MDXContent;
  // 
  // 返回值：React.ComponentType<{ components?: MDXComponents }>
  // - 這是一個 React 元件函數，可以直接在 JSX 中使用
  // - 接收 components 屬性來自定義 MDX 元素的渲染方式
  // - 因為是編譯時處理，執行時效能極佳，適合靜態網站
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
      {/* 🔑 關鍵邏輯 2: MDX 元件映射與自訂渲染 */}
      {/* 
       * components={useMDXComponents({})} 的作用機制：
       * 
       * 技術背景：
       * - 這不是 Next.js 內建的魔法，而是我們主動調用的函數
       * - useMDXComponents 定義在 mdx-components.tsx（Next.js 約定檔案）
       * - 雖然是約定檔案，但調用是完全由我們控制的
       * 
       * 🎯 MDXComponents 型別：MDX 技術棧的核心機制
       * 
       * 型別結構：
       * type MDXComponents = {
       *   [elementName: string]: ReactComponent  // 元素名稱 → React 元件的映射關係
       *   h1?: (props: HTMLAttributes<HTMLHeadingElement>) => JSX.Element
       *   p?: (props: HTMLAttributes<HTMLParagraphElement>) => JSX.Element
       *   wrapper?: (props: any) => JSX.Element
       *   MDXImage?: (props: ImageData) => JSX.Element
       *   // ... 其他元素
       * }
       * 
       * 核心價值：
       * - 這個型別本身就是「映射關係」的載體
       * - 由 MDX 官方提供（'mdx/types'），是整個 MDX 生態系統的基礎
       * - 是讓「Markdown + React」成為可能的核心抽象層
       * - 沒有這個機制，MDX 就只是普通的 Markdown
       * 
       * 工作原理：
       * 1. useMDXComponents({}) 返回一個 MDXComponents 型別的物件
       * 2. 映射表將 MDX 中的元件名稱對應到實際的 React 元件
       * 3. 例如：{ MDXImage: (props) => <MDXImage {...props} /> }
       * 4. 當 MDX 內容包含 <MDXImage> 時，會渲染我們的自訂元件
       * 
       * MDX 核心運作邏輯（簡化版）：
       * function renderMDXElement(elementName, props, components) {
       *   const CustomComponent = components[elementName];
       *   return CustomComponent ? 
       *     <CustomComponent {...props} /> :     // 使用自訂元件
       *     createElement(elementName, props);   // 使用原生 HTML 元素
       * }
       * 
       * 為什麼需要這個機制：
       * - 讓我們可以在 MDX 中使用自訂 React 元件
       * - 統一圖片處理、SEO 優化、Pinterest 分享等功能
       * - 保持內容與展示邏輯的分離
       * - 實現 MDX 的核心價值主張：Markdown + React
       * 
       * 與其他方案的差異：
       * - @next/mdx: 需要 mdx-components.tsx，但 Next.js 13 早期支援差
       * - next-mdx-remote: 不需要 mdx-components.tsx，但不支援靜態匯出
       * - Contentlayer: 可選使用 mdx-components.tsx，我們選擇使用以獲得更好的元件控制
       */}
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
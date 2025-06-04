'use client';

import Image from 'next/image';
import { useState } from 'react';
import PinterestButton from './PinterestButton';
import { getImageUrl } from '@/app/utils/imageUtils';
import type { ImageData } from '../../app/types/image';

/**
 * MDXImage 組件
 * 
 * 用於在 MDX 內容中渲染圖片，提供一致的圖片展示體驗
 * 包含以下特性：
 * - 響應式圖片尺寸
 * - 保持原始寬高比
 * - Pinterest 分享功能
 * - 圖片優化和加載
 * - 結構化數據支持
 * - 高級漸變動畫效果（模糊到清晰）
 * 
 * 注意事項：
 * - 使用 figure 標籤來符合語義化
 * - 使用 not-prose 來避免受到 prose 樣式的影響
 * - 圖片寬度跟隨容器，高度保持原比例
 */
export function MDXImage({ 
  localPath,
  seo, 
  pin, 
  className = '' 
}: ImageData) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const imageUrl = getImageUrl(seo.seoFileName, 'content');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akio-hasegawa.design';
  
  // 結構化數據 for Google Images
  const imageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": imageUrl,
    "name": seo.altText,
    "description": pin.description,
    "contentUrl": imageUrl,
    "acquireLicensePage": `${siteUrl}/${localPath.articleSlug}/`,
    "license": `${siteUrl}/${localPath.articleSlug}/`,
    "creditText": "Akio Hasegawa Design",
    "copyrightNotice": `© ${new Date().getFullYear()} Akio Hasegawa. All rights reserved.`,
    "creator": {
      "@type": "Person",
      "name": "Akio Hasegawa"
    },
    "copyrightHolder": {
      "@type": "Person", 
      "name": "Akio Hasegawa"
    }
  };
  
  return (
    <figure className={`relative overflow-visible ${className}`}>
      {/* 結構化數據 */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(imageStructuredData) 
        }} 
      />
      
      {/* 圖片容器 - 真正的全螢幕寬度 */}
      <div className="relative w-screen -ml-[50vw] left-1/2 md:w-full md:ml-0 md:left-0">
        {/* 主圖片 - 作為基準，撐開容器 */}
        <Image
          src={imageUrl}
          alt={seo.altText}
          width={0}
          height={0}
          className={`
            w-full h-auto object-cover
            transition-all duration-700 ease-out
            ${isLoaded 
              ? 'opacity-100 filter-none' 
              : 'opacity-0 filter blur-sm'
            }
          `}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* CSS 佔位圖 - 絕對定位覆蓋 */}
        <div 
          className={`
            absolute inset-0 bg-gray-000 
            transition-opacity duration-500 ease-out
            ${isLoaded ? 'opacity-0' : 'opacity-100'}
          `}
        />
        
        {/* Pinterest 按鈕 - 相對於圖片容器定位 */}
        <PinterestButton 
          description={pin.description}
          media={imageUrl}
          url={`${siteUrl}/${localPath.articleSlug}/`}
        />
      </div>
    </figure>
  );
}
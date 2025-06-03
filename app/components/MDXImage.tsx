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
 * 
 * 注意事項：
 * - 使用 figure 標籤來符合語義化
 * - 使用 not-prose 來避免受到 prose 樣式的影響
 * - 圖片寬度跟隨容器，高度保持原比例
 */

// 全局計數器（用於 fallback）
let globalImageCounter = 0;

interface ExtendedImageData extends ImageData {
  /** 圖片在文章中的索引位置（從 1 開始），用於決定是否高優先級 */
  imageIndex?: number;
}

export function MDXImage({ 
  localPath,
  seo, 
  pin, 
  className = '',
  imageIndex
}: ExtendedImageData) {
  // 如果沒有提供 imageIndex，使用全局計數器作為 fallback
  const currentIndex = imageIndex || ++globalImageCounter;
  
  const imageUrl = getImageUrl(seo.seoFileName, 'content');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akio-hasegawa.design';
  
  // 前3張圖片使用高優先級
  const isHighPriority = currentIndex <= 3;
  
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
    <figure className={`relative w-[calc(100%_+_4rem)] -mx-8 md:w-full md:mx-0 overflow-hidden ${className}`}>
      {/* 結構化數據 */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(imageStructuredData) 
        }} 
      />
      
      <img
        src={imageUrl}
        alt={seo.altText}
        className="w-full h-auto object-cover"
        loading="eager"
        {...(isHighPriority ? { fetchpriority: 'high' } : { fetchpriority: 'auto' })}
      />
      <PinterestButton 
        description={pin.description}
        media={imageUrl}
        url={`${siteUrl}/${localPath.articleSlug}/`}
      />
    </figure>
  );
}
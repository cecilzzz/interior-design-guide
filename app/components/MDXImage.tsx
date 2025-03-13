import Image from 'next/image';
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
  const imageUrl = getImageUrl(seo.seoFileName, 'content');
  
  return (
    <figure className={`
      relative w-full
      overflow-hidden rounded-lg
      ${className}
    `}>
      <Image
        src={imageUrl}
        alt={seo.altText}
        width={0}
        height={0}
        className="w-full h-auto object-cover"
        sizes="(min-width: 1280px) 1200px, 92vw"
        quality={85}
      />
      <PinterestButton 
        description={pin.description}
        media={imageUrl}
        url={process.env.NEXT_PUBLIC_SITE_URL || ''}
      />
    </figure>
  );
}
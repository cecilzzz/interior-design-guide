'use client';

import { FaPinterestP } from 'react-icons/fa';

/**
 * Pinterest 分享按鈕組件
 * 
 * 提供一個優雅的 Pinterest 分享按鈕，可以放置在圖片上方。
 * 點擊時會打開 Pinterest 的分享視窗，允許用戶將圖片保存到他們的 Pinterest 面板。
 * 
 * 特點：
 * - 響應式設計
 * - 懸停效果
 * - 可自定義樣式
 * - 支持所有圖片類型
 * 
 * @component
 * @example
 * ```tsx
 * <PinterestButton 
 *   imageUrl="https://example.com/image.jpg"
 *   description="Beautiful interior design"
 * />
 * ```
 */

export interface PinterestButtonProps {
  /** 要分享的圖片 URL */
  media: string;
  /** 文章頁面的 URL */
  url: string;
  /** 可選的額外 CSS 類名 */
  className?: string;
}

export default function PinterestButton({ 
  media, 
  url,
  className = ''
}: PinterestButtonProps) {
  /**
   * 處理 Pinterest 分享按鈕點擊
   * 打開一個新視窗來進行 Pinterest 分享
   */
  const handlePinterestShare = () => {
    const shareUrl = 'https://pinterest.com/pin/create/button/' +
      `?url=${encodeURIComponent(url)}` +
      `&media=${encodeURIComponent(media)}`;
    
    // 打開分享視窗
    window.open(
      shareUrl,
      'Pinterest',
      'width=750,height=650,toolbar=0,menubar=0,location=0'
    );
  };

  return (
    <button
      onClick={handlePinterestShare}
      className={`
        absolute left-4 top-4 
        bg-red-600
        text-white
        rounded-full 
        p-2.5
        transition-all duration-300
        hover:scale-110
        hover:bg-red-700
        shadow-sm
        ${className}
      `}
      aria-label="Save to Pinterest"
      title="Save to Pinterest"
    >
      <FaPinterestP className="w-5 h-5" />
    </button>
  );
}

/**
 * 使用說明：
 * 
 * 1. 在圖片容器上添加 group 和 relative 類：
 * ```tsx
 * <div className="relative group">
 *   <Image src={...} />
 *   <PinterestButton imageUrl={...} description={...} />
 * </div>
 * ```
 * 
 * 2. 按鈕會在滑鼠懸停時顯示，並有放大動畫效果
 * 
 * 3. 點擊按鈕會打開 Pinterest 分享視窗
 * 
 * 4. 支持自定義樣式：
 * ```tsx
 * <PinterestButton 
 *   imageUrl={...} 
 *   description={...}
 *   className="left-6 top-6" // 自定義位置
 * />
 * ```
 */ 
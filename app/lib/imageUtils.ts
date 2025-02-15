/**
 * 圖片 URL 處理工具
 * 支持 Cloudinary 和其他完整 URL（如 Unsplash）
 */

// Cloudinary 基本配置
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dwobltbzw/image/upload';

// 不同場景的優化參數
const TRANSFORM_PARAMS = {
  // 博客主圖：大圖，高質量，固定比例
  hero: 'w_1920,h_1080,c_fill,q_auto:good,f_auto',
  
  // 文章內容圖：適中寬度，保持原比例
  content: 'w_800,c_fit,q_auto,f_auto',
  
  // 預設參數：基本優化
  default: 'f_auto,q_auto'
};

type ImageType = 'hero' | 'content' | 'default';

export function getImageUrl(path: string, type: ImageType = 'default'): string {
  // 如果是完整的 URL（比如 Unsplash 鏈接），直接返回
  if (path.startsWith('http')) {
    return path;
  }

  // 獲取對應類型的轉換參數
  const params = TRANSFORM_PARAMS[type];
  
  // 移除開頭的斜線
  const cleanPath = path.replace(/^\//, '');
  
  // 返回完整的 Cloudinary URL
  return `${CLOUDINARY_BASE}/${params}/${cleanPath}`;
}

/**
 * 使用示例：
 * 
 * 博客主圖:
 * getImageUrl('/posts/japanese-living-room/main.jpg', 'hero')
 * → https://res.cloudinary.com/dwobltbzw/image/upload/w_1920,h_1080,c_fill,q_auto:good,f_auto/posts/japanese-living-room/main.jpg
 * 
 * 文章內容圖:
 * getImageUrl('/posts/japanese-living-room/detail-1.jpg', 'content')
 * → https://res.cloudinary.com/dwobltbzw/image/upload/w_800,c_fit,q_auto,f_auto/posts/japanese-living-room/detail-1.jpg
 * 
 * Unsplash 圖片:
 * getImageUrl('https://images.unsplash.com/photo-123456789')
 * → https://images.unsplash.com/photo-123456789
 */ 
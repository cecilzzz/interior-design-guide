/**
 * 圖片 URL 處理工具
 * 
 * 負責處理和優化圖片 URL，支持 Cloudinary 轉換和外部圖片。
 * 提供不同場景下的圖片優化參數（如文章主圖、內容圖片等）。
 * 
 * 被以下組件使用：
 * 1. ArticleRenderer (app/components/ArticleRenderer.tsx)
 *    - 用於優化文章內容中的圖片
 *    - 處理 Markdown 中的圖片
 * 2. app/blog/[slug]/page.tsx
 *    - 處理文章主圖
 *    - 生成 OpenGraph 圖片
 * 3. app/blog/page.tsx
 *    - 優化文章列表中的縮略圖
 * 4. PostGrid (app/components/PostGrid.tsx)
 *    - 處理文章卡片的封面圖片
 * 
 * 主要功能：
 * 1. 自動處理圖片路徑
 * 2. 添加 Cloudinary 轉換參數
 * 3. 支持不同場景的優化配置
 * 4. 保持外部圖片 URL 不變
 */

// Cloudinary 基本配置
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dwobltbzw/image/upload';

/**
 * 不同場景的優化參數配置
 * 
 * hero: 用於文章主圖和大型橫幅
 * content: 用於文章內容中的圖片
 * default: 基本優化參數
 */
const TRANSFORM_PARAMS = {
  // 博客主圖：大圖，高質量，固定比例
  hero: 'w_1920,h_1080,c_fill,q_auto:good,f_auto',
  
  // 文章內容圖：適中寬度，保持原比例
  content: 'w_800,c_fit,q_auto,f_auto',
  
  // 側邊欄圖片：較窄寬度，保持原比例
  sidebar: 'w_400,c_fit,q_auto,f_auto',
  
  // 預設參數：基本優化
  default: 'f_auto,q_auto'
};

/** 圖片類型定義 */
type ImageType = 'hero' | 'content' | 'sidebar' | 'default';

/**
 * 獲取優化後的圖片 URL
 * 
 * @param path - 原始圖片路徑
 * @param type - 圖片使用場景類型
 * @returns 處理後的圖片 URL
 * 
 * @example
 * // 處理文章主圖
 * getImageUrl('/posts/example.jpg', 'hero')
 * 
 * @example
 * // 處理文章內容圖片
 * getImageUrl('/posts/content.jpg', 'content')
 * 
 * @example
 * // 處理外部圖片（保持不變）
 * getImageUrl('https://example.com/image.jpg')
 */
export function getImageUrl(path: string, type: ImageType = 'default'): string {
  // 如果是完整的 URL（比如 Unsplash 鏈接），直接返回
  if (path.startsWith('http')) {
    return path;
  }

  // 獲取對應類型的轉換參數
  const params = TRANSFORM_PARAMS[type];
  
  // 移除開頭的斜線
  const cleanPath = path.replace(/^\//, '');
  
  // 返回完整的 Cloudinary URL，不添加副檔名讓 f_auto 自動選擇最佳格式
  return `${CLOUDINARY_BASE}/${params}/${cleanPath}`;
}

/**
 * 技術說明：
 * 
 * Cloudinary URL 結構：
 * https://res.cloudinary.com/[cloud_name]/image/upload/[轉換參數]/[圖片路徑]
 * 
 * 轉換參數說明：
 * - w_*: 寬度
 * - h_*: 高度
 * - c_fill: 裁剪模式
 * - c_fit: 適應模式
 * - q_auto: 自動質量
 * - f_auto: 自動格式
 * 
 * 注意事項：
 * 1. 路徑中不應包含前導斜線
 * 2. 外部 URL 不會被處理
 * 3. 確保圖片已上傳到 Cloudinary
 */

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
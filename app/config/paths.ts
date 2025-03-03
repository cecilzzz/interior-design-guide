import { resolve } from 'path';

/**
 * 圖片處理相關路徑配置
 */
export const PATHS = {
  // 圖片根目錄（注意：這是在專案外的路徑）
  IMAGES_ROOT: '/Users/caim/Documents/projects/interior-inspiration-website',
  // Cloudinary 上傳路徑
  CLOUDINARY_BASE_PATH: 'interior-inspiration-website/posts'
} as const;

/**
 * 取得圖片完整路徑
 */
export const getImagePath = (relativePath: string, filename: string): string => {
  return resolve(PATHS.IMAGES_ROOT, relativePath, filename);
}; 
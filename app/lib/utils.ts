import { resolve } from 'path';

/**
 * 取得圖片完整路徑
 * @param relativePath - 相對於圖片根目錄的路徑
 * @param filename - 圖片檔案名稱
 * @returns 圖片的完整路徑
 */
export const getImagePath = (relativePath: string, filename: string): string => {
  if (!process.env.IMAGES_ROOT_DIR) {
    throw new Error('IMAGES_ROOT_DIR environment variable is required');
  }
  
  // 圖片存放在 IMAGES_ROOT_DIR/[relativePath]/[filename]
  // 例如：/Users/caim/Documents/projects/interior-inspiration-website/japandi/40-japandi-living-room-ideas/image.png
  return resolve(process.env.IMAGES_ROOT_DIR, relativePath, filename);
};

// 導出所有工具函數
export default {
  getImagePath
}; 
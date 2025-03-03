import { resolve } from 'path';

/**
 * 取得圖片完整路徑
 * 
 * 路徑參數流程：
 * 1. Markdown 文件中的 SEO 注釋：
 *    ```
 *    <!--SEO
 *    {
 *      "originalName": "image.png",
 *      "relativePath": "japandi/40-japandi-living-room-ideas",
 *      "seoFileName": "japanese-zen-meditation-room"
 *    }
 *    -->
 *    ```
 * 
 * 2. Markdown 圖片引用：
 *    ```
 *    ![Alt text](/interior-inspiration-website/posts/40-japandi-living-room-ideas/image.png)
 *    ```
 * 
 * 3. 環境變數：
 *    - IMAGES_ROOT_DIR: 圖片根目錄的絕對路徑
 *      例如：/Users/caim/Documents/projects/interior-inspiration-website
 * 
 * 4. 最終生成的完整路徑：
 *    IMAGES_ROOT_DIR + relativePath + filename
 *    例如：/Users/caim/Documents/projects/interior-inspiration-website/japandi/40-japandi-living-room-ideas/image.png
 * 
 * @param relativePath - 相對於圖片根目錄的路徑，來自 SEO 注釋
 * @param filename - 圖片原始檔名，來自 SEO 注釋的 originalName
 * @returns 圖片的完整絕對路徑
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
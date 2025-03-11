import type { ImageData } from '../../app/types/image';
/**
 * 路徑相關參數的完整結構
 * 
 * 本地檔案系統：
 * 完整路徑 = LOCAL_ROOT/LOCAL_RELATIVE_PATH/ORIGINAL_NAME
 * 例如：/Users/caim/Documents/projects/interior-inspiration-website/japandi/40-japandi-living-room-ideas/image.png
 * 
 * Cloudinary 系統：
 * 完整路徑 = CLOUDINARY_ROOT/CLOUDINARY_RELATIVE_PATH/SEO_NAME
 * 例如：interior-inspiration-website/posts/40-japandi-living-room-ideas/japanese-zen-room
 */
interface PathInfo {
  // 本地檔案系統
  /** 環境變數 IMAGES_ROOT_DIR
   * 例如：/Users/caim/Documents/projects/interior-inspiration-website */
  localRoot: string;

  /** 相對於根目錄的路徑
   * 例如：japandi/40-japandi-living-room-ideas */
  localRelativePath: string;

  /** 原始檔案名
   * 例如：image.png */
  originalName: string;

  // Cloudinary 系統
  /** 環境變數 CLOUDINARY_BASE_PATH
   * 例如：interior-inspiration-website/posts */
  cloudinaryRoot: string;

  /** 文章的 slug
   * 例如：40-japandi-living-room-ideas */
  cloudinaryRelativePath: string;

  /** SEO 優化後的檔名
   * 例如：japanese-zen-room */
  seoFileName: string;
}

export class PathManager {
  /**
   * 從 ImageData 和環境變數構建 PathInfo
   * 集中處理所有路徑相關的邏輯
   */
  static createPathInfo(imageData: ImageData): PathInfo {
    if (!process.env.IMAGES_ROOT_DIR) {
      throw new Error('IMAGES_ROOT_DIR environment variable is required');
    }
    if (!process.env.CLOUDINARY_BASE_PATH) {
      throw new Error('CLOUDINARY_BASE_PATH environment variable is required');
    }

    return {
      localRoot: process.env.IMAGES_ROOT_DIR,
      localRelativePath: imageData.localRelativePath,
      originalName: imageData.originalName,
      cloudinaryRoot: process.env.CLOUDINARY_BASE_PATH,
      cloudinaryRelativePath: imageData.articleSlug,
      seoFileName: imageData.seoFileName
    };
  }

  /**
   * 生成本地檔案系統的完整路徑
   */
  static getLocalPath(info: PathInfo): string {
    return [info.localRoot, info.localRelativePath, info.originalName].join('/');
  }

  /**
   * 生成 Cloudinary 的完整路徑
   */
  static getCloudinaryPath(info: PathInfo): string {
    return [info.cloudinaryRoot, info.cloudinaryRelativePath, info.seoFileName].join('/');
  }
}

export type { PathInfo }; 
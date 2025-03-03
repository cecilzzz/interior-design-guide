import { CldUploadApi } from 'next-cloudinary/server';
import { join } from 'path';
import { access } from 'fs/promises';
import { PATHS } from '../config/paths';
import type { ImageData } from './markdownProcessor';

/**
 * 圖片處理結果介面
 * 用於追蹤單個圖片的處理狀態和結果
 * 
 * @interface ProcessingResult
 * @property {boolean} success - 處理是否成功
 * @property {string} [cloudinaryUrl] - 成功時的 Cloudinary URL
 * @property {string} [pinId] - 成功時的 Pinterest Pin ID
 * @property {string} [error] - 失敗時的錯誤訊息
 * 
 * @internal
 * 被 processImage 函數返回
 * 被 process-images.ts 用於追蹤處理狀態
 */
interface ProcessingResult {
  success: boolean;
  cloudinaryUrl?: string;
  pinId?: string;
  error?: string;
}

/**
 * 處理統計資訊介面
 * 用於追蹤批次處理的整體狀態
 * 
 * @interface ProcessingStats
 * @property {number} total - 總處理數量
 * @property {number} success - 成功處理數量
 * @property {number} failed - 失敗處理數量
 * @property {Array<{file: string, error: string}>} errors - 錯誤詳情列表
 * 
 * @exports
 * 被 process-images.ts 用於生成處理報告
 */
interface ProcessingStats {
  total: number;
  success: number;
  failed: number;
  errors: Array<{
    file: string;
    error: string;
  }>;
}

/**
 * Pinterest Pin 資料介面
 * 定義創建 Pinterest Pin 所需的資料結構
 * 
 * @interface PinterestPinData
 * @property {string} title - Pin 標題
 * @property {string} description - Pin 描述
 * @property {object} media_source - 媒體來源資訊
 * @property {string} link - Pin 連結
 * @property {string} board_id - Pinterest 面板 ID
 * 
 * @internal
 * 僅在 createPinterestPin 函數中使用
 */
interface PinterestPinData {
  title: string;
  description: string;
  media_source: {
    url: string;
  };
  link: string;
  board_id: string;
}

/**
 * 上傳圖片到 Cloudinary
 * 處理圖片上傳和優化設定
 * 
 * @param {ImageData} imageData - 圖片資料
 * @param {string} articleSlug - 文章 slug
 * @returns {Promise<{secure_url: string}>} Cloudinary 上傳結果
 * 
 * @internal
 * 被 processImage 函數調用
 */
export const uploadToCloudinary = async (
  imageData: ImageData,
  articleSlug: string
): Promise<{ secure_url: string }> => {
  try {
    // 構建本地文件完整路徑
    const imagePath = join(
      PATHS.IMAGES_BASE_DIR,
      imageData.categories,
      articleSlug,
      imageData.originalName
    );
    
    // 構建 Cloudinary public_id
    const publicId = `${PATHS.CLOUDINARY_BASE_PATH}/${articleSlug}/${imageData.seoFileName}`;
    
    const result = await CldUploadApi.upload(imagePath, {
      public_id: publicId,
      tags: ['interior-design'],
      context: {
        alt: imageData.altText
      }
    });

    return {
      secure_url: result.secure_url
    };
  } catch (error: any) {
    throw new Error(`Cloudinary upload failed: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * 創建 Pinterest Pin
 * 將圖片發布到 Pinterest
 * 
 * @param {PinterestPinData} pinData - Pin 相關資料
 * @returns {Promise<{id: string}>} 創建的 Pin ID
 * 
 * @internal
 * 被 processImage 函數調用
 */
export const createPinterestPin = async (
  pinData: PinterestPinData
): Promise<{ id: string }> => {
  const response = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PINTEREST_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pinData)
  });

  if (!response.ok) {
    throw new Error(`Pinterest API error: ${response.statusText}`);
  }

  return response.json();
};

/**
 * 處理單個圖片
 * 包括上傳到 Cloudinary 和發布到 Pinterest
 * 
 * @param {ImageData} imageData - 圖片資料
 * @param {string} sectionId - 文章段落 ID
 * @param {string} articleSlug - 文章 slug
 * @param {string} boardId - Pinterest 面板 ID
 * @returns {Promise<ProcessingResult>} 處理結果
 * 
 * @exports
 * 被 process-images.ts 用於處理每個圖片
 */
export const processImage = async (
  imageData: ImageData,
  sectionId: string,
  articleSlug: string,
  boardId: string
): Promise<ProcessingResult> => {
  try {
    // 上傳到 Cloudinary
    const uploadResult = await uploadToCloudinary(imageData, articleSlug);

    // 創建 Pinterest Pin
    const pinResult = await createPinterestPin({
      title: imageData.pin.title,
      description: imageData.pin.description,
      media_source: {
        url: uploadResult.secure_url
      },
      link: `${process.env.NEXT_PUBLIC_SITE_URL}/${articleSlug}#${sectionId}?utm_source=pinterest`,
      board_id: boardId
    });

    return {
      success: true,
      cloudinaryUrl: uploadResult.secure_url,
      pinId: pinResult.id
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unknown error'
    };
  }
};

/**
 * 創建處理統計對象
 * 初始化統計追蹤器
 * 
 * @returns {ProcessingStats} 初始化的統計對象
 * 
 * @exports
 * 被 process-images.ts 用於開始批次處理
 */
export const createProcessingStats = (): ProcessingStats => ({
  total: 0,
  success: 0,
  failed: 0,
  errors: []
});

/**
 * 更新處理統計
 * 根據處理結果更新統計資訊
 * 
 * @param {ProcessingStats} stats - 當前統計資訊
 * @param {ProcessingResult} result - 處理結果
 * @param {string} file - 處理的檔案名
 * 
 * @exports
 * 被 process-images.ts 用於追蹤處理進度
 */
export const updateStats = (
  stats: ProcessingStats,
  result: ProcessingResult,
  file: string
): void => {
  stats.total++;
  if (result.success) {
    stats.success++;
  } else {
    stats.failed++;
    stats.errors.push({
      file,
      error: result.error || 'Unknown error'
    });
  }
}; 
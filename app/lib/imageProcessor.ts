import { v2 as cloudinary } from 'cloudinary';
import { join, resolve } from 'path';
import { access } from 'fs/promises';
import type { ImageData } from './markdownProcessor';
import utils from './utils';

const { getImagePath } = utils;

/**
 * 路徑參數在圖片處理過程中的流動：
 * 
 * 1. 從 Markdown 解析：
 *    - markdownProcessor.ts 解析 SEO 注釋，提取：
 *      - originalName: 原始圖片檔名
 *      - relativePath: 圖片相對路徑
 *      - seoFileName: SEO 友好的檔名
 * 
 * 2. 圖片處理流程：
 *    a) processImage 函數接收 ImageData：
 *       - 包含從 SEO 注釋解析出的所有路徑資訊
 *       - 傳遞給 uploadToCloudinary 進行處理
 * 
 *    b) uploadToCloudinary 函數：
 *       - 使用 getImagePath 構建本地圖片的完整路徑
 *       - 使用 CLOUDINARY_BASE_PATH 構建 Cloudinary 的目標路徑
 * 
 * 3. 路徑轉換：
 *    本地路徑：
 *    IMAGES_ROOT_DIR/relativePath/originalName
 *    ↓
 *    Cloudinary 路徑：
 *    CLOUDINARY_BASE_PATH/articleSlug/seoFileName
 */

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
 * @param {string} originalName - 圖片原始名稱
 * @param {string} seoFileName - SEO 友好的檔名
 * @param {string} altText - 圖片替代文字
 * @param {string} articleSlug - 文章 slug
 * @param {string} relativePath - 相對路徑
 * @returns {Promise<{secure_url: string}>} Cloudinary 上傳結果
 * 
 * @internal
 * 被 processImage 函數調用
 */
export const uploadToCloudinary = async (
  originalName: string,
  seoFileName: string,
  altText: string,
  articleSlug: string,
  relativePath: string
): Promise<{ secure_url: string }> => {
  try {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable is required');
    }
    if (!process.env.CLOUDINARY_API_KEY) {
      throw new Error('CLOUDINARY_API_KEY environment variable is required');
    }
    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error('CLOUDINARY_API_SECRET environment variable is required');
    }
    if (!process.env.CLOUDINARY_BASE_PATH) {
      throw new Error('CLOUDINARY_BASE_PATH environment variable is required');
    }

    // 使用 getImagePath 取得圖片路徑
    const imagePath = getImagePath(relativePath, originalName);

    console.log('Looking for image at:', imagePath);

    // 檢查圖片文件是否存在
    try {
      await access(imagePath);
    } catch (error) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    console.log('Configuring Cloudinary with:', {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY?.slice(0, 4) + '...',
      has_api_secret: !!process.env.CLOUDINARY_API_SECRET
    });

    // 配置 Cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // 構建與你現有結構匹配的 public_id
    const publicId = `${process.env.CLOUDINARY_BASE_PATH}/${articleSlug}/${seoFileName}`;
    
    console.log('Attempting to upload:', {
      imagePath,
      publicId,
      altText
    });

    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      tags: ['interior-design'],
      context: {
        alt: altText
      }
    });

    console.log('Upload successful:', result.secure_url);

    return {
      secure_url: result.secure_url
    };
  } catch (error: any) {
    console.error('Cloudinary upload error details:', {
      message: error?.message,
      error: error,
      originalName,
      seoFileName,
      relativePath
    });
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
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      throw new Error('NEXT_PUBLIC_SITE_URL environment variable is required');
    }

    // 上傳到 Cloudinary
    const uploadResult = await uploadToCloudinary(
      imageData.originalName,
      imageData.seoFileName,
      imageData.altText,
      articleSlug,
      imageData.relativePath
    );

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
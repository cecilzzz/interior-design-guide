import { v2 as cloudinary } from 'cloudinary';
import { access } from 'fs/promises';
import { PathManager } from './paths';
import type { ImageData } from './markdownProcessor';

/**
 * Cloudinary 上傳所需的配置和路徑資訊
 */
interface CloudinaryUploadConfig {
  /** 本地檔案路徑 */
  localPath: string;
  /** Cloudinary 資料夾路徑 */
  folder: string;
  /** 檔案名稱 */
  fileName: string;
  /** 圖片替代文字 */
  altText: string;
}

/**
 * 驗證環境變數和檔案
 * @throws {Error} 當環境變數缺失或檔案不存在時
 */
const validateUploadPrerequisites = async (localPath: string) => {
  // 驗證環境變數
  const requiredEnvVars = {
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME': process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    'CLOUDINARY_API_KEY': process.env.CLOUDINARY_API_KEY,
    'CLOUDINARY_API_SECRET': process.env.CLOUDINARY_API_SECRET
  };

  for (const [name, value] of Object.entries(requiredEnvVars)) {
    if (!value) throw new Error(`缺少 ${name} 環境變數`);
  }

  // 驗證檔案存在
  try {
    await access(localPath);
  } catch {
    throw new Error(`找不到圖片文件: ${localPath}`);
  }

  // 配置 Cloudinary SDK
  cloudinary.config({
    cloud_name: requiredEnvVars['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'],
    api_key: requiredEnvVars['CLOUDINARY_API_KEY'],
    api_secret: requiredEnvVars['CLOUDINARY_API_SECRET']
  });
};

/**
 * 從 PathManager 的輸出準備 Cloudinary 上傳配置
 */
const prepareUploadConfig = (imageData: ImageData): CloudinaryUploadConfig => {
  const pathInfo = PathManager.createPathInfo(imageData);
  const localPath = PathManager.getLocalPath(pathInfo);
  const cloudinaryPath = PathManager.getCloudinaryPath(pathInfo);

  // 分解 Cloudinary 路徑
  const pathParts = cloudinaryPath.split('/');
  const fileName = pathParts.pop() || '';
  const folder = pathParts.join('/');

  return {
    localPath,
    folder,
    fileName,
    altText: imageData.altText
  };
};

/**
 * 上傳圖片到 Cloudinary
 * @param imageData - 圖片相關資料
 * @returns 上傳後的 URL
 */
export const uploadToCloudinary = async (imageData: ImageData): Promise<{ secure_url: string }> => {
  // 1. 準備上傳配置
  const config = prepareUploadConfig(imageData);
  
  // 2. 驗證必要條件
  await validateUploadPrerequisites(config.localPath);
  
  // 3. 執行上傳
  try {
    const result = await cloudinary.uploader.upload(config.localPath, {
      tags: ['interior-design'],
      public_id: config.fileName,
      folder: config.folder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      context: { alt: config.altText }
    });
    return { secure_url: result.secure_url };
  } catch (error: any) {
    throw new Error(`Cloudinary 上傳失敗: ${error?.message || '未知錯誤'}`);
  }
}; 
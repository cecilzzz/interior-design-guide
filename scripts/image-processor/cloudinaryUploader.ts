import { v2 as cloudinary } from 'cloudinary';
import { access } from 'fs/promises';
import { PathManager } from './paths';
import type { ImageData } from './markdownProcessor';

// Cloudinary 配置
const cloudinaryConfig = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

// 上傳選項
const uploadOptions = {
  tags: ['interior-design'] as const
};

// 驗證 Cloudinary 環境變數
const validateEnv = () => {
  const { cloud_name, api_key, api_secret } = cloudinaryConfig;
  
  if (!cloud_name) throw new Error('缺少 Cloudinary Cloud Name');
  if (!api_key) throw new Error('缺少 Cloudinary API Key');
  if (!api_secret) throw new Error('缺少 Cloudinary API Secret');
};

// 驗證本地文件是否存在
const validateFile = async (localPath: string) => {
  try {
    await access(localPath);
  } catch (error) {
    throw new Error(`找不到圖片文件: ${localPath}`);
  }
};

// 配置 Cloudinary SDK
const configureCloudinary = () => {
  cloudinary.config(cloudinaryConfig);
};

// 執行上傳操作
const performUpload = async (localPath: string, cloudinaryPath: string, altText: string) => {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      ...uploadOptions,
      public_id: cloudinaryPath,
      context: { alt: altText }
    });
    return result.secure_url;
  } catch (error: any) {
    throw new Error(`Cloudinary 上傳失敗: ${error?.message || '未知錯誤'}`);
  }
};

/**
 * 上傳圖片到 Cloudinary
 * 負責處理圖片從本地到 Cloudinary 的上傳流程
 * 
 * @param imageData - 圖片相關資料，包含路徑和 SEO 資訊
 * @returns Promise<{ secure_url: string }> - 上傳成功後的 URL
 * @throws {Error} 當任何步驟失敗時拋出對應錯誤
 */
export const uploadToCloudinary = async (imageData: ImageData): Promise<{ secure_url: string }> => {
  // 驗證環境變數
  validateEnv();

  // 準備路徑
  const pathInfo = PathManager.createPathInfo(imageData);
  const localPath = PathManager.getLocalPath(pathInfo);
  const cloudinaryPath = PathManager.getCloudinaryPath(pathInfo);

  // 驗證文件
  await validateFile(localPath);

  // 配置並上傳
  configureCloudinary();
  const secure_url = await performUpload(localPath, cloudinaryPath, imageData.altText);

  return { secure_url };
}; 
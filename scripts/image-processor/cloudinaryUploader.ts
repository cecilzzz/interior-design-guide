import { v2 as cloudinary } from 'cloudinary';
import { access } from 'fs/promises';
import { PathManager } from './paths';
import type { ImageData } from './markdownProcessor';

/**
 * Cloudinary 上傳所需的配置和路徑資訊
 */
interface CloudinaryUploadConfig {
  /** 本地檔案路徑 */
  file: string;
  /** 資產在 Media Library 中的存放位置 */
  assetFolder: string;
  /** Public ID（簡短的 SEO 友好名稱） */
  publicId: string;
  /** 圖片替代文字 */
  altText: string;
}

/**
 * 驗證環境變數和檔案
 * @throws {Error} 當環境變數缺失或檔案不存在時
 */
const validateUploadPrerequisites = async (filePath: string) => {
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
    await access(filePath);
  } catch {
    throw new Error(`找不到圖片文件: ${filePath}`);
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
  const file = PathManager.getLocalPath(pathInfo);
  const cloudinaryPath = PathManager.getCloudinaryPath(pathInfo);

  // 分解 Cloudinary 路徑
  const pathParts = cloudinaryPath.split('/');
  const fileName = pathParts.pop() || '';
  const folder = pathParts.join('/');

  return {
    file,
    assetFolder: folder,
    publicId: fileName,  // 只使用檔名作為 Public ID，保持 URL 簡短
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
  await validateUploadPrerequisites(config.file);
  
  // 3. 執行上傳（使用 signed upload）
  try {
    const result = await cloudinary.uploader.upload(
      config.file,
      {
        tags: ['interior-design'],
        public_id: config.publicId,                    // 使用簡短的檔名作為 Public ID
        asset_folder: config.assetFolder,              // 只用於 Media Library 的組織
        use_asset_folder_as_public_id_prefix: false,   // 不將資料夾路徑加入到 public_id
        use_filename: false,                           // 不使用原始文件名
        unique_filename: false,                        // 不添加唯一後綴
        overwrite: true,                              // 允許覆蓋已存在的文件
        context: { alt: config.altText }
      }
    );
    return { secure_url: result.secure_url };
  } catch (error: any) {
    throw new Error(`Cloudinary 上傳失敗: ${error?.message || '未知錯誤'}`);
  }
}; 
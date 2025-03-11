import { v2 as cloudinary } from 'cloudinary';
import { access } from 'fs/promises';
import type { ImageData } from '../../app/types/image';

/**
 * Cloudinary 上傳所需的配置和路徑資訊
 */
type CloudinaryUploadConfig ={
  /** 本地檔案路徑 */
  localPath: string; // 本地絕對路徑
  /** 資產在 Media Library 中的存放位置 */
  assetFolder: string; 
  /** Public ID（簡短的 SEO 友好名稱） */
  publicID: string; // SEOFileName
  /** 圖片替代文字 */
  altText: string; // SEO專用altText
}

const getCloudinaryUploadConfig = (imageData: ImageData): CloudinaryUploadConfig => {
  //路徑合法性驗證
  if (!process.env.IMAGES_ROOT_DIR || !process.env.CLOUDINARY_BASE_PATH) {
    throw new Error('缺少必要的環境變數：IMAGES_ROOT_DIR 或 CLOUDINARY_BASE_PATH');
  }

  return {
    localPath: [process.env.IMAGES_ROOT_DIR, imageData.localPath.articleSlug, imageData.localPath.originalFileName].join('/'),
    assetFolder: [process.env.CLOUDINARY_BASE_PATH, imageData.localPath.articleSlug].join('/'),
    publicID: imageData.seo.seoFileName,
    altText: imageData.seo.altText
  };
}


/**
 * 上傳圖片到 Cloudinary
 * @param imageData - 圖片相關資料
 * @returns 上傳後的 URL
 */
export const uploadToCloudinary = async (imageData: ImageData): Promise<{ secure_url: string }> => {
  // 驗證環境變數
  const requiredEnvVars = {
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME': process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    'CLOUDINARY_API_KEY': process.env.CLOUDINARY_API_KEY,
    'CLOUDINARY_API_SECRET': process.env.CLOUDINARY_API_SECRET
  }as const;

  for (const [name, value] of Object.entries(requiredEnvVars)) {
    if (!value) throw new Error(`缺少 ${name} 環境變數`);
  }

  // 配置 Cloudinary SDK
  cloudinary.config({
    cloud_name: requiredEnvVars['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'],
    api_key: requiredEnvVars['CLOUDINARY_API_KEY'],
    api_secret: requiredEnvVars['CLOUDINARY_API_SECRET']
  });

  // 準備上傳配置
  const cloudinaryUploadconfig = getCloudinaryUploadConfig(imageData);

  // 驗證圖片文件存在
  try {
    await access(cloudinaryUploadconfig.localPath);
  } catch {
    throw new Error(`找不到圖片文件: ${cloudinaryUploadconfig.localPath}`);
  }
  
  // 執行上傳（使用 signed upload）
  try {
    const result = await cloudinary.uploader.upload(
      cloudinaryUploadconfig.localPath,
      {
        public_id: cloudinaryUploadconfig.publicID,    // 使用簡短的檔名作為 Public ID
        asset_folder: cloudinaryUploadconfig.assetFolder,   // 只用於 Media Library 的組織
        use_asset_folder_as_public_id_prefix: false,   // 不將資料夾路徑加入到 public_id
        use_filename: false,                           // 不使用原始文件名
        unique_filename: false,                        // 不添加唯一後綴
        overwrite: true,                               // 允許覆蓋已存在的文件
        context: { alt: cloudinaryUploadconfig.altText },
        auto_tagging: 0.6,  //信心度
        resource_type: "image",  // 明確指定資源類型
        tags: ["interior-design"],  // 保留手動標籤
        categorization: "google_tagging"  // 指定使用 Google Vision API 進行自動標籤
      }
    );
    return { secure_url: result.secure_url };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知錯誤';
    throw new Error(`Cloudinary 上傳失敗: ${errorMessage}`);
  }
}; 
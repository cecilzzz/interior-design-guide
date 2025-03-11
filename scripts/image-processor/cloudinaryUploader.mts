import { v2 as cloudinary } from 'cloudinary';
import { access } from 'node:fs/promises';
import type { ImageData } from '../../app/types/image.js';

/**
 * Cloudinary 上傳所需的配置和路徑資訊
 */
type CloudinaryUploadConfig = {
  /** 本地檔案路徑 */
  localPath: string; // 本地絕對路徑
  /** 資產在 Media Library 中的存放位置 */
  assetFolder: string; 
  /** Public ID（簡短的 SEO 友好名稱） */
  publicID: string; // SEOFileName
  /** 圖片替代文字 */
  altText: string; // SEO專用altText
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getCloudinaryUploadConfig = (imageData: ImageData): CloudinaryUploadConfig => {
  console.log('準備 Cloudinary 上傳配置...');
  console.log('環境變數檢查:');
  console.log('- IMAGES_ROOT_DIR:', process.env.IMAGES_ROOT_DIR ? '已設置' : '未設置');
  console.log('- CLOUDINARY_BASE_PATH:', process.env.CLOUDINARY_BASE_PATH ? '已設置' : '未設置');
  
  //路徑合法性驗證
  if (!process.env.IMAGES_ROOT_DIR || !process.env.CLOUDINARY_BASE_PATH) {
    throw new Error('缺少必要的環境變數：IMAGES_ROOT_DIR 或 CLOUDINARY_BASE_PATH');
  }

  const config = {
    localPath: [process.env.IMAGES_ROOT_DIR, 'public', imageData.localPath.articleSlug, imageData.localPath.originalFileName].join('/'),
    assetFolder: [process.env.CLOUDINARY_BASE_PATH, imageData.localPath.articleSlug].join('/'),
    publicID: imageData.seo.seoFileName,
    altText: imageData.seo.altText
  };

  console.log('生成的配置:');
  console.log(JSON.stringify(config, null, 2));

  return config;
}

/**
 * 上傳圖片到 Cloudinary
 * @param imageData - 圖片相關資料
 * @returns 上傳後的 URL
 */
export const uploadToCloudinary = async (imageData: ImageData): Promise<{ secure_url: string }> => {
  console.log('\n開始 Cloudinary 上傳流程...');
  
  // 驗證環境變數
  const requiredEnvVars = {
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME': process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    'CLOUDINARY_API_KEY': process.env.CLOUDINARY_API_KEY,
    'CLOUDINARY_API_SECRET': process.env.CLOUDINARY_API_SECRET
  } as const;

  console.log('檢查 Cloudinary 環境變數:');
  for (const [name, value] of Object.entries(requiredEnvVars)) {
    console.log(`- ${name}: ${value ? '已設置' : '未設置'}`);
    if (!value) throw new Error(`缺少 ${name} 環境變數`);
  }

  // 配置 Cloudinary SDK
  console.log('配置 Cloudinary SDK...');
  cloudinary.config({
    cloud_name: requiredEnvVars['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'],
    api_key: requiredEnvVars['CLOUDINARY_API_KEY'],
    api_secret: requiredEnvVars['CLOUDINARY_API_SECRET']
  });

  // 準備上傳配置
  console.log('獲取上傳配置...');
  const cloudinaryUploadconfig = getCloudinaryUploadConfig(imageData);

  // 驗證圖片文件存在
  console.log('驗證本地文件存在性:', cloudinaryUploadconfig.localPath);
  try {
    await access(cloudinaryUploadconfig.localPath);
    console.log('文件存在，準備上傳');
  } catch (error) {
    console.error('文件訪問錯誤:', error);
    throw new Error(`找不到圖片文件: ${cloudinaryUploadconfig.localPath}`);
  }
  
  // 執行上傳（使用 signed upload）
  console.log('開始上傳到 Cloudinary...');

  let lastError: Error | null = null;
  let uploadOptions: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      uploadOptions = {
        public_id: cloudinaryUploadconfig.publicID,
        folder: cloudinaryUploadconfig.assetFolder,
        use_filename: false,
        unique_filename: false,
        overwrite: true,
        resource_type: "image" as const,
        type: "upload",
        access_mode: "public",
        context: {
          alt: cloudinaryUploadconfig.altText,
          caption: cloudinaryUploadconfig.altText
        },
        tags: ["interior-design"]
      };
      
      console.log(`嘗試上傳 (${attempt}/${MAX_RETRIES})...`);
      console.log('上傳選項:', JSON.stringify(uploadOptions, null, 2));
      
      const result = await cloudinary.uploader.upload(
        cloudinaryUploadconfig.localPath,
        uploadOptions
      );
      
      console.log('上傳成功:', result);
      return { secure_url: result.secure_url };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(JSON.stringify(error));
      console.error(`上傳嘗試 ${attempt} 失敗:`, {
        error,
        config: cloudinaryUploadconfig,
        options: uploadOptions
      });
      
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * attempt;
        console.log(`等待 ${delay}ms 後重試...`);
        await sleep(delay);
      }
    }
  }

  throw new Error(`Cloudinary 上傳失敗 (已重試 ${MAX_RETRIES} 次): ${lastError?.message}`);
}; 
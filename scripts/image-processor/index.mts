import { uploadToCloudinary } from './cloudinaryUploader.mts';
import { createPin } from './pinterestPublisher.mts';
import { getCollectedImages } from './imageCollector.mts';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { resolve } from 'path';
import type { ImageData } from "../../app/types/image.ts";

// 載入環境變數
config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  const startTime = Date.now();

  try {
    // 驗證命令行參數
    const markdownPath = resolve(process.argv[2]);
    if (!markdownPath) {
      throw new Error('請提供 MDX 文件路徑');
    }
    if (!markdownPath.endsWith('.mdx')) {
      throw new Error('請提供有效的 MDX 文件路徑');
    }

    // 驗證必要的環境變數
    const requiredEnvVars = [
      'IMAGES_ROOT_DIR',
      'CLOUDINARY_BASE_PATH',
      'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET',
      'NEXT_PUBLIC_SITE_URL'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`缺少必要的環境變數: ${missingVars.join(', ')}`);
    }

    console.log('開始處理 MDX 文件:', markdownPath);
    
    // 讀取並解析 Markdown
    const content = readFileSync(markdownPath, 'utf-8');
    console.log('成功讀取文件內容，長度:', content.length, '字節');
    
    const collectedImages = await getCollectedImages(content);
    console.log('\n處理後的圖片數量:', collectedImages.length);
    
    // 處理統計
    let total = 0, success = 0, failed = 0;
    const errors: Array<{ file: string; error: string }> = [];

    // 同時處理所有圖片
    await Promise.all(collectedImages.map(async (imageData, index) => {
      total++;
      try {
        console.log(`\n處理圖片 (${index + 1}/${collectedImages.length}): ${imageData.localPath.originalFileName}`);
        console.log('圖片數據:', JSON.stringify(imageData, null, 2));
        
        // 上傳到 Cloudinary
        const { secure_url } = await uploadToCloudinary(imageData);
        console.log(`Cloudinary 上傳成功: ${secure_url}`);

        console.log('Pinterest 發布已跳過（API 未通過審核）');
        success++;
      } catch (error) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : '未知錯誤';
        errors.push({
          file: imageData.localPath.originalFileName,
          error: errorMessage
        });
        console.error(`處理失敗: ${errorMessage}`);
      }
    }));

    // 計算處理時間
    const duration = (Date.now() - startTime) / 1000;

    // 輸出統計結果
    console.log('\n處理統計:');
    console.log('='.repeat(30));
    console.log(`總數: ${total}`);
    console.log(`成功: ${success} (${((success/total)*100).toFixed(1)}%)`);
    console.log(`失敗: ${failed} (${((failed/total)*100).toFixed(1)}%)`);
    console.log(`總耗時: ${duration.toFixed(1)} 秒`);
    console.log(`平均每張圖片: ${(duration/total).toFixed(1)} 秒`);

    if (errors.length > 0) {
      console.log('\n錯誤詳情:');
      console.log('-'.repeat(30));
      errors.forEach(({ file, error }, index) => {
        console.log(`${index + 1}. ${file}:`);
        console.log(`   ${error}`);
      });
    }

  } catch (error) {
    console.error('腳本執行失敗:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// 確保 main 函數的錯誤被正確處理
main().catch(error => {
  console.error('未處理的錯誤:', error instanceof Error ? error.message : error);
  process.exit(1);
}); 
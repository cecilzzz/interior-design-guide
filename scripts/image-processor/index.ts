import { uploadToCloudinary } from './cloudinaryUploader';
import { createPin } from './pinterestPublisher';
import { getCollectedImages } from './imageCollector';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { resolve } from 'path';
import type { ImageData } from "../../app/types/image";

// 載入環境變數
config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  const startTime = Date.now();

  // 驗證命令行參數
  const markdownPath = resolve(process.argv[2]);
  if (!markdownPath) {
    console.error('請提供 MDX 文件路徑');
    process.exit(1);
  }
  if (!markdownPath.endsWith('.mdx')) {
    console.error('請提供有效的 MDX 文件路徑');
    process.exit(1);
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
    console.error('缺少必要的環境變數:', missingVars.join(', '));
    process.exit(1);
  }

  try {
    console.log('開始處理 MDX 文件:', markdownPath);
    
    // 讀取並解析 Markdown
    const content = readFileSync(markdownPath, 'utf-8');
    console.log('成功讀取文件內容，長度:', content.length, '字節');
    
    const collectedImages: ImageData[] = await getCollectedImages(content);
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

        // 發布到 Pinterest（暫時跳過，因為 API 未通過審核）
        /* 等 API 審核通過後再啟用
        const { id } = await createPin(
          imageData,
          secure_url,
          process.env.NEXT_PUBLIC_SITE_URL || ''
        );
        console.log(`Pinterest 發布成功: ${id}`);
        */
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
    const errorMessage = error instanceof Error ? error.message : '未知錯誤';
    console.error('腳本執行失敗:', errorMessage);
    process.exit(1);
  }
}

main(); 
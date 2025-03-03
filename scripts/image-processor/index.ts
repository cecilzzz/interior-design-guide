import { uploadToCloudinary } from './cloudinaryUploader';
import { createPin } from './pinterestPublisher';
import { processMarkdown } from './markdownProcessor';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { resolve } from 'path';

// 載入環境變數
config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  const [, , markdownPath] = process.argv;
  if (!markdownPath) {
    console.error('請提供 Markdown 文件路徑');
    process.exit(1);
  }

  try {
    console.log('開始處理 Markdown 文件:', markdownPath);
    
    // 讀取並解析 Markdown
    const content = readFileSync(markdownPath, 'utf-8');
    console.log('成功讀取文件內容，長度:', content.length, '字節');
    
    // 檢查 SEO 注釋
    const seoComments = content.match(/<!--SEO[\s\S]*?-->/g);
    console.log('找到 SEO 注釋數量:', seoComments?.length || 0);
    if (seoComments) {
      console.log('\n第一個 SEO 注釋內容:');
      console.log(seoComments[0]);
    }
    
    const images = await processMarkdown(content);
    console.log('\n處理後的圖片數量:', images.length);
    
    // 處理統計
    let total = 0, success = 0, failed = 0;
    const errors: Array<{ file: string; error: string }> = [];

    // 處理每個圖片
    for (const imageData of images) {
      total++;
      try {
        console.log(`\n處理圖片: ${imageData.originalName}`);
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
      } catch (error: any) {
        failed++;
        errors.push({
          file: imageData.originalName,
          error: error.message
        });
        console.error(`處理失敗: ${error.message}`);
      }
    }

    // 輸出統計結果
    console.log('\n處理統計:');
    console.log(`總數: ${total}`);
    console.log(`成功: ${success}`);
    console.log(`失敗: ${failed}`);
    if (errors.length > 0) {
      console.log('\n錯誤詳情:');
      errors.forEach(({ file, error }) => {
        console.log(`${file}: ${error}`);
      });
    }

  } catch (error: any) {
    console.error('腳本執行失敗:', error.message);
    process.exit(1);
  }
}

main(); 
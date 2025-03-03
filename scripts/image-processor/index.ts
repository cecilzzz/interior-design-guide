import { uploadToCloudinary } from './cloudinaryUploader';
import { createPin } from './pinterestPublisher';
import { processMarkdown } from './markdownProcessor';
import { readFileSync } from 'fs';

async function main() {
  const [, , markdownPath] = process.argv;
  if (!markdownPath) {
    console.error('請提供 Markdown 文件路徑');
    process.exit(1);
  }

  try {
    // 讀取並解析 Markdown
    const content = readFileSync(markdownPath, 'utf-8');
    const images = await processMarkdown(content);
    
    // 處理統計
    let total = 0, success = 0, failed = 0;
    const errors: Array<{ file: string; error: string }> = [];

    // 處理每個圖片
    for (const imageData of images) {
      total++;
      try {
        console.log(`處理圖片: ${imageData.originalName}`);
        
        // 上傳到 Cloudinary
        const { secure_url } = await uploadToCloudinary(imageData);
        console.log(`Cloudinary 上傳成功: ${secure_url}`);

        // 發布到 Pinterest
        const { id } = await createPin(
          imageData,
          secure_url,
          process.env.NEXT_PUBLIC_SITE_URL || ''
        );
        console.log(`Pinterest 發布成功: ${id}`);

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
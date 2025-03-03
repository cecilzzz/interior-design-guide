import { readFile, access } from 'fs/promises';
import { join, resolve } from 'path';
import { config } from 'dotenv';
import { extractImagesWithSections } from '../app/lib/markdownProcessor';
import { processImage, createProcessingStats, updateStats } from '../app/lib/imageProcessor';

// 載入環境變數
config({ path: '.env.local' });

/**
 * Pinterest 面板 ID
 * 從環境變數獲取
 */
const BOARD_ID = process.env.PINTEREST_BOARD_ID;

/**
 * 處理單篇文章
 * 主要處理流程：
 * 1. 讀取並解析 markdown 文件
 * 2. 提取圖片資訊
 * 3. 處理每張圖片（上傳到 Cloudinary 和 Pinterest）
 * 4. 追蹤處理統計
 * 
 * @param {string} filePath - markdown 文件路徑
 * @returns {Promise<void>}
 */
async function processArticle(filePath: string) {
  try {
    // 檢查 BOARD_ID
    if (!BOARD_ID) {
      throw new Error('PINTEREST_BOARD_ID environment variable is required');
    }

    // 檢查文件是否存在
    try {
      await access(filePath);
    } catch (error) {
      throw new Error(`File not found: ${filePath}`);
    }

    // 讀取 markdown 文件
    const content = await readFile(filePath, 'utf-8');
    
    // 提取圖片和段落信息
    const images = await extractImagesWithSections(content);
    
    // 創建統計對象
    const stats = createProcessingStats();
    
    // 獲取文章 slug
    const slug = filePath
      .split('/')
      .pop()
      ?.replace('.md', '') || '';
    
    // 處理每個圖片
    for (const { imageData, sectionId } of images) {
      const result = await processImage(
        imageData,
        sectionId,
        slug,
        BOARD_ID
      );
      
      updateStats(stats, result, imageData.originalName);
    }
    
    // 輸出統計信息
    console.log('\nProcessing Statistics:');
    console.log(`Total: ${stats.total}`);
    console.log(`Success: ${stats.success}`);
    console.log(`Failed: ${stats.failed}`);
    
    if (stats.errors.length > 0) {
      console.log('\nErrors:');
      stats.errors.forEach(({ file, error }: { file: string; error: string }) => {
        console.log(`${file}: ${error}`);
      });
    }
    
  } catch (error: any) {
    console.error('Error processing article:', error?.message || error);
    process.exit(1);
  }
}

/**
 * 主程序入口
 * 處理命令行參數並啟動文章處理
 * 
 * 使用方式：
 * ```bash
 * npm run process-images <markdown-file>
 * ```
 */
async function main() {
  const [,, filePath] = process.argv;
  
  if (!filePath) {
    console.error('Please provide a markdown file path');
    process.exit(1);
  }
  
  if (!BOARD_ID) {
    console.error('PINTEREST_BOARD_ID environment variable is required');
    process.exit(1);
  }
  
  // 使用 resolve 來處理相對路徑
  const fullPath = resolve(process.cwd(), filePath);
  await processArticle(fullPath);
}

main().catch((error: any) => {
  console.error('Unhandled error:', error?.message || error);
  process.exit(1);
}); 
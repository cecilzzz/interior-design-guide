import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { extractImagesWithSections, updateMarkdownImageUrls } from '../app/lib/markdownProcessor';
import { processImage, createProcessingStats, updateStats } from '../app/lib/imageProcessor';

const CONTENT_DIR = join(process.cwd(), 'content');
const BOARD_ID = process.env.PINTEREST_BOARD_ID;

async function processArticle(filePath: string) {
  try {
    // 檢查 BOARD_ID
    if (!BOARD_ID) {
      throw new Error('PINTEREST_BOARD_ID environment variable is required');
    }

    // 讀取 markdown 文件
    const content = await readFile(filePath, 'utf-8');
    
    // 提取圖片和段落信息
    const images = await extractImagesWithSections(content);
    
    // 創建統計對象
    const stats = createProcessingStats();
    
    // 存儲圖片更新信息
    const imageUpdates = new Map<string, string>();
    
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
      
      if (result.success && result.cloudinaryUrl) {
        imageUpdates.set(imageData.originalName, result.cloudinaryUrl);
      }
    }
    
    // 更新 markdown 文件中的圖片 URL
    const updatedContent = updateMarkdownImageUrls(content, imageUpdates);
    await writeFile(filePath, updatedContent, 'utf-8');
    
    // 輸出統計信息
    console.log('\nProcessing Statistics:');
    console.log(`Total: ${stats.total}`);
    console.log(`Success: ${stats.success}`);
    console.log(`Failed: ${stats.failed}`);
    
    if (stats.errors.length > 0) {
      console.log('\nErrors:');
      stats.errors.forEach(({ file, error }) => {
        console.log(`${file}: ${error}`);
      });
    }
    
  } catch (error: any) {
    console.error('Error processing article:', error?.message || error);
    process.exit(1);
  }
}

// 主函數
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
  
  const fullPath = join(CONTENT_DIR, filePath);
  await processArticle(fullPath);
}

main().catch((error: any) => {
  console.error('Unhandled error:', error?.message || error);
  process.exit(1);
}); 
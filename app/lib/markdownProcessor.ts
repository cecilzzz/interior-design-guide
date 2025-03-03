import { remark } from 'remark';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

/**
 * 圖片資料介面定義
 * 用於存儲圖片的基本資訊和 Pinterest 相關資料
 * 
 * @interface ImageData
 * @property {string} originalName - 原始圖片檔名
 * @property {string} relativePath - 圖片相對於根目錄的路徑（例如：'article-1/images/'）
 * @property {string} seoFileName - 優化後的 SEO 友好檔名
 * @property {string} altText - 圖片替代文字
 * @property {object} pin - Pinterest 相關資訊
 * 
 * @exports
 * 被 imageProcessor.ts 中的 processImage 函數使用
 * 被 process-images.ts 中作為處理結果的一部分
 */
export interface ImageData {
  originalName: string;
  relativePath: string;
  seoFileName: string;
  altText: string;
  pin: {
    title: string;
    description: string;
  }
}

/**
 * 處理後的圖片資訊介面
 * 包含圖片資料、所屬段落ID和相關的 markdown 內容
 * 
 * @interface ProcessedImage
 * @property {ImageData} imageData - 圖片基本資訊
 * @property {string} sectionId - 圖片所屬文章段落的 ID
 * @property {object} markdown - 圖片前後的 markdown 內容
 * 
 * @internal
 * 僅在 markdownProcessor.ts 內部使用
 */
interface ProcessedImage {
  imageData: ImageData;
  sectionId: string;
  markdown: {
    before: string;
    after: string;
  }
}

/**
 * 從 markdown 內容中提取 SEO 數據
 * 解析 markdown 中的特殊 SEO 註釋，轉換為 ImageData 陣列
 * 
 * @param {string} content - markdown 文件內容
 * @returns {ImageData[]} 解析出的圖片資料陣列
 * 
 * @exports
 * 可被其他模組使用來提取圖片的 SEO 資訊
 */
export const extractSeoData = (content: string): ImageData[] => {
  const seoDataRegex = /<!--SEO([\s\S]*?)-->/g;
  const matches = content.matchAll(seoDataRegex);
  return Array.from(matches).map(match => {
    try {
      return JSON.parse(match[1].trim());
    } catch (error) {
      console.error('Error parsing SEO data:', error);
      return null;
    }
  }).filter(Boolean);
};

/**
 * 從 markdown 內容中提取圖片和相關的段落 ID
 * 使用 remark 解析 markdown，提取圖片資訊和相關內容
 * 
 * @param {string} content - markdown 文件內容
 * @returns {Promise<ProcessedImage[]>} 處理後的圖片資訊陣列
 * 
 * @exports
 * 被 process-images.ts 使用來處理 markdown 文件
 */
export const extractImagesWithSections = async (content: string): Promise<ProcessedImage[]> => {
  const images: ProcessedImage[] = [];
  let currentSectionId = '';

  const processor = remark()
    .use(() => (tree: Root) => {
      visit(tree, (node: any) => {
        // 檢查段落標題中的 ID
        if (node.type === 'heading') {
          const headingText = String(node.children?.[0]?.value || '');
          const idMatch = headingText.match(/{#([^}]+)}/);
          if (idMatch) {
            currentSectionId = idMatch[1];
          }
        }

        // 提取圖片和相關的 SEO 數據
        if (node.type === 'image') {
          const beforeContent = content.slice(0, node.position?.start?.offset);
          const afterContent = content.slice(node.position?.end?.offset);
          
          // 尋找最近的 SEO 註釋
          const seoComment = beforeContent.match(/<!--SEO([\s\S]*?)-->\s*$/);
          if (seoComment) {
            try {
              const imageData: ImageData = JSON.parse(seoComment[1].trim());
              images.push({
                imageData,
                sectionId: currentSectionId,
                markdown: {
                  before: beforeContent,
                  after: afterContent
                }
              });
            } catch (error) {
              console.error('Error parsing image SEO data:', error);
            }
          }
        }
      });
    });

  await processor.process(content);
  return images;
}; 
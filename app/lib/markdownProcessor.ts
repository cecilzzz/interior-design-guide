import { remark } from 'remark';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

export interface ImageData {
  originalName: string;
  seoFileName: string;
  altText: string;
  pin: {
    title: string;
    description: string;
  }
}

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

/**
 * 更新 markdown 內容中的圖片路徑
 */
export const updateMarkdownImageUrls = (
  content: string,
  imageUpdates: Map<string, string>
): string => {
  let updatedContent = content;
  
  for (const [originalName, cloudinaryUrl] of imageUpdates.entries()) {
    const regex = new RegExp(`!\\[([^\\]]*)\\]\\(${originalName}\\)`, 'g');
    updatedContent = updatedContent.replace(regex, `![${cloudinaryUrl}]`);
  }
  
  return updatedContent;
}; 
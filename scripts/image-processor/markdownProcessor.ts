import { remark } from 'remark';
import { visit } from 'unist-util-visit';
import type { Root, Image, Heading, Text } from 'mdast';

/**
 * Markdown 文件中的 SEO 注釋格式說明
 * 
 * 1. 注釋位置：
 *    - 必須放在對應圖片的 Markdown 引用之前
 *    - 注釋和圖片引用之間不能有其他內容
 * 
 * 2. 格式範例：
 *    ```markdown
 *    <!--SEO
 *    {
 *      "originalName": "zen-room.jpg",        // 原始圖片檔名（必填）
 *      "localRelativePath": "japandi/zen",    // 本地相對路徑（必填）
 *      "seoFileName": "japanese-zen-room",    // SEO 檔名，不含副檔名（必填）
 *      "articleSlug": "zen-meditation-rooms", // 文章 slug（必填）
 *      "altText": "日式禪風冥想房間",         // 圖片描述（必填）
 *      "pin": {                              // Pinterest 資訊（必填）
 *        "title": "25+ 日式禪風房間設計靈感",  // Pin 標題
 *        "description": "打造寧靜的冥想空間"   // Pin 描述
 *      }
 *    }
 *    -->
 *    ![日式禪風冥想房間](/images/zen-room.jpg)
 *    ```
 * 
 * 3. 注意事項：
 *    - JSON 格式必須完全正確，包括引號和逗號
 *    - 所有欄位都是必填的
 *    - seoFileName 只能包含小寫字母、數字和連字符
 *    - 圖片引用的 alt 文字建議與 altText 保持一致
 */

/**
 * 圖片資料介面定義
 * 用於存儲圖片的基本資訊和 Pinterest 相關資料
 * 
 * @property originalName - 原始圖片檔名，用於本地檔案存取
 * @property localRelativePath - 圖片在本地檔案系統中的相對路徑
 * @property seoFileName - SEO 友好的檔名，用於 Cloudinary 存儲
 * @property articleSlug - 文章的 slug，用於構建 Cloudinary 路徑
 * @property sectionId - 圖片所屬文章段落的 ID，用於構建錨點連結
 * @property altText - 圖片替代文字，用於 SEO 和無障礙
 * @property pin - Pinterest 相關資訊
 */
export interface ImageData {
  originalName: string;
  localRelativePath: string;
  seoFileName: string;
  articleSlug: string;
  sectionId: string;
  altText: string;
  pin: {
    title: string;
    description: string;
  }
}

// 內部介面：處理後的圖片資訊
interface ProcessedImage {
  imageData: ImageData;
  sectionId: string;
  markdown: {
    before: string;
    after: string;
  }
}

// 內部函數：從 markdown 內容中提取 SEO 數據
const extractSeoData = (content: string): ImageData[] => {
  const seoDataRegex = /<!--SEO([\s\S]*?)-->/g;
  const matches = content.matchAll(seoDataRegex);
  const results: ImageData[] = [];

  for (const match of matches) {
    try {
      const data = JSON.parse(match[1].trim());
      if (!data.originalName || !data.localRelativePath || !data.seoFileName || 
          !data.altText || !data.pin || !data.articleSlug) {
        console.error('缺少必要的 SEO 欄位:', data);
        continue;
      }
      results.push(data);
    } catch (error) {
      console.error('解析 SEO 數據時出錯:', error);
    }
  }

  return results;
};

// 內部函數：從 markdown 內容中提取圖片和相關的段落 ID
const extractImagesWithSections = async (content: string): Promise<ProcessedImage[]> => {
  const images: ProcessedImage[] = [];
  let currentSectionId = '';

  const processor = remark()
    .use(() => (tree: Root) => {
      visit(tree, (node) => {
        // 檢查段落標題中的 ID
        if (node.type === 'heading') {
          const headingNode = node as Heading;
          const textNode = headingNode.children[0] as Text;
          if (textNode?.value) {
            const idMatch = textNode.value.match(/{#([^}]+)}/);
            if (idMatch) {
              currentSectionId = idMatch[1];
            }
          }
        }

        // 提取圖片和相關的 SEO 數據
        if (node.type === 'image') {
          const imageNode = node as Image;
          if (!imageNode.position) return;

          const beforeContent = content.slice(0, imageNode.position.start.offset);
          const afterContent = content.slice(imageNode.position.end.offset);
          
          const seoComment = beforeContent.match(/<!--SEO([\s\S]*?)-->\s*$/);
          if (seoComment) {
            try {
              const imageData: ImageData = {
                ...JSON.parse(seoComment[1].trim()),
                sectionId: currentSectionId
              };

              if (!imageData.originalName || !imageData.localRelativePath || 
                  !imageData.seoFileName || !imageData.altText || 
                  !imageData.pin || !imageData.articleSlug) {
                console.error('圖片 SEO 數據缺少必要欄位');
                return;
              }

              images.push({
                imageData,
                sectionId: currentSectionId,
                markdown: { before: beforeContent, after: afterContent }
              });
            } catch (error) {
              console.error('解析圖片 SEO 數據時出錯:', error);
            }
          }
        }
      });
    });

  await processor.process(content);
  return images;
};

/**
 * 處理 Markdown 文件中的圖片
 * 提取所有圖片資訊，包含 SEO 數據和相關內容
 * 
 * @param content - Markdown 文件內容
 * @returns 圖片資訊陣列，每個元素包含圖片的完整資訊
 */
export const processMarkdown = async (content: string): Promise<ImageData[]> => {
  const processedImages = await extractImagesWithSections(content);
  return processedImages.map(image => image.imageData);
};
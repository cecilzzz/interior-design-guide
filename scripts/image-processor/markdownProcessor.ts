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
 *    [//]: # (SEO
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
 *    )
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

/**
 * 從 markdown 內容中提取圖片和相關的段落 ID
 * @internal 僅在 markdownProcessor.ts 內部使用
 */
const extractImagesWithSections = async (content: string): Promise<ProcessedImage[]> => {
  const images: ProcessedImage[] = [];
  let currentSectionId = '';
  const processedUrls = new Set<string>();  // 用於追蹤已處理的圖片 URL

  // 1. 找出所有圖片
  const allImages: { node: Image; sectionId: string }[] = [];
  
  const processor = remark()
    .use(() => (tree: Root) => {
      visit(tree, (node) => {
        // 從標題文本生成 ID
        if (node.type === 'heading') {
          const headingNode = node as Heading;
          const textNode = headingNode.children[0] as Text;
          if (textNode?.value) {
            currentSectionId = textNode.value
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');
          }
        }

        // 收集圖片節點
        if (node.type === 'image') {
          const imageNode = node as Image;
          if (imageNode.position && !processedUrls.has(imageNode.url)) {
            allImages.push({ node: imageNode, sectionId: currentSectionId });
          }
        }
      });
    });

  await processor.process(content);
  console.log(`找到 ${allImages.length} 張圖片`);

  // 2. 處理每張圖片的 SEO 注釋
  for (const { node: imageNode, sectionId } of allImages) {
    // 如果圖片已經處理過，跳過
    if (processedUrls.has(imageNode.url)) {
      continue;
    }

    const beforeContent = content.slice(0, imageNode.position!.start.offset);
    const seoCommentRegex = /\[\/\/\]: # \(SEO\s*(\{[\s\S]*?\})\s*\)[\s\n]*$/;
    const match = beforeContent.match(seoCommentRegex);

    if (!match) {
      console.warn(`圖片缺少 SEO 注釋: ${imageNode.url}`);
      continue;
    }

    try {
      // 清理 JSON 字符串：移除額外的空格和換行符
      const jsonStr = match[1]
        .replace(/\s+$/gm, '')        // 移除每行末尾的空格
        .replace(/,\s*([\]}])/g, '$1') // 移除對象和數組結尾的逗號
        .trim();                       // 移除開頭和結尾的空格

      const seoData = JSON.parse(jsonStr);

      // 驗證必要欄位
      if (!seoData.originalName || !seoData.localRelativePath || 
          !seoData.seoFileName || !seoData.altText || 
          !seoData.pin) {
        console.warn(`圖片的 SEO 注釋缺少必要欄位: ${imageNode.url}`);
        continue;
      }

      // 處理 articleSlug
      let articleSlug = seoData.articleSlug?.trim();  // 確保移除空格
      if (!articleSlug) {
        const pathParts = seoData.localRelativePath.split('/');
        articleSlug = pathParts[pathParts.length - 1];
        
        if (!articleSlug) {
          console.warn(`無法從 localRelativePath 提取 articleSlug: ${seoData.localRelativePath}`);
          continue;
        }
      }

      const imageData: ImageData = {
        originalName: seoData.originalName.trim(),
        localRelativePath: seoData.localRelativePath.trim(),
        seoFileName: seoData.seoFileName.trim(),
        articleSlug: articleSlug,
        sectionId: sectionId,
        altText: seoData.altText.trim(),
        pin: {
          title: seoData.pin.title.trim(),
          description: seoData.pin.description.trim()
        }
      };

      images.push({
        imageData,
        sectionId: sectionId,
        markdown: { before: beforeContent, after: '' }
      });

      // 標記圖片已處理
      processedUrls.add(imageNode.url);
    } catch (error) {
      console.warn(`解析圖片 SEO 注釋失敗: ${imageNode.url}`, error);
      continue;
    }
  }

  console.log(`成功處理 ${images.length} 張帶有完整 SEO 注釋的圖片`);
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
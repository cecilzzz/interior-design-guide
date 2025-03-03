import { remark } from 'remark';
import { visit } from 'unist-util-visit';
import type { Root, Image, Heading, Text } from 'mdast';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import fs from 'fs/promises';

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
  altText: string;
  pin: {
    title: string;
    description: string;
  };
  articleSlug: string;
  sectionId: string;
}

export interface ProcessResult {
  total: number;
  success: number;
  failure: number;
  images: ImageData[];
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

  console.log('開始解析 SEO 數據');
  for (const match of matches) {
    try {
      console.log('找到 SEO 注釋:', match[1].trim());
      const data = JSON.parse(match[1].trim());
      console.log('解析後的數據:', data);
      
      if (!data.originalName || !data.localRelativePath || !data.seoFileName || 
          !data.altText || !data.pin || !data.articleSlug) {
        console.error('缺少必要的 SEO 欄位，檢查:', {
          originalName: !!data.originalName,
          localRelativePath: !!data.localRelativePath,
          seoFileName: !!data.seoFileName,
          altText: !!data.altText,
          pin: !!data.pin,
          articleSlug: !!data.articleSlug
        });
        continue;
      }
      results.push(data);
    } catch (error) {
      console.error('解析 SEO 數據時出錯:', error);
    }
  }

  console.log('找到的有效圖片數量:', results.length);
  return results;
};

// 內部函數：從 markdown 內容中提取圖片和相關的段落 ID
const extractImagesWithSections = async (content: string): Promise<ProcessedImage[]> => {
  const images: ProcessedImage[] = [];
  let currentSectionId = '';

  console.log('開始處理 Markdown 內容');
  
  const processor = remark()
    .use(() => (tree: Root) => {
      console.log('開始遍歷 AST');
      
      visit(tree, (node) => {
        // 檢查段落標題中的 ID
        if (node.type === 'heading') {
          const headingNode = node as Heading;
          const textNode = headingNode.children[0] as Text;
          if (textNode?.value) {
            const idMatch = textNode.value.match(/{#([^}]+)}/);
            if (idMatch) {
              currentSectionId = idMatch[1];
              console.log('找到段落 ID:', currentSectionId);
            }
          }
        }

        // 提取圖片和相關的 SEO 數據
        if (node.type === 'image') {
          console.log('找到圖片節點');
          const imageNode = node as Image;
          if (!imageNode.position) {
            console.log('圖片節點缺少位置信息');
            return;
          }

          const beforeContent = content.slice(0, imageNode.position.start.offset);
          const afterContent = content.slice(imageNode.position.end.offset);
          
          console.log('尋找 SEO 注釋');
          const seoComment = beforeContent.match(/<!--SEO([\s\S]*?)-->\s*$/);
          if (seoComment) {
            console.log('找到 SEO 注釋:', seoComment[1].trim());
            console.log('原始 SEO 注釋內容:', seoComment);
            try {
              const seoData = JSON.parse(seoComment[1].trim());
              console.log('解析後的 SEO 數據:', seoData);
              console.log('檢查 articleSlug 欄位:', {
                hasArticleSlug: 'articleSlug' in seoData,
                articleSlugValue: seoData.articleSlug
              });
              const imageData: ImageData = {
                ...seoData,
                sectionId: currentSectionId
              };

              console.log('解析後的圖片數據:', imageData);

              if (!imageData.originalName || !imageData.localRelativePath || 
                  !imageData.seoFileName || !imageData.altText || 
                  !imageData.pin || !imageData.articleSlug) {
                console.error('圖片 SEO 數據缺少必要欄位，檢查:', {
                  originalName: !!imageData.originalName,
                  localRelativePath: !!imageData.localRelativePath,
                  seoFileName: !!imageData.seoFileName,
                  altText: !!imageData.altText,
                  pin: !!imageData.pin,
                  articleSlug: !!imageData.articleSlug
                });
                return;
              }

              images.push({
                imageData,
                sectionId: currentSectionId,
                markdown: { before: beforeContent, after: afterContent }
              });
              console.log('成功添加圖片數據');
            } catch (error) {
              console.error('解析圖片 SEO 數據時出錯:', error);
            }
          } else {
            console.log('未找到 SEO 注釋');
          }
        }
      });
    });

  await processor.process(content);
  console.log('處理完成，找到圖片數量:', images.length);
  return images;
};

/**
 * 從標題節點中提取章節 ID
 */
function extractSectionId(node: Heading): string {
  let text = '';
  visit(node, 'text', (textNode: Text) => {
    text += textNode.value;
  });
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/**
 * 在指定位置之前尋找 SEO 注釋
 */
function findSeoComment(content: string, position: number): RegExpExecArray | null {
  const seoCommentRegex = /<!--SEO\n([\s\S]*?)-->/g;
  let match: RegExpExecArray | null;
  let lastMatch: RegExpExecArray | null = null;

  while ((match = seoCommentRegex.exec(content)) !== null) {
    if (match.index > position) {
      break;
    }
    lastMatch = match;
  }

  return lastMatch;
}

/**
 * 驗證圖片數據是否包含所有必要欄位
 */
function validateImageData(data: ImageData): boolean {
  const requiredFields = {
    originalName: true,
    localRelativePath: true,
    seoFileName: true,
    altText: true,
    pin: true,
    articleSlug: true
  };

  const missingFields = Object.entries(requiredFields).reduce((acc, [field, required]) => {
    acc[field] = required && field in data;
    return acc;
  }, {} as Record<string, boolean>);

  console.log('圖片 SEO 數據缺少必要欄位，檢查:', missingFields);
  return Object.values(missingFields).every(Boolean);
}

/**
 * 處理 Markdown 文件中的圖片
 * 提取所有圖片資訊，包含 SEO 數據和相關內容
 * 
 * @param filePath - Markdown 文件的路徑
 * @returns 處理結果，包含圖片數據和處理統計信息
 */
export async function processMarkdown(filePath: string): Promise<ProcessResult> {
  const content = await fs.readFile(filePath, 'utf-8');
  console.log('開始處理 Markdown 內容');

  // 提取 frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  let articleSlug = '';
  
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    // 從文件路徑中提取 articleSlug
    const pathParts = filePath.split('/');
    articleSlug = pathParts[pathParts.length - 1].replace('.md', '');
    console.log('從文件路徑提取的 articleSlug:', articleSlug);
  }

  const tree = unified()
    .use(remarkParse)
    .parse(content);

  console.log('開始遍歷 AST');
  
  let currentSectionId = '';
  const images: ImageData[] = [];

  visit(tree, (node: any) => {
    if (node.type === 'heading') {
      currentSectionId = extractSectionId(node);
    }

    if (node.type === 'image') {
      console.log('找到圖片節點');
      const position = node.position;
      
      if (!position) {
        console.log('圖片節點缺少位置信息');
        return;
      }

      const seoComment = findSeoComment(content, position.start.offset);
      
      if (seoComment) {
        console.log('找到 SEO 注釋:', seoComment[1].trim());
        console.log('原始 SEO 注釋內容:', seoComment);
        try {
          const seoData = JSON.parse(seoComment[1].trim());
          console.log('解析後的 SEO 數據:', seoData);
          
          // 添加 articleSlug
          const imageData: ImageData = {
            ...seoData,
            articleSlug,
            sectionId: currentSectionId
          };

          console.log('解析後的圖片數據:', imageData);
          
          // 驗證所有必要欄位
          const hasAllFields = validateImageData(imageData);
          if (hasAllFields) {
            images.push(imageData);
          }
        } catch (error) {
          console.error('解析 SEO 注釋時出錯:', error);
        }
      } else {
        console.log('未找到 SEO 注釋');
      }
    }
  });

  console.log('處理完成，找到圖片數量:', images.length);
  
  return {
    total: images.length,
    success: 0,
    failure: 0,
    images
  };
}
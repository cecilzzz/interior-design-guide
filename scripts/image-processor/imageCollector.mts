import { compile } from '@mdx-js/mdx';
import type { ImageData } from '../../app/types/image.ts';
import { visit as unistVisit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';

/**
 * 從 JSX 表達式中提取對象值
 */
const extractObjectFromExpression = (expression: string): Record<string, any> => {
  try {
    // 移除開頭的大括號和結尾的大括號，並執行 eval
    const cleanedExpression = expression.trim().replace(/^{|}$/g, '');
    // 使用 Function 構造函數代替 eval，更安全
    return new Function(`return ${cleanedExpression}`)();
  } catch (error) {
    console.error('解析 JSX 表達式失敗:', error);
    return {};
  }
};

/**
 * 處理 MDX 文件中的圖片組件
 * 提取所有圖片資訊，包含 SEO 數據和相關內容
 * 
 * @param content - MDX 文件內容
 * @returns 圖片資訊陣列，每個元素包含圖片的完整資訊
 */
export const getCollectedImages = async (content: string): Promise<ImageData[]> => {
  const collectedImages: ImageData[] = [];
  
  try {
    console.log('開始編譯 MDX...');
    const result = await compile(content, {
      // 開啟開發模式以獲取更多錯誤信息
      development: true,
      // 使用 remark 插件來收集 MDXImage 組件
      remarkPlugins: [
        () => (tree: Root) => {
          console.log('處理 MDX 語法樹...');
          unistVisit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElement) => {
            if (node.name === 'MDXImage') {
              console.log('找到 MDXImage 組件');
              const props: Record<string, any> = {};
              
              // 處理每個屬性
              for (const attr of node.attributes) {
                console.log('處理屬性:', attr);
                if (attr.type === 'mdxJsxAttribute' && attr.name) {
                  if (typeof attr.value === 'string') {
                    props[attr.name] = attr.value;
                  } else if (attr.value?.type === 'mdxJsxAttributeValueExpression') {
                    try {
                      // 安全地解析 JSX 表達式
                      const value = new Function(`return ${attr.value.value}`)();
                      props[attr.name] = value;
                    } catch (error) {
                      console.error('解析屬性失敗:', error);
                    }
                  }
                }
              }
              
              console.log('收集到的屬性:', props);
              
              // 驗證並收集圖片數據
              if (
                props.localPath?.originalFileName &&
                props.localPath?.articleSlug &&
                props.seo?.seoFileName &&
                props.seo?.altText &&
                props.pin?.title &&
                props.pin?.description
              ) {
                collectedImages.push(props as ImageData);
                console.log('已添加圖片數據到集合中');
              } else {
                console.warn('跳過無效的圖片數據:', props);
              }
            }
          });
          console.log('完成處理 MDX 語法樹');
        }
      ]
    });
    
    console.log('編譯結果:', result);
    
  } catch (error) {
    console.error('解析 MDX 時發生錯誤:', error);
    // 確保錯誤被正確處理
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('MDX 解析過程中發生未知錯誤');
    }
  }

  return collectedImages;
};
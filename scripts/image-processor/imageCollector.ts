import { compile } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import type { ImageData } from '../../app/types/image';
import { visit as unistVisit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { MdxJsxFlowElement, MdxJsxAttribute, MdxJsxExpressionAttribute } from 'mdast-util-mdx-jsx';

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
    // 編譯 MDX
    const compiled = await compile(content, {
      jsx: true,
      jsxRuntime: 'classic',
      // 定義自定義組件
      jsxImportSource: 'react',
      development: true,
      elementAttributeNameCase: 'react',
      // 提供自定義組件處理
      remarkPlugins: [
        () => (tree: Root) => {
          // 遍歷 MDX AST
          unistVisit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElement) => {
            if (node.name === 'MDXImage') {
              // 創建一個臨時對象來存儲屬性
              const tempProps: Record<string, unknown> = {};
              
              // 遍歷屬性並安全地提取值
              for (const attr of node.attributes) {
                if (attr.type === 'mdxJsxAttribute' && attr.name) {
                  tempProps[attr.name] = attr.value;
                }
              }
              
              // 驗證必要的屬性是否存在
              if ('localPath' in tempProps && 'seo' in tempProps && 'pin' in tempProps) {
                console.log('找到 MDXImage 組件:', tempProps);
                collectedImages.push(tempProps as ImageData);
              } else {
                console.warn('MDXImage 組件缺少必要的屬性:', tempProps);
              }
            }
          });
        }
      ]
    });

    console.log(`收集到 ${collectedImages.length} 個圖片`);
    
  } catch (error) {
    console.error('解析 MDX 時發生錯誤:', error);
  }

  return collectedImages;
};
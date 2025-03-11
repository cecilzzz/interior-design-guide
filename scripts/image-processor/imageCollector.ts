import type { ImageData } from '../../app/types/image';
import { compile } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { visit } from 'unist-util-visit';
import * as acorn from 'acorn';

// 定義 ImageData 的有效鍵類型
type ImageDataKey = keyof ImageData;

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
    console.log('開始解析 MDX 內容...');
    
    const result = await compile(content, {
      jsx: true,
      jsxRuntime: 'classic',
      jsxImportSource: 'react',
      development: true,
      // @ts-ignore
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [
        () => (tree) => {
          visit(tree, 'mdxJsxFlowElement', (node: any) => {
            if (node.name === 'MDXImage') {
              console.log('找到 MDXImage 組件:', node.attributes);
              const imageData: ImageData = {
                localPath: {
                  originalFileName: '',
                  articleSlug: ''
                },
                seo: {
                  seoFileName: '',
                  altText: ''
                },
                pin: {
                  title: '',
                  description: ''
                }
              };
              
              node.attributes.forEach((attr: any) => {
                if (attr.type === 'mdxJsxAttribute') {
                  const value = attr.value;
                  if (value.type === 'mdxJsxAttributeValueExpression') {
                    try {
                      // 使用 acorn 解析 JavaScript 表達式
                      const ast = acorn.parse(`(${value.value})`, {
                        ecmaVersion: 2020,
                        sourceType: 'module'
                      });
                      
                      // 從 AST 中提取物件字面量的值
                      const objectExpr = (ast as any).body[0].expression;
                      const extracted = extractObjectFromAST(objectExpr);
                      
                      const attrName = attr.name as ImageDataKey;
                      if (attrName === 'localPath' || attrName === 'seo' || attrName === 'pin') {
                        imageData[attrName] = extracted;
                      }
                    } catch (e) {
                      console.warn(`無法解析屬性 ${attr.name}:`, e);
                      console.warn('原始值:', value.value);
                    }
                  }
                }
              });
              
              collectedImages.push(imageData);
            }
          });
        }
      ]
    });
    
    console.log(`找到 ${collectedImages.length} 個 MDXImage 組件`);
    
  } catch (error) {
    console.error('解析 MDX 時發生錯誤:', error);
  }

  return collectedImages;
};

// 從 AST 中提取物件字面量的值
function extractObjectFromAST(node: any): any {
  if (node.type === 'ObjectExpression') {
    const result: any = {};
    for (const prop of node.properties) {
      const key = prop.key.name;
      const value = extractObjectFromAST(prop.value);
      result[key] = value;
    }
    return result;
  } else if (node.type === 'Literal') {
    return node.value;
  }
  return null;
}
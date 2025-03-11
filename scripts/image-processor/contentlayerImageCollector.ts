import type { ImageData } from '../../app/types/image';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { compile } from '@mdx-js/mdx';
import { visit } from 'unist-util-visit';

/**
 * 從 Contentlayer 生成的特定文章 JSON 文件中提取圖片資訊
 * @param slug - 文章的 slug
 * @returns 圖片資訊陣列，每個元素包含圖片的完整資訊
 */
export const getCollectedImagesFromContentlayer = async (slug: string): Promise<ImageData[]> => {
  const collectedImages: ImageData[] = [];
  const contentlayerDir = join(process.cwd(), '.contentlayer/generated/Article');
  const jsonFilePath = join(contentlayerDir, `${slug}.json`);

  try {
    // 讀取特定文章的 JSON 文件
    const content = await readFile(jsonFilePath, 'utf-8');
    const article = JSON.parse(content);

    // 使用 MDX 編譯器的 remarkPlugins 來收集圖片
    await compile(article.body.raw, {
      remarkPlugins: [
        () => (tree) => {
          visit(tree, 'mdxJsxFlowElement', (node: any) => {
            if (node.name === 'MDXImage') {
              // 將屬性轉換為物件
              const props = node.attributes.reduce((acc: any, attr: any) => {
                if (attr.type === 'mdxJsxAttribute') {
                  try {
                    // 嘗試解析 JSON 字符串
                    const value = attr.value?.value 
                      ? JSON.parse(attr.value.value.replace(/'/g, '"'))
                      : undefined;
                    acc[attr.name] = value;
                  } catch (e) {
                    console.warn(`無法解析屬性 ${attr.name}:`, e);
                  }
                }
                return acc;
              }, {});

              // 驗證必要的屬性
              if (props.localPath && props.seo && props.pin) {
                collectedImages.push({
                  localPath: props.localPath,
                  seo: props.seo,
                  pin: props.pin
                });
              }
            }
          });
        }
      ]
    });

    console.log(`從文章 "${slug}" 中找到 ${collectedImages.length} 個有效的 MDXImage 組件`);

  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error(`找不到文章 "${slug}" 的 JSON 文件`);
    }
    throw new Error(`處理文章 "${slug}" 時發生錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`);
  }

  return collectedImages;
}; 
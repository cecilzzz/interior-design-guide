import type { ImageData } from '../../app/types/image';
import { compileMDX } from 'next-mdx-remote/rsc';

/**
 * 處理 MDX 文件中的圖片組件
 * 提取所有圖片資訊，包含 SEO 數據和相關內容
 * 
 * @param content - MDX 文件內容
 * @returns 圖片資訊陣列，每個元素包含圖片的完整資訊
 */
export const getCollectedImages = async (content: string): Promise<ImageData[]> => {
  const collectedImages: ImageData[] = [];
  
  // 使用 next-mdx-remote 編譯 MDX
  await compileMDX({
    source: content,
    components: {
      MDXImage: (props: any) => {  // 暫時改為 any 類型來查看實際收到的內容
        console.log('MDXImage 組件被調用');
        console.log('收到的 props:', JSON.stringify(props, null, 2));
        collectedImages.push(props);  // 直接推入 props
        return null;
      }
    },
    options: {
      parseFrontmatter: true,
    }
  });

  // 直接返回收集到的圖片資訊
  return collectedImages;
};
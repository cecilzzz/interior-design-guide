import type { MDXComponents } from 'mdx/types';
import { HTMLAttributes } from 'react';
import { MDXImage } from './app/components/MDXImage';
import type { ImageData } from './app/types/image';

// 這個函數是 Next.js 的 MDX 整合所需的
// 它會自動被用來處理所有 MDX 內容

// `useMDXComponents` 函數的主要作用是定義如何將 MDX 文件中的標籤轉換為實際的 React 組件。
// 這樣可以讓開發者在撰寫 MDX 內容時，使用自定義的樣式和行為。

// 具體來說：
// - 將 `h1`、`h2` 和 `h3` 標籤轉換為具有特定樣式的 React 組件，使用 Tailwind CSS 類名來設置字體、大小和邊距。
// - 將 `p` 標籤轉換為一個 `span` 元素，並且可以接受 `children` 和其他屬性，確保段落內容正確顯示。
// - 整合自定義的 `MDXImage` 組件，這樣在 MDX 文件中使用 `<MDXImage />` 時，會使用自定義的圖片組件來處理圖片的顯示和行為。


export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 使用傳入的自定義組件
    ...components,

    // 標題樣式
    h1: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl mb-4" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="font-playfair text-xl sm:text-2xl md:text-3xl mb-3" {...props}>
        {children}
      </h3>
    ),

    // 段落樣式
    p: ({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
      <span className="font-montserrat block mb-4" {...props}>
        {children}
      </span>
    ),

    MDXImage: (props: ImageData) => (
      <MDXImage {...props} />
    ),
  };
}
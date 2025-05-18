import type { MDXComponents } from 'mdx/types';
import { HTMLAttributes } from 'react';
import { MDXImage } from './app/components/MDXImage';
import type { ImageData } from './app/types/image';

/**
 * MDX 渲染控制中心
 * 
 * 統一管理所有 MDX 內容的渲染邏輯和樣式：
 * 1. 基礎元素（標題、段落等）的樣式
 * 2. 自定義組件（圖片等）的整合
 * 3. 響應式設計的實現
 * 
 * 設計原則：
 * - 所有 MDX 相關的樣式都在這裡定義
 * - 使用 Tailwind 的 @apply 來組織複雜樣式
 * - 確保樣式的一致性和可維護性
 */

// 基礎文章樣式
const articleBaseStyles = "prose prose-lg max-w-none prose-headings:font-playfair prose-p:text-gray-600 prose-a:text-coral-500";

// `useMDXComponents` 函數的主要作用是定義如何將 MDX 文件中的標籤轉換為實際的 React 組件。
// 這樣可以讓開發者在撰寫 MDX 內容時，使用自定義的樣式和行為。

// 具體來說：
// - 將 `h1`、`h2` 和 `h3` 標籤轉換為具有特定樣式的 React 組件，使用 Tailwind CSS 類名來設置字體、大小和邊距。
// - 將 `p` 標籤轉換為一個 `span` 元素，並且可以接受 `children` 和其他屬性，確保段落內容正確顯示。
// - 整合自定義的 `MDXImage` 組件，這樣在 MDX 文件中使用 `<MDXImage />` 時，會使用自定義的圖片組件來處理圖片的顯示和行為。

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 繼承傳入的組件設定
    ...components,

    // 容器元素 - 應用基礎樣式
    wrapper: ({ children, ...props }) => (
      <div className={articleBaseStyles} {...props}>
        {children}
      </div>
    ),

    // 自定義組件
    MDXImage: (props: ImageData) => (
      <div className="my-8">
        <MDXImage {...props} />
      </div>
    ),
  };
}
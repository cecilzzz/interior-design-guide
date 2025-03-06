'use client';

import { MDXImage } from './MDXImage';
import type { HTMLAttributes } from 'react';

export const mdxComponents = {
  // 標題區域保持原有的樣式
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6" {...props} />
  ),

  // 段落樣式：與原來的 ReactMarkdown 配置一致
  p: ({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <span className="block mb-4" {...props}>{children}</span>
  ),

  // 自定義圖片組件
  MDXImage,
}; 
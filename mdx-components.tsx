import type { MDXComponents } from 'mdx/types';
import type { ImageProps } from 'next/image';
import { HTMLAttributes, AnchorHTMLAttributes } from 'react';
import { useMDXComponent } from 'next-contentlayer/hooks'
import Image from 'next/image'
import Link from 'next/link'

// 這個函數是 Next.js 的 MDX 整合所需的
// 它會自動被用來處理所有 MDX 內容
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 使用傳入的自定義組件
    ...components,

    // 標題樣式
    h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6" {...props} />
    ),
    h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl mb-4" {...props} />
    ),
    h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="font-playfair text-xl sm:text-2xl md:text-3xl mb-3" {...props} />
    ),

    // 段落樣式
    p: ({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
      <span className="block mb-4" {...props}>{children}</span>
    ),

    // 列表樣式
    ul: (props: HTMLAttributes<HTMLUListElement>) => (
      <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
    ),
    ol: (props: HTMLAttributes<HTMLOListElement>) => (
      <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
    ),

    // 引用樣式
    blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote className="border-l-4 border-coral-400 pl-4 italic my-4" {...props} />
    ),

    Image: ({ className, ...props }: ImageProps) => (
      <Image
        {...props}
        width={800}
        height={400}
        className={`rounded-lg ${className || ''}`}
      />
    ),
    a: ({ className, href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <Link 
        href={href || '#'} 
        className={`text-coral-500 hover:text-coral-600 transition-colors ${className || ''}`} 
        {...props}
      />
    ),
  };
}

export function MDXContent({ code }: { code: string }) {
  const MDXComponent = useMDXComponent(code)
  
  return (
    <div className="mdx-content">
      <MDXComponent components={useMDXComponents({})} />
    </div>
  )
} 
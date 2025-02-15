import Image from "next/image";
import ReactMarkdown from 'react-markdown';  // 需要安裝: npm install react-markdown
import { getImageUrl } from '@/app/lib/imageUtils';
import React from 'react';

type BlogPostProps = {
  category: string;
  title: string;
  date: string;
  image: string;
  content: string;
};

export default function BlogPost({ 
  category, 
  title, 
  date, 
  image, 
  content,
}: BlogPostProps) {
  return (
    <article>
      <div className="text-center mb-12">
        <div className="text-coral-400 uppercase tracking-[0.2em] text-xs sm:text-sm mb-4 sm:mb-6 font-light">
          {category} / <span className="text-gray-500">DESIGN</span>
        </div>
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">{title}</h1>
        <div className="text-gray-400 text-xs sm:text-sm tracking-wider">{date}</div>
      </div>
      
      <div className="mb-8 relative aspect-[16/9] overflow-hidden rounded-lg group">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
          sizes="(min-width: 1024px) 65vw, (min-width: 768px) 75vw, 100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="prose max-w-none">
        <ReactMarkdown
          components={{
            // 覆蓋 p 標籤的渲染，確保圖片容器不被包在 p 標籤內
            p: ({ children, ...props }) => {
              // 檢查是否只包含 img 元素
              const hasOnlyImage = React.Children.toArray(children).every(
                child => React.isValidElement(child) && child.type === 'img'
              );
              
              // 如果是圖片，返回 Fragment，否則返回正常的 p 標籤
              return hasOnlyImage ? <>{children}</> : <p {...props}>{children}</p>;
            },
            img: ({ src, alt }) => {
              if (!src) return null;
              // 使用 content 類型的圖片優化參數
              const optimizedSrc = getImageUrl(src, 'content');
              return (
                <div className="relative aspect-[16/9] my-8">
                  <Image
                    src={optimizedSrc}
                    alt={alt || ''}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(min-width: 1024px) 65vw, (min-width: 768px) 75vw, 100vw"
                  />
                </div>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
      
      <div className="flex justify-center space-x-4 mt-8">
        <a href="#" className="text-gray-500 hover:text-gray-700">
          <span className="sr-only">Facebook</span>
          {/* Facebook icon */}
        </a>
        {/* 其他社交媒體圖標 */}
      </div>
    </article>
  );
} 
import type { ReactNode } from 'react';
import type { MDXComponentProps, MDXFrontmatter } from './mdx';

// 全局 Window 介面擴展
interface Window {
  gtag: (
    command: 'event' | 'config' | 'set' | 'js',
    eventName: string,
    eventParams?: {
      [key: string]: any;
    }
  ) => void;
  dataLayer: any[];
}

// MDX 模組聲明
declare module '*.mdx' {
  export const frontmatter: MDXFrontmatter;
  const MDXContent: (props: MDXComponentProps) => ReactNode;
  export default MDXContent;
} 
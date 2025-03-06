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
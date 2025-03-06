import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dwobltbzw/**',
      },
    ],
    // 靜態導出需要 unoptimized: true
    // 如果將來不需要靜態導出，可以：
    // 1. 移除 output: 'export'
    // 2. 移除 unoptimized: true
    // 3. 使用 Cloudinary 的完整圖片優化功能
    unoptimized: true
  },
  // 確保靜態生成時正確處理動態路由
  trailingSlash: true,
};

// 配置 MDX
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],  // 支持 GitHub Flavored Markdown
    rehypePlugins: [],
    // 這個很重要，用於支持 MDX 中的 React 組件
    providerImportSource: "@mdx-js/react",
  },
});

// 合併配置
export default withMDX(nextConfig);
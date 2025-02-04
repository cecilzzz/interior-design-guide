/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // 將來遷移到 Cloudinary 時，添加：
      // {
      //   protocol: 'https',
      //   hostname: 'res.cloudinary.com',
      //   pathname: '/your-cloud-name/**',  // 替換 your-cloud-name
      // },
    ],
    // 靜態導出需要 unoptimized: true
    // 如果將來不需要靜態導出，可以：
    // 1. 移除 output: 'export'
    // 2. 移除 unoptimized: true
    // 3. 使用 Cloudinary 的完整圖片優化功能
    unoptimized: true
  },
};

module.exports = nextConfig;
const createMDX = require('@next/mdx')
const { withContentlayer } = require('next-contentlayer')
const TerserPlugin = require('terser-webpack-plugin')

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
    unoptimized: true
  },
  trailingSlash: true,
  
  // 編譯器設定 - 移除所有調試信息
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? {
      properties: ['^data-testid$', '^data-test$', '^data-cy$']
    } : false,
  },
  
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      'react-icons'
    ],
  },
  
  // Webpack 配置 - 徹底混淆和優化
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 只在生產環境中應用優化
    if (!dev && !isServer) {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.warn'],
              unused: true,
              dead_code: true,
            },
            mangle: {
              safari10: true,
            },
            format: {
              comments: false,
            }
          },
          extractComments: false,
        })
      ];
    }
    
    return config;
  },
  
  // 禁用 source map
  productionBrowserSourceMaps: false,
  
  // 優化字體加載
  optimizeFonts: true,
  
  // 壓縮設定
  compress: true,
  
  // 禁用 X-Powered-By header
  poweredByHeader: false,
  
  // 嚴格模式
  reactStrictMode: true,
};

// 配置 MDX - 移除註釋
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    development: false,
  },
});

module.exports = withContentlayer(withMDX(nextConfig));
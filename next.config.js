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
    // Disable webpack filesystem cache
    config.cache = false;
    
    // Enable production mode optimizations
    config.mode = 'production';
    
    // Use TerserPlugin for JS compression and obfuscation 
    if (!dev && !isServer) {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            ecma: 2020,
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.warn'],
              pure_getters: true,
              unsafe: true,
              unsafe_comps: true,
              unsafe_Function: true,
              unsafe_math: true,
              unsafe_symbols: true,
              unsafe_methods: true,
              unsafe_proto: true,
              unsafe_regexp: true,
              unsafe_undefined: true,
              unused: true,
              dead_code: true,
              collapse_vars: true,
              reduce_vars: true,
              reduce_funcs: true,
              keep_infinity: false,
              side_effects: false,
              passes: 3
            },
            mangle: {
              safari10: true,
              toplevel: true,
              eval: true,
              properties: {
                regex: /^_/
              }
            },
            format: {
              comments: false,
              ecma: 2020,
              safari10: true,
              webkit: true
            }
          },
          extractComments: false,
          parallel: true
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
  
  // 禁用遙測
  telemetry: {
    enabled: false
  },
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
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://akio-hasegawa.design',
  generateRobotsTxt: true,
  outDir: './public',
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/css/', // 允許 CSS 檔案以確保正確渲染
        ],
        disallow: [
          '/_next/static/chunks/', // 封鎖 JavaScript chunks
          '/_next/static/media/', // 封鎖媒體檔案（如果不需要的話）
        ],
      }
    ],
    additionalSitemaps: [
      'https://akio-hasegawa.design/sitemap.xml',
      'https://akio-hasegawa.design/image-sitemap.xml'
    ],
  },
  exclude: ['/_next/*'],
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    let priority = config.priority;
    let changefreq = config.changefreq;

    // 首頁最高優先級
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    // 文章頁面 - 直接在根路徑下
    else if (!path.startsWith('/category/') && 
             path !== '/' && 
             !path.startsWith('/api/') && 
             !path.startsWith('/static/') &&
             !path.startsWith('/_next/')) {
      priority = 0.8;
      changefreq = 'monthly';
    }
    // 分類頁面
    else if (path.startsWith('/category/')) {
      priority = 0.5;
      changefreq = 'weekly';
    }
    // 其他頁面
    else {
      priority = 0.4;
      changefreq = 'monthly';
    }
    
    return {
      loc: path,
      changefreq: changefreq,
      priority: priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    };
  },
} 
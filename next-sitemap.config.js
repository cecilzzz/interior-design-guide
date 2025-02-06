/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://interior-design-guide.vercel.app',
  generateRobotsTxt: true,  // 改為 true
  robotsTxtOptions: {
    policies: [
      // 全局規則
      {
        userAgent: '*',
        allow: ['/', '/blog/', '/blog/category/', '/privacy/'],
        disallow: ['/_next/', '/api/', '/static/'],
      },
      // 媒體文件規則
      {
        userAgent: '*',
        allow: ['/*.jpg$', '/*.jpeg$', '/*.gif$', '/*.png$', '/*.svg$', '/*.pdf$'],
      }
    ],
  },
  exclude: ['/api/*', '/static/*'],
  generateIndexSitemap: false, // 因為我們的網站不會特別大
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // 自定義優先級
    let priority = config.priority;
    
    // 首頁最高優先級
    if (path === '/') {
      priority = 1.0;
    }
    // 博客分類頁次高優先級
    else if (path.startsWith('/blog/category/')) {
      priority = 0.8;
    }
    // 博客文章頁標準優先級
    else if (path.startsWith('/blog/')) {
      priority = 0.7;
    }
    
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    };
  },
} 
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://akio-hasegawa.design',
  generateRobotsTxt: true,
  outDir: './public',
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/_next/',
          '/api/',
          '/static/'
        ],
      }
    ],
    additionalSitemaps: [
      'https://akio-hasegawa.design/sitemap.xml'
    ],
  },
  exclude: ['/api/*', '/static/*', '/_next/*'],
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
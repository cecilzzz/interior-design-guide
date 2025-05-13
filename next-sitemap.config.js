/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://interior-design-guide.vercel.app',
  generateRobotsTxt: true,
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
      'https://interior-design-guide.vercel.app/sitemap.xml'
    ],
  },
  exclude: ['/api/*', '/static/*', '/_next/*'],
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    let priority = config.priority;
    
    if (path === '/') {
      priority = 1.0;
    }
    else if (path.startsWith('/blog/category/')) {
      priority = 0.8;
    }
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
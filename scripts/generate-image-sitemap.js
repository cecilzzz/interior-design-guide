import fs from 'fs';
import path from 'path';

// 動態導入 ES 模組，使用正確的 .mts 路徑
async function importImageCollector() {
  const { getCollectedImages } = await import('./image-processor/imageCollector.mts');
  return { getCollectedImages };
}

// 動態導入 imageUtils
async function importImageUtils() {
  const { getImageUrl } = await import('../app/utils/imageUtils.ts');
  return { getImageUrl };
}

async function loadArticles() {
  // 直接讀取 JSON 檔案避免 assert 語法問題
  const articlesPath = path.join(process.cwd(), '.contentlayer/generated/Article/_index.json');
  const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
  return articlesData;
}

async function generateImageSitemap() {
  const siteUrl = 'https://akio-hasegawa.design';
  
  // 收集所有圖片信息
  const images = [];
  
  try {
    const { getCollectedImages } = await importImageCollector();
    const { getImageUrl } = await importImageUtils();
    const allArticles = await loadArticles();
    
    for (const article of allArticles) {
      console.log(`處理文章: ${article.title}`);
      
      // 添加封面圖片
      if (article.coverImage) {
        const imageUrl = getImageUrl(article.coverImage, 'hero');
        
        images.push({
          url: imageUrl,
          location: `${siteUrl}/${article.slug}`
        });
      }
      
      // 使用專業的 MDX 解析器收集文章內的圖片
      try {
        const collectedImages = await getCollectedImages(article.body.raw);
        
        for (const imageData of collectedImages) {
          // 使用 imageUtils 構建 Cloudinary URL，直接使用 seoFileName
          const imageUrl = getImageUrl(imageData.seo.seoFileName, 'content');
          
          images.push({
            url: imageUrl,
            location: `${siteUrl}/${article.slug}`
          });
        }
        
        console.log(`從文章 ${article.title} 收集到 ${collectedImages.length} 張圖片`);
        
      } catch (error) {
        console.error(`處理文章 ${article.title} 時發生錯誤:`, error);
        // 繼續處理其他文章，不中斷整個流程
      }
    }
    
    console.log(`總共收集到 ${images.length} 張圖片`);
    
    // 生成 XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(image => `  <url>
    <loc>${escapeXml(image.location)}</loc>
    <image:image>
      <image:loc>${escapeXml(image.url)}</image:loc>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

    // 寫入文件
    const outputPath = path.join(process.cwd(), 'public', 'image-sitemap.xml');
    fs.writeFileSync(outputPath, xml);
    console.log(`圖片 sitemap 已成功生成: ${outputPath}`);
    console.log(`包含 ${images.length} 張圖片`);
    
  } catch (error) {
    console.error('生成圖片 sitemap 時發生錯誤:', error);
    process.exit(1);
  }
}

function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') {
    return String(unsafe);
  }
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// 執行生成
generateImageSitemap().catch(console.error); 
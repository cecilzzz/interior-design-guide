import fs from 'fs';
import path from 'path';

// 簡化的圖片 URL 生成函數（不依賴外部模組）
function getImageUrl(imagePath, variant = 'content') {
  const baseUrl = 'https://res.cloudinary.com/dwobltbzw/image/upload';
  
  // 移除開頭的 /posts/content/ 如果存在
  const cleanPath = imagePath.replace(/^\/posts\/content\//, '');
  
  // 根據變體設定不同的轉換參數
  const transformations = {
    hero: 'w_1200,c_fit,q_auto,f_auto',
    content: 'w_800,c_fit,q_auto,f_auto',
    thumbnail: 'w_400,c_fit,q_auto,f_auto'
  };
  
  const transform = transformations[variant] || transformations.content;
  
  // 不添加副檔名，讓 Cloudinary 的 f_auto 參數自動選擇最佳格式（WebP、AVIF 等）
  return `${baseUrl}/${transform}/${cleanPath}`;
}

// 簡化的 MDX 圖片提取函數
function extractImagesFromMDX(mdxContent) {
  const images = [];
  
  // 使用正則表達式匹配 MDXImage 組件
  const mdxImageRegex = /<MDXImage[^>]*>/g;
  const matches = mdxContent.match(mdxImageRegex) || [];
  
  for (const match of matches) {
    try {
      // 提取 seo 屬性中的 seoFileName
      const seoMatch = match.match(/seo=\{[^}]*seoFileName:\s*"([^"]+)"/);
      if (seoMatch && seoMatch[1]) {
        images.push({
          seoFileName: seoMatch[1]
        });
      }
    } catch (error) {
      console.warn('解析圖片時發生錯誤:', error);
    }
  }
  
  return images;
}

async function loadArticles() {
  try {
    // 直接讀取 JSON 檔案
    const articlesPath = path.join(process.cwd(), '.contentlayer/generated/Article/_index.json');
    const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
    return articlesData;
  } catch (error) {
    console.error('無法載入文章資料:', error);
    return [];
  }
}

async function generateImageSitemap() {
  const siteUrl = 'https://akio-hasegawa.design';
  const images = [];
  
  try {
    const allArticles = await loadArticles();
    console.log(`找到 ${allArticles.length} 篇文章`);
    
    for (const article of allArticles) {
      console.log(`處理文章: ${article.title}`);
      
      // 添加封面圖片
      if (article.coverImage) {
        const imageUrl = getImageUrl(article.coverImage, 'hero');
        images.push({
          url: imageUrl,
          location: `${siteUrl}/${article.slug}/`
        });
      }
      
      // 提取文章內的圖片
      try {
        const extractedImages = extractImagesFromMDX(article.body.raw);
        
        for (const imageData of extractedImages) {
          const imageUrl = getImageUrl(`/posts/content/${imageData.seoFileName}`, 'content');
          images.push({
            url: imageUrl,
            location: `${siteUrl}/${article.slug}`
          });
        }
        
        console.log(`從文章 ${article.title} 收集到 ${extractedImages.length} 張圖片`);
        
      } catch (error) {
        console.error(`處理文章 ${article.title} 時發生錯誤:`, error);
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
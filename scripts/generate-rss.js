import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置常數
const CONFIG = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://akio-hasegawa.design',
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || 'Akio Hasegawa',
  SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Your comprehensive guide to interior design',
  SITE_AUTHOR: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Akio Hasegawa',
  CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_BASE_PATH: process.env.CLOUDINARY_BASE_PATH || 'interior-inspiration-website/posts',
  OUTPUT_FILE: 'public/rss.xml'
};

/**
 * 生成 Cloudinary 圖片 URL
 * @param {string} seoFilename - SEO 檔案名稱（不含副檔名）- 這就是 Cloudinary PublicID
 * @param {string} transformations - Cloudinary 轉換參數
 * @returns {string} 完整的 Cloudinary URL
 */
function generateCloudinaryUrl(seoFilename, transformations = 'f_auto,q_auto,c_auto,g_auto,w_auto,dpr_auto') {
  if (!CONFIG.CLOUDINARY_CLOUD_NAME) {
    throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable is required');
  }
  
  // seoFilename 直接就是 Cloudinary PublicID，不需要額外的路徑
  return `https://res.cloudinary.com/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${seoFilename}`;
}

/**
 * 解析 MDX 內容中的 MDXImage 組件
 * @param {string} mdxContent - MDX 原始內容
 * @returns {Array} 圖片資訊陣列
 */
function parseMDXImages(mdxContent) {
  const images = [];
  
  // 正則表達式匹配 MDXImage 組件
  const mdxImageRegex = /<MDXImage\s+([^>]*?)\/>/gs;
  let match;
  
  while ((match = mdxImageRegex.exec(mdxContent)) !== null) {
    const propsString = match[1];
    
    try {
      // 提取 seo.seoFileName
      const seoFileNameMatch = propsString.match(/seoFileName:\s*["']([^"']+)["']/);
      const seoFileName = seoFileNameMatch ? seoFileNameMatch[1] : null;
      
      // 提取 seo.altText
      const altTextMatch = propsString.match(/altText:\s*["']([^"']+)["']/);
      const altText = altTextMatch ? altTextMatch[1] : '';
      
      // 提取 pin.title
      const pinTitleMatch = propsString.match(/title:\s*["']([^"']+)["']/);
      const pinTitle = pinTitleMatch ? pinTitleMatch[1] : '';
      
      // 提取 pin.description
      const pinDescriptionMatch = propsString.match(/description:\s*["']([^"']+)["']/);
      const pinDescription = pinDescriptionMatch ? pinDescriptionMatch[1] : '';
      
      if (seoFileName && pinTitle && pinDescription) {
        images.push({
          seoFileName,
          altText,
          pinTitle,
          pinDescription
        });
      }
    } catch (error) {
      console.warn('解析 MDXImage 時發生錯誤:', error.message);
    }
  }
  
  return images;
}

/**
 * 讀取並解析 Contentlayer 生成的文章資料
 * @returns {Promise<Array>} 文章資料陣列
 */
async function getArticlesData() {
  try {
    // 直接讀取 Contentlayer 生成的 JSON 檔案
    const articlesDir = '.contentlayer/generated/Article';
    
    if (!fs.existsSync(articlesDir)) {
      console.warn('Contentlayer 資料目錄不存在');
      return [];
    }

    // 使用 fs 讀取所有 JSON 檔案，排除 _index.json
    const jsonFiles = fs.readdirSync(articlesDir)
      .filter(file => file.endsWith('.json') && !file.startsWith('_'))
      .map(file => path.join(articlesDir, file));

    const articles = [];
    for (const jsonFile of jsonFiles) {
      try {
        const content = fs.readFileSync(jsonFile, 'utf8');
        const article = JSON.parse(content);
        
        // 驗證文章是否包含必要的欄位
        if (article.title && article.slug && article.excerpt && article.date) {
          articles.push(article);
        } else {
          console.warn(`跳過無效文章檔案 ${jsonFile}: 缺少必要欄位`);
        }
      } catch (error) {
        console.warn(`無法解析文章檔案 ${jsonFile}:`, error.message);
      }
    }

    return articles;
  } catch (error) {
    console.warn('無法載入 Contentlayer 資料，將返回空陣列:', error.message);
    return [];
  }
}

/**
 * 格式化日期為 RFC 822 格式（RSS 規範）
 * @param {string|Date} date - 日期
 * @returns {string} RFC 822 格式的日期字符串
 */
function formatRSSDate(date) {
  const d = new Date(date);
  return d.toUTCString();
}

/**
 * 轉義 XML 特殊字符
 * @param {string} text - 需要轉義的文字
 * @returns {string} 轉義後的文字
 */
function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 生成單張圖片的 RSS item
 * @param {Object} imageData - 圖片資料物件
 * @param {Object} article - 文章物件
 * @returns {string} RSS item XML
 */
function generateImageRSSItem(imageData, article) {
  const articleUrl = `${CONFIG.SITE_URL}/articles/${article.slug}`;
  const imageUrl = generateCloudinaryUrl(imageData.seoFileName);
  const pubDate = formatRSSDate(article.date);
  
  // 確保 categories 存在且為陣列
  const categories = Array.isArray(article.categories) ? article.categories : [];
  
  // 為 Pinterest 優化的描述，包含分類標籤
  const categoryTags = categories.length > 0 ? categories.map(cat => `#${cat}`).join(' ') : '';
  const description = categoryTags ? `${imageData.pinDescription} ${categoryTags} #室內設計 #居家裝潢` : `${imageData.pinDescription} #室內設計 #居家裝潢`;
  
  return `    <item>
      <title>${escapeXml(imageData.pinTitle)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="false">${imageUrl}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      <image>
        <url>${imageUrl}</url>
        <title>${escapeXml(imageData.pinTitle)}</title>
        <link>${articleUrl}</link>
      </image>
      <enclosure url="${imageUrl}" type="image/jpeg" />
      <media:content url="${imageUrl}" type="image/jpeg" medium="image">
        <media:title>${escapeXml(imageData.pinTitle)}</media:title>
        <media:description>${escapeXml(description)}</media:description>
      </media:content>
    </item>`;
}

/**
 * 生成完整的 RSS XML
 * @param {Array} articles - 文章陣列
 * @returns {string} 完整的 RSS XML
 */
function generateRSSXml(articles) {
  const lastBuildDate = formatRSSDate(new Date());
  
  // 收集所有圖片資料
  const allImages = [];
  
  articles.forEach(article => {
    if (article.body && article.body.raw) {
      const images = parseMDXImages(article.body.raw);
      images.forEach(image => {
        allImages.push({
          imageData: image,
          article: article
        });
      });
    }
  });
  
  // 按文章日期排序並限制數量
  const sortedImages = allImages
    .sort((a, b) => new Date(b.article.date) - new Date(a.article.date))
    .slice(0, 100); // 限制最新 100 張圖片
  
  const items = sortedImages.map(({ imageData, article }) => 
    generateImageRSSItem(imageData, article)
  ).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:media="http://search.yahoo.com/mrss/" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(CONFIG.SITE_NAME)}</title>
    <link>${CONFIG.SITE_URL}</link>
    <description>${escapeXml(CONFIG.SITE_DESCRIPTION)}</description>
    <language>zh-TW</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <managingEditor>${escapeXml(CONFIG.SITE_AUTHOR)}</managingEditor>
    <webMaster>${escapeXml(CONFIG.SITE_AUTHOR)}</webMaster>
    <generator>Custom RSS Generator for Pinterest</generator>
    <docs>https://cyber.harvard.edu/rss/rss.html</docs>
    <ttl>1440</ttl>
    <image>
      <url>${CONFIG.SITE_URL}/favicon.ico</url>
      <title>${escapeXml(CONFIG.SITE_NAME)}</title>
      <link>${CONFIG.SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;
}

/**
 * 主執行函數
 */
async function main() {
  try {
    console.log('🚀 開始生成 Pinterest RSS 檔案...');
    
    // 檢查必要的環境變數
    if (!CONFIG.CLOUDINARY_CLOUD_NAME) {
      throw new Error('請設定 NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 環境變數');
    }
    
    // 載入文章資料
    console.log('📚 載入文章資料...');
    const articles = await getArticlesData();
    
    if (articles.length === 0) {
      console.warn('⚠️  未找到任何文章，將生成空的 RSS 檔案');
    } else {
      console.log(`📄 找到 ${articles.length} 篇文章`);
      
      // 統計總圖片數量
      let totalImages = 0;
      articles.forEach(article => {
        if (article.body && article.body.raw) {
          const images = parseMDXImages(article.body.raw);
          totalImages += images.length;
        }
      });
      console.log(`🖼️  解析到 ${totalImages} 張圖片`);
    }
    
    // 生成 RSS XML
    console.log('🔧 生成 RSS XML...');
    const rssXml = generateRSSXml(articles);
    
    // 確保輸出目錄存在
    const outputDir = path.dirname(CONFIG.OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 寫入檔案
    fs.writeFileSync(CONFIG.OUTPUT_FILE, rssXml, 'utf8');
    
    console.log(`✅ RSS 檔案已生成: ${CONFIG.OUTPUT_FILE}`);
    console.log(`🔗 RSS URL: ${CONFIG.SITE_URL}/rss.xml`);
    console.log('\n📌 Pinterest 設定指南:');
    console.log(`1. 登入 Pinterest 企業帳戶`);
    console.log(`2. 前往設定 > 批量創建 Pin 圖 > 自動發布`);
    console.log(`3. 連接 RSS 頁面: ${CONFIG.SITE_URL}/rss.xml`);
    console.log(`4. 選擇要發布的圖板`);
    console.log(`5. 點擊儲存`);
    
  } catch (error) {
    console.error('❌ 生成 RSS 時發生錯誤:', error.message);
    process.exit(1);
  }
}

// 執行腳本
main(); 
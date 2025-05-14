import { Article } from 'contentlayer/generated';

// 定義組件的參數類型
type SchemaOrgProps = {
  article?: Article;  // 使用 ? 表示這是可選參數，可以是 Article 類型或是 undefined
};

export function SchemaOrg({ article }: SchemaOrgProps) {
  // 基本網站信息 - 這個 schema 總是會被創建
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": process.env.NEXT_PUBLIC_SITE_NAME,
    "url": process.env.NEXT_PUBLIC_SITE_URL,
    "description": process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    "author": process.env.NEXT_PUBLIC_SITE_AUTHOR
  };

  // 文章 schema 的創建邏輯：
  // article ? { ... } : null 是三元運算符
  // 如果 article 存在（不是 undefined），就創建文章的 schema 物件
  // 如果 article 不存在（是 undefined），就返回 null
  const articleSchema = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": [article.coverImageUrl],
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Person",
      "name": process.env.NEXT_PUBLIC_SITE_AUTHOR
    },
    "publisher": {
      "@type": "Organization",
      "name": process.env.NEXT_PUBLIC_SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
      }
    },
    "keywords": article.categories.join(','),
    "articleSection": article.categories[0]
  } : null;

  // 麵包屑導航 schema
  // 基本結構總是包含首頁
  // 如果是文章頁面（article 存在），則添加分類和文章標題到導航中
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": process.env.NEXT_PUBLIC_SITE_URL
      },
      // ...(article ? [...] : []) 是展開運算符
      // 如果 article 存在，就添加分類和文章的麵包屑
      // 如果 article 不存在，就添加空陣列（即不添加額外的麵包屑）
      ...(article ? [
        {
          "@type": "ListItem",
          "position": 2,
          "name": article.categories[0],
          "item": `${process.env.NEXT_PUBLIC_SITE_URL}/category/${article.categories[0]}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`
        }
      ] : [])
    ]
  };

  return (
    <>
      {/* 網站的基本 schema - 總是會被渲染 */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(websiteSchema) 
        }} 
      />

      {/* 文章 schema 的條件渲染：
          article && (...) 是邏輯運算符
          只有當 article 存在（不是 undefined）時，才會渲染這個 script 標籤
          如果 article 不存在，這部分會被跳過，什麼都不渲染 */}
      {article && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(articleSchema) 
          }} 
        />
      )}

      {/* 麵包屑導航 schema - 總是會被渲染
          但其內容會根據 article 是否存在而不同 */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(breadcrumbSchema) 
        }} 
      />
    </>
  );
} 
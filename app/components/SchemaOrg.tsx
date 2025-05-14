import { Article } from 'contentlayer/generated';

// 定義組件的參數類型
type SchemaOrgProps = {
  article?: Article;  // 使用 ? 表示這是可選參數，可以是 Article 類型或是 undefined
  category?: string;  // 如果是分類頁面才需要
};

export function SchemaOrg({ article, category }: SchemaOrgProps) {
  // 為環境變量設置默認值
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://interior-design-guide.vercel.app';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Interior Design Guide';
  const siteAuthor = process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Interior Design Guide';

  // 文章 schema
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
      "name": siteAuthor
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "keywords": article.categories.join(','),
    "articleSection": article.categories[0]
  } : null;

  // 麵包屑導航 schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      // 如果是分類頁面：Home > Dark
      ...(category ? [
        {
          "@type": "ListItem",
          "position": 2,
          "name": category,
          "item": `${siteUrl}/blog/category/${category.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`
        }
      ] : []),
      // 如果是文章頁面：Home > Dark > 40 Dark Bedroom Ideas
      ...(article ? [
        {
          "@type": "ListItem",
          "position": 2,
          "name": article.categories[0],
          "item": `${siteUrl}/blog/category/${article.categories[0].toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": `${siteUrl}/blog/${article.slug}`
        }
      ] : [])
    ]
  };

  return (
    <>
      {article && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(articleSchema) 
          }} 
        />
      )}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(breadcrumbSchema) 
        }} 
      />
    </>
  );
} 
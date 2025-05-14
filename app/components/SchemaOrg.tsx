import { Article } from 'contentlayer/generated';

type SchemaOrgProps = {
  article?: Article;  // 如果是文章頁面才需要
};

export function SchemaOrg({ article }: SchemaOrgProps) {
  // 基本網站信息
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": process.env.NEXT_PUBLIC_SITE_NAME,
    "url": process.env.NEXT_PUBLIC_SITE_URL,
    "description": process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    "author": process.env.NEXT_PUBLIC_SITE_AUTHOR
  };

  // 如果是文章頁面，添加文章 schema
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

  // 麵包屑導航
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
      // 如果是文章頁面，添加分類和文章標題
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
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(websiteSchema) 
        }} 
      />
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
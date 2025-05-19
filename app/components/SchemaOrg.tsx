import { Article } from 'contentlayer/generated';

// 定義組件的參數類型
type SchemaOrgProps = {
  article?: Article;  // 使用 ? 表示這是可選參數，可以是 Article 類型或是 undefined
  category?: string;  // 如果是分類頁面才需要
  isAboutPage?: boolean;  // 新增一個標誌，表示是否為關於頁面
};

export function SchemaOrg({ article, category, isAboutPage }: SchemaOrgProps) {
  // 為環境變量設置默認值
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akio-hasegawa.design';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Akio Hasegawa';
  const siteAuthor = process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Akio Hasegawa';

  // 文章 schema
  const articleSchema = article ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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
    "articleSection": article.categories[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/${article.slug}`
    }
  } : null;

  // About 頁面的 schema
  const aboutSchema = isAboutPage ? {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": "Akio Hasegawa",
      "jobTitle": "Interior Design Strategist",
      "honorificPrefix": "M.Arch",
      "affiliation": {
        "@type": "Organization",
        "name": "Harvard Graduate School of Design"
      },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Harvard Graduate School of Design"
      },
      "memberOf": [
        {
          "@type": "Organization",
          "name": "International Interior Design Association"
        }
      ],
      "description": "Akio Hasegawa, M.Arch, is an interior design strategist with a multidisciplinary approach to architectural research and visual design. His work explores the intersections of spatial theory, cultural aesthetics, and contemporary design practices.",
      "image": `${siteUrl}/images/akio-hasegawa.jpg`, // 未有圖片
      "knowsAbout": [
        "Interior Design",
        "Architectural Research", 
        "Spatial Theory",
        "Cultural Aesthetics",
        "Contemporary Design Practices"
      ],
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "name": "Master of Architecture",
          "issuedBy": {
            "@type": "Organization", 
            "name": "Harvard Graduate School of Design"
          }
        }
      ]
    }
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
          "item": `${siteUrl}/category/${category.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`
        }
      ] : []),
      // 如果是文章頁面：Home > Dark > 40 Dark Bedroom Ideas
      ...(article ? [
        {
          "@type": "ListItem",
          "position": 2,
          "name": article.categories[0],
          "item": `${siteUrl}/category/${article.categories[0].toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": `${siteUrl}/${article.slug}`
        }
      ] : []),
      // 如果是 About 頁面
      ...(isAboutPage ? [
        {
          "@type": "ListItem",
          "position": 2,
          "name": "About",
          "item": `${siteUrl}/about`
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
      {isAboutPage && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(aboutSchema) 
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
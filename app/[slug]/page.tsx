import { notFound } from 'next/navigation';
import ArticlePage from './ArticlePage';
import type { Metadata } from 'next';
import { allArticles } from 'contentlayer/generated'
import SchemaOrg from '@/app/components/SchemaOrg';
import { getImageUrl } from '@/app/utils/imageUtils';

// 定義頁面參數類型
type PageProps = {
  params: { slug: string }
};

/**
 * 生成頁面元數據
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = allArticles.find(p => p.slug === params.slug); // 使用find()方法，通過檢查slug和id一致來查找文章
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akio-hasegawa.design';
  const canonicalUrl = `${siteUrl}/${params.slug}/`;

  return {
    title: article.title,
    description: article.excerpt,
    metadataBase: new URL(siteUrl || 'https://akio-hasegawa.design'),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: ['Akio Hasegawa'],
      images: [
        {
          url: getImageUrl(article.coverImage, 'hero'),
          width: 1200,
          height: 630,
          alt: article.coverImageAlt || article.title,
          type: 'image/jpeg',
        },
      ],
      url: canonicalUrl,
      siteName: 'Akio Hasegawa',
      locale: 'en_US',
      tags: article.categories ?? [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [getImageUrl(article.coverImage, 'hero')],
    },
  };
}

/**
 * 生成靜態頁面參數
 */
export async function generateStaticParams() {
  return allArticles.map((article) => ({
    slug: article.slug,
  })).filter(({ slug }) => {
    // 過濾掉非文章路徑，如 favicon.ico, robots.txt 等
    return !slug.includes('.') && !slug.startsWith('_') && slug.length > 0;
  });
}


/**
 * 文章詳情頁面組件
 */
export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = allArticles.find((article) => article.slug === params.slug);

  if (!article) {
    notFound();
  }

  // 優化相關文章的選擇邏輯
  const relatedArticles = allArticles
    .filter(a => {
      // 排除當前文章
      if (a.slug === article.slug) return false;
      
      // 優先選擇同分類的文章
      const hasCommonCategory = a.categories.some(cat => 
        article.categories.includes(cat)
      );
      
      // 如果沒有足夠的同分類文章，也考慮其他文章
      return hasCommonCategory || allArticles.length < 10;
    })
    .sort((a, b) => {
      // 優先排序同分類文章
      const aCommonCats = a.categories.filter(cat => 
        article.categories.includes(cat)
      ).length;
      const bCommonCats = b.categories.filter(cat => 
        article.categories.includes(cat)
      ).length;
      
      return bCommonCats - aCommonCats;
    })
    .slice(0, 3);

  // 優化推薦文章的選擇邏輯
  const recommendedArticles = allArticles
    .filter(a => a.slug !== article.slug)
    .sort(() => 0.5 - Math.random()) // 隨機排序
    .slice(0, 5);

  return (
    <>
      <SchemaOrg article={article} />
      <ArticlePage 
        article={article}
        relatedArticles={relatedArticles}
        recommendedArticles={recommendedArticles}
      />
    </>
  );
} 
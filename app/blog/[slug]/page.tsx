import { notFound } from 'next/navigation';
import ArticlePage from './ArticlePage';
import Sidebar from '@/app/components/Sidebar';
import type { Metadata } from 'next';
import { allArticles } from 'contentlayer/generated'



// 靜態數據：相關文章列表
const relatedArticles = [
  {
    category: "Interior Design",
    title: "How to Choose the Perfect Color Palette",
    coverImageUrl: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&q=80&w=800",
    link: "/blog/color-palette",
  },
  // ... 其他相關文章
];

// 靜態數據：推薦文章列表
const recommendedArticles = [
  {
    title: "Essential Steps to Design Your Perfect Living Room",
    coverImageUrl: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=200",
    link: "/blog/perfect-living-room",
  },
  // ... 其他推薦文章
];

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

  const canonicalUrl = `https://interior-design-guide.vercel.app/blog/${params.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    metadataBase: new URL('https://interior-design-guide.vercel.app'),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: ['Interior Design Guide'],
      images: [
        {
          url: article.coverImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
          type: 'image/jpeg',
        },
      ],
      url: canonicalUrl,
      siteName: 'Interior Design Guide',
      locale: 'en_US',
      tags: article.categories ?? [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.coverImageUrl],
    },
  };
}

/**
 * 生成靜態頁面參數
 */
export async function generateStaticParams() {
  return allArticles.map((article) => ({
    slug: article.slug,
  }))
}


/**
 * 文章詳情頁面組件
 */
export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = allArticles.find((article) => article.slug === params.slug)

  if (!article) {
    notFound();
  }

  // 獲取相關文章（保持原有邏輯）
  const relatedArticles = allArticles
    .filter(a => 
      a.slug !== article.slug && 
      a.categories.some(cat => article.categories.includes(cat))
    )
    .slice(0, 3);

  // 獲取推薦文章（保持原有邏輯）
  const recommendedArticles = allArticles
    .filter(a => a.slug !== article.slug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        <ArticlePage 
          article={article}
          relatedArticles={relatedArticles}
        />
        <Sidebar 
          recommendedArticles={recommendedArticles}
        />
      </div>
    </div>
  );
} 
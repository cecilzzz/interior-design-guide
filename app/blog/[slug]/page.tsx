import { getAllArticles, getArticle } from '@/app/lib/markdownProcessor';
import { getImageUrl } from '@/app/lib/imageUtils';
import Sidebar from '@/app/components/Sidebar';
import type { Metadata } from 'next';
import ArticlePage from './ArticlePage';

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
  params: { slug: string }  // 從 URL 動態路由中獲取的文章標識符
};

/**
 * 生成頁面元數據
 * @param {Object} props - 包含頁面參數的對象
 * @param {Object} props.params - URL 參數
 * @param {string} props.params.slug - 文章的唯一標識符
 * @returns {Promise<Metadata>} 返回頁面的元數據，包含 title, description, OpenGraph 等
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // 1. 獲取文章數據
  const currentArticle = await getArticle(params.slug);
  
  // 2. 處理文章不存在的情況
  if (!currentArticle) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    };
  }

  // 3. 處理圖片 URL 和規範 URL
  const imageUrl = currentArticle.coverImageUrl.startsWith('http') 
    ? currentArticle.coverImageUrl 
    : getImageUrl(currentArticle.coverImageUrl, 'hero');
  const canonicalUrl = `https://interior-design-guide.vercel.app/blog/${params.slug}`;

  // 4. 返回完整的元數據
  return {
    title: currentArticle.title,
    description: currentArticle.excerpt,
    metadataBase: new URL('https://interior-design-guide.vercel.app'),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: currentArticle.title,
      description: currentArticle.excerpt,
      type: 'article',
      publishedTime: currentArticle.date,
      modifiedTime: currentArticle.date,
      authors: ['Interior Design Guide'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: currentArticle.title,
          type: 'image/jpeg',
        },
      ],
      url: canonicalUrl,
      siteName: 'Interior Design Guide',
      locale: 'en_US',
      section: currentArticle.categories[0] || 'Interior Design',
      tags: currentArticle.categories,
    },
    twitter: {
      card: 'summary_large_image',
      title: currentArticle.title,
      description: currentArticle.excerpt,
      images: [imageUrl],
    },
  };
}

/**
 * 生成靜態頁面參數
 * @returns {Promise<Array<{slug: string}>>} 返回所有可能的文章路徑參數
 * 用於靜態生成頁面時預先生成所有可能的文章頁面
 */
export async function generateStaticParams() {
  const allArticles = await getAllArticles();
  return allArticles.map((article) => ({
    slug: article.id
  }));
}

/**
 * 文章詳情頁面組件
 * @param {Object} props - 組件屬性
 * @param {Object} props.params - URL 參數
 * @param {string} props.params.slug - 文章的唯一標識符
 * @returns {JSX.Element} 返回文章頁面的 JSX 元素
 */
export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  // 1. 獲取文章數據
  const currentArticle = await getArticle(params.slug);

  // 2. 處理文章不存在的情況
  if (!currentArticle) {
    return <div>Article not found</div>;
  }

  // 3. 處理文章數據
  const processedCurrentArticle = {
    ...currentArticle,  // 展開原文章數據
    coverImageUrl: getImageUrl(currentArticle.coverImageUrl, 'hero'),  // 處理圖片 URL
    category: currentArticle.categories[0],  // 獲取第一個分類
  };

  // 4. 渲染頁面
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        <ArticlePage 
          currentArticle={processedCurrentArticle}  // 輸入：處理後的當前文章數據
          relatedArticles={relatedArticles}  // 輸入：相關文章列表
        />
        <Sidebar 
          recommendedArticles={recommendedArticles}  // 輸入：推薦文章列表
        />
      </div>
    </div>
  );
} 
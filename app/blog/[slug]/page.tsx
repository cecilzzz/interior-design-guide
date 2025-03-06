import { getAllPosts } from '@/app/lib/posts';
import { getImageUrl } from '@/app/lib/imageUtils';
import Sidebar from '@/app/components/Sidebar';
import type { Metadata } from 'next';
import ArticlePage from './ArticlePage';

// 靜態數據：相關文章列表
const relatedPosts = [
  {
    category: "Interior Design",
    title: "How to Choose the Perfect Color Palette",
    image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&q=80&w=800",
    link: "/blog/color-palette",
  },
  // ... 其他相關文章
];

// 靜態數據：推薦文章列表
const recommendedPosts = [
  {
    title: "Essential Steps to Design Your Perfect Living Room",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=200",
    link: "/blog/perfect-living-room",
  },
  // ... 其他推薦文章
];

// 定義頁面參數類型
type Props = {
  params: { slug: string }  // 從 URL 動態路由中獲取的文章標識符
};

/**
 * 生成頁面元數據
 * @param {Object} props - 包含頁面參數的對象
 * @param {Object} props.params - URL 參數
 * @param {string} props.params.slug - 文章的唯一標識符
 * @returns {Promise<Metadata>} 返回頁面的元數據，包含 title, description, OpenGraph 等
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 1. 獲取文章數據
  const posts = getAllPosts();
  const post = posts.find((p) => p.id === params.slug);
  
  // 2. 處理文章不存在的情況
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  // 3. 處理圖片 URL 和規範 URL
  const imageUrl = post.image.startsWith('http') ? post.image : getImageUrl(post.image, 'hero');
  const canonicalUrl = `https://interior-design-guide.vercel.app/blog/${params.slug}`;

  // 4. 返回完整的元數據
  return {
    title: post.title,
    description: post.excerpt,
    metadataBase: new URL('https://interior-design-guide.vercel.app'),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ['Interior Design Guide'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/jpeg',
        },
      ],
      url: canonicalUrl,
      siteName: 'Interior Design Guide',
      locale: 'en_US',
      section: post.categories[0] || 'Interior Design',
      tags: post.categories,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
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
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.id,
  }));
}

/**
 * 博客文章頁面組件
 * @param {Object} props - 組件屬性
 * @param {Object} props.params - URL 參數
 * @param {string} props.params.slug - 文章的唯一標識符
 * @returns {JSX.Element} 返回文章頁面的 JSX 元素
 */
export default function BlogPost({ params }: { params: { slug: string } }) {
  // 1. 獲取文章數據
  const posts = getAllPosts();  // 輸入：無，輸出：文章列表數組
  const post = posts.find((p) => p.id === params.slug);  // 輸入：slug，輸出：找到的文章或 undefined

  // 2. 處理文章不存在的情況
  if (!post) {
    return <div>Post not found</div>;
  }

  // 3. 處理文章數據
  const blogPost = {
    ...post,  // 展開原文章數據
    image: getImageUrl(post.image, 'hero'),  // 處理圖片 URL
    category: post.categories[0],  // 獲取第一個分類
  };

  // 4. 渲染頁面
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        <ArticlePage 
          post={blogPost}  // 輸入：處理後的文章數據
          relatedPosts={relatedPosts}  // 輸入：相關文章列表
        />
        <Sidebar 
          recommendedPosts={recommendedPosts}  // 輸入：推薦文章列表
        />
      </div>
    </div>
  );
} 
import { getAllPosts } from '@/app/lib/posts';
import BlogContent from '@/app/components/BlogContent';
import Sidebar from '@/app/components/Sidebar';
import type { Metadata } from 'next';

// 這些是示例數據，實際應該從數據庫或其他地方獲取
const relatedPosts = [
  {
    category: "Interior Design",
    title: "How to Choose the Perfect Color Palette",
    image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&q=80&w=800",
    link: "/blog/color-palette",
  },
  // ... 其他相關文章
];

const recommendedPosts = [
  {
    title: "Essential Steps to Design Your Perfect Living Room",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=200",
    link: "/blog/perfect-living-room",
  },
  // ... 其他推薦文章
];

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = getAllPosts();
  const post = posts.find((p) => p.id === params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.id,
  }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const posts = getAllPosts();
  const post = posts.find((p) => p.id === params.slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }

  // 將 post 數據轉換為 BlogContent 需要的格式
  const blogPost = {
    ...post,
    category: post.categories[0],  // 暫時使用第一個分類作為主分類
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        <BlogContent post={blogPost} relatedPosts={relatedPosts} />
        <Sidebar recommendedPosts={recommendedPosts} />
      </div>
    </div>
  );
} 
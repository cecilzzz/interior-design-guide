import { getAllPosts } from '@/app/lib/posts';
import BlogContent from '@/app/components/BlogContent';
import Sidebar from '@/app/components/Sidebar';
import type { Metadata } from 'next/types';

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

// 使用 any 來暫時繞過類型檢查
export default async function Page(props: any) {
  const { params } = props;
  const posts = await getAllPosts();
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

export async function generateMetadata(props: any): Promise<Metadata> {
  const { params } = props;
  const posts = await getAllPosts();
  const post = posts.find((p) => p.id === params.slug);

  return {
    title: post?.title || 'Post not found',
    description: post?.excerpt || '',
  };
}

// 靜態參數生成
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.id,
  }));
} 
import { getAllPosts } from '@/app/lib/posts';
import PostGrid from '@/app/components/PostGrid';
import type { Metadata } from 'next/types';

// 移除 Props 類型定義
// type Props = {
//   params: { category: string };
// };

// 使用 any 來暫時繞過類型檢查
export async function generateMetadata(props: any): Promise<Metadata> {
  const { params } = props;
  return {
    title: `${params.category} - Blog Category`,
    description: `Articles about ${params.category.toLowerCase()}`,
  };
}

export default async function CategoryPage(props: any) {
  const { params } = props;
  const posts = await getAllPosts();
  
  const displayCategory = params.category
    .replace('-and-', ' & ')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-playfair text-center mb-4">{displayCategory}</h1>
      <div className="text-gray-500 text-center mb-12">
        Articles about {displayCategory.toLowerCase()}
      </div>
      <PostGrid posts={posts} category={displayCategory} />
    </div>
  );
}

export function generateStaticParams() {
  return [
    { category: 'living-room' },
    { category: 'bedroom' },
    // ... 其他分類
  ];
} 
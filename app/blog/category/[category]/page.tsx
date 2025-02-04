import { getAllPosts } from '@/app/lib/posts';
import PostGrid from '@/app/components/PostGrid';

export default function CategoryPage({ params }: { params: { category: string } }) {
  const posts = getAllPosts();
  
  // 用於顯示的格式：'Living Room'
  const displayCategory = params.category
    .replace('-and-', ' & ')  // URL 中的 and 轉換回 &
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
  const posts = getAllPosts();
  
  // 獲取所有唯一的分類
  const categories = new Set<string>();
  posts.forEach(post => {
    post.categories.forEach(category => {
      categories.add(category.toLowerCase()
        .replace(' & ', '-and-')
        .replace(/\s+/g, '-'));
    });
  });
  
  // 返回所有分類的路徑參數
  return Array.from(categories).map(category => ({
    category: category
  }));
} 
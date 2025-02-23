import { getAllPosts } from '@/app/lib/posts';
import { getImageUrl } from '@/app/lib/imageUtils';
import PostGrid from '@/app/components/PostGrid';
import type { Metadata } from 'next';

// 從 Navigation 中提取分類列表
const navCategories = [
  // Rooms
  "small-space",
  "living-room",
  "bedroom",
  "kitchen-and-dining",
  "bathroom",
  "storage-and-organization",
  "rental-and-budget",
  
  // Styles
  "modern",
  "minimalist",
  "scandinavian",
  "japandi",
  "industrial",
  "contemporary",
  "coastal",
  "rustic",
  "farmhouse",
  "boho",
  "mid-century-modern",
  "french",
  
  // Framework
  "design-principles",
  "space-planning",
  "colors-and-palettes",
  "lighting",
  "materials-and-textures"
];

type Props = {
  params: { category: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const displayCategory = params.category
    .replace('-and-', ' & ')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${displayCategory} - Interior Design Ideas and Inspiration`,
    description: `Explore our collection of ${displayCategory.toLowerCase()} design ideas, tips, and inspiration for your home.`,
    openGraph: {
      title: `${displayCategory} - Interior Design Ideas`,
      description: `Discover ${displayCategory.toLowerCase()} design inspiration and practical tips.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayCategory} - Interior Design Ideas`,
      description: `Discover ${displayCategory.toLowerCase()} design inspiration and practical tips.`,
    },
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const posts = getAllPosts().map(post => ({
    ...post,
    // 使用 hero 類型處理圖片，確保在網格中顯示最佳尺寸
    image: post.image.startsWith('http') ? post.image : getImageUrl(post.image, 'hero')
  }));
  
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
  const categories = new Set<string>(navCategories);
  
  // 添加文章中的分類
  posts.forEach(post => {
    post.categories.forEach(category => {
      const urlCategory = category.toLowerCase()
        .replace(/\s*&\s*/g, '-and-')  // 處理 & 符號，包括周圍的空格
        .replace(/\s+/g, '-');         // 其他空格轉換為連字符
      categories.add(urlCategory);
    });
  });
  
  return Array.from(categories).map(category => ({
    category: category
  }));
} 
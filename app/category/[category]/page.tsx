import { allArticles } from 'contentlayer/generated';
import PostGrid from '@/app/components/PostGrid';
import type { Metadata } from 'next';
import { SchemaOrg } from '@/app/components/SchemaOrg';

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
  "mediterranean",
  "coastal",
  "rustic",
  "farmhouse",
  "boho",
  "mid-century-modern",
  "french",
  "dark",
  "earthy",
  
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
  // 從 URL 參數中獲取分類名稱（例如：'living-room'）並賦值給 displayCategory
  const displayCategory = params.category
    // 1. 將 URL 中的 '-and-' 替換為 ' & '
    // 例如：'kitchen-and-dining' -> 'kitchen & dining'
    .replace('-and-', ' & ')

    // 2. 用連字符（-）分割字符串成數組
    // 例如：'living-room' -> ['living', 'room']
    .split('-')

    // 3. 將數組中的每個單詞首字母大寫
    // 例如：['living', 'room'] -> ['Living', 'Room']
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))

    // 4. 將數組中的單詞用空格連接成一個字符串
    // 例如：['Living', 'Room'] -> 'Living Room'
    .join(' ');

  return (
    <>
      <SchemaOrg category={displayCategory} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-playfair text-center mb-4">{displayCategory}</h1>
        <div className="text-gray-500 text-center mb-12">
          Articles about {displayCategory.toLowerCase()}
        </div>
        <PostGrid allArticles={allArticles} category={displayCategory} />
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const categories = new Set<string>(navCategories);
  
  // 添加文章中的分類
  allArticles.forEach(article => {
    article.categories.forEach(category => {
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
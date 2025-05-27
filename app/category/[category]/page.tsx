import { allArticles } from 'contentlayer/generated';
import PostGrid from '@/app/components/PostGrid';
import Sidebar from '@/app/components/Sidebar';
import type { Metadata } from 'next';
import { SchemaOrg } from '@/app/components/SchemaOrg';

// 從 Navigation 中提取分類列表
const navCategories = [
  // Rooms
  // "small-space",
  "living-room",
  "bedroom",
  "kitchen-and-dining",
  "bathroom",
  // "storage-and-organization",
  // "rental-and-budget",
  
  // Styles
  // "modern",
  // "minimalist",
  // "scandinavian",
  "japandi",
  "industrial",
  // "contemporary",
  "mediterranean",
  "coastal",
  "rustic",
  // "farmhouse",
  // "boho",
  // "mid-century-modern",
  "french",
  "dark",
  // "earthy",
  
  // Framework
  // "design-principles",
  // "space-planning",
  // "colors-and-palettes",
  // "lighting",
  // "materials-and-textures"
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
    .replace('-and-', ' & ')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // 篩選文章：根據分類過濾文章
  const categorizedArticles = allArticles.filter(article => 
    article.categories.some(cat => 
      cat.toLowerCase() === displayCategory.toLowerCase()
    )
  );

  // 篩選推薦文章，排除當前分類的文章
  const recommendedArticles = allArticles
    .filter(article => 
      !article.categories.some(cat => 
        cat.toLowerCase() === displayCategory.toLowerCase()
      )
    )
    .sort(() => 0.5 - Math.random()) // 隨機排序
    .slice(0, 3);

  return (
    <>
      <SchemaOrg category={displayCategory} />
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 pt-12 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,_0.4fr)] gap-8 md:gap-24">
        <div>
          <h1 className="text-4xl font-playfair text-center mb-4">{displayCategory}</h1>
          <div className="text-gray-500 text-center mb-12">
            Articles about {displayCategory.toLowerCase()}
          </div>
          <PostGrid displayedArticles={categorizedArticles} />
        </div>
        <Sidebar recommendedArticles={recommendedArticles} />
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
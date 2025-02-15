import Image from "next/image";
import Link from "next/link";

/**
 * 文章數據結構
 * 用於描述網格中顯示的每篇文章的基本信息
 */
interface Post {
  /** 文章唯一標識符，用於 URL 和 key */
  id: string;
  /** 文章標題 */
  title: string;
  /** 文章分類列表，支持多分類 */
  categories: string[];
  /** 發布日期 */
  date: string;
  /** 文章封面圖片 URL */
  image: string;
  /** 文章摘要，用於預覽 */
  excerpt: string;
}

/**
 * PostGrid 組件的屬性定義
 */
interface PostGridProps {
  /** 要顯示的文章列表 */
  posts: Post[];
  /** 可選的分類過濾器 */
  category?: string;
}

/**
 * PostGrid 組件
 * 
 * 負責以網格形式展示文章列表，支持分類過濾。
 * 這是一個展示型組件，處理文章的佈局和交互效果。
 * 
 * 功能：
 * 1. 以響應式網格佈局展示文章
 * 2. 支持按分類過濾文章
 * 3. 提供豐富的懸停效果
 * 4. 優化圖片加載和展示
 * 
 * 佈局特點：
 * - 響應式網格：1列(移動端) -> 2列(平板) -> 3列(桌面)
 * - 統一的卡片高度和圖片比例
 * - 優雅的懸停效果和過渡動畫
 * 
 * @param props - 組件屬性
 * @param props.posts - 要顯示的文章列表
 * @param props.category - 可選的分類過濾器
 */
export default function PostGrid({ posts, category }: PostGridProps) {
  // 根據分類過濾文章
  const filteredPosts = category 
    ? posts.filter(post => 
        post.categories.some(cat => 
          cat.toLowerCase() === category.toLowerCase()
        )
      )
    : posts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredPosts.map((post) => (
        <Link 
          key={post.id}
          href={`/blog/${post.id}`}
          className="group block"
        >
          {/* 文章封面圖片容器 */}
          <div className="relative aspect-[3/2] mb-4 overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
            />
            {/* 懸停時的漸變遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* 文章信息區域 */}
          <div className="text-center">
            <div className="text-coral-400 uppercase tracking-[0.2em] text-xs mb-2">
              {post.categories.join(" / ")}
            </div>
            <h2 className="font-playfair text-xl mb-2 group-hover:text-coral-500 transition-colors">
              {post.title}
            </h2>
            <div className="text-gray-500 text-sm mb-3">
              {post.date}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">
              {post.excerpt}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/**
 * 組件職責說明：
 * 1. 展示文章列表的網格視圖
 * 2. 處理文章的過濾和排序
 * 3. 提供文章卡片的交互效果
 * 
 * 注意事項：
 * - 使用 Next.js Image 組件優化圖片加載
 * - 使用 line-clamp-2 限制摘要顯示行數
 * - 分類過濾不區分大小寫
 * - 支持多分類的文章展示
 */ 
import Image from "next/image";
import Link from "next/link";
import { Article } from 'contentlayer/generated'
import { format } from 'date-fns'
import { getImageUrl } from '@/app/utils/imageUtils';

/**
 * PostGrid 組件的屬性定義
 */
interface PostGridProps {
  /** 要顯示的文章列表 */
  displayedArticles: Article[];
}

/**
 * PostGrid 組件
 * 
 * 負責以網格形式展示文章列表。
 * 這是一個純展示型組件，處理文章的佈局和交互效果。
 * 
 * 功能：
 * 1. 以響應式網格佈局展示文章
 * 2. 提供豐富的懸停效果
 * 3. 優化圖片加載和展示
 * 
 * 佈局特點：
 * - 響應式網格：1列(移動端) -> 2列(平板) -> 3列(桌面)
 * - 統一的卡片高度和圖片比例
 * - 優雅的懸停效果和過渡動畫
 * 
 * @param props - 組件屬性
 * @param props.allArticles - 要顯示的文章列表
 */
export default function PostGrid({ displayedArticles }: PostGridProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      {displayedArticles.map((article) => (
        <Link 
          key={article._id}
          href={`/${article.slug}/`}
          className="group block"
        >
          {/* 文章封面圖片容器 */}
          <div className="relative w-full mb-4 overflow-hidden">
            <Image
              src={getImageUrl(article.coverImageUrl, 'sidebar')}
              alt={article.title}
              width={0}
              height={0}
              className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
            />
            {/* 懸停時的漸變遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* 文章信息區域 */}
          <div className="text-center">
            <div className="text-coral-400 uppercase tracking-[0.2em] text-xs mb-2">
              {article.categories.join(" / ")}
            </div>
            <h2 className="font-playfair text-xl mb-2 group-hover:text-coral-500 transition-colors">
              {article.title}
            </h2>
            <div className="text-gray-500 text-sm mb-3">
              {format(new Date(article.date), 'MMMM dd, yyyy')}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/**
 * 組件職責說明：
 * 1. 展示文章列表的網格視圖
 * 2. 提供文章卡片的交互效果
 * 
 * 注意事項：
 * - 使用 Next.js Image 組件優化圖片加載
 * - 分類過濾已移至頁面級別
 */ 
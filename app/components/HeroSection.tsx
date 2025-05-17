import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from '@/app/utils/imageUtils';

type HeroProps = {
  category: string;
  title: string;
  date: string;
  coverImageUrl: string;
  slug: string;
};

export default function HeroSection({ category, title, date, coverImageUrl, slug }: HeroProps) {
  // 格式化日期，只保留年月日
  const formattedDate = date.split('T')[0];

  return (
    <Link href={`/${slug}`} className="block">
      <div className="max-w-[1440px] mx-auto px-8 pt-8 md:px-12">
        <div className="relative aspect-[16/9] group overflow-hidden rounded-lg">
          {/* 背景圖片容器 - 全寬 */}
          <Image
            src={getImageUrl(coverImageUrl, 'hero')}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:brightness-[0.85]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10" />
          
          {/* 內容容器 */}
          <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
            <div className="max-w-4xl space-y-4 sm:space-y-6">
              <p className="text-xs sm:text-sm tracking-widest font-montserrat text-gray-100/90 uppercase">
                {category}
              </p>
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                {title}
              </h1>
              <p className="text-xs sm:text-sm tracking-widest font-montserrat text-gray-100/80 uppercase">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 
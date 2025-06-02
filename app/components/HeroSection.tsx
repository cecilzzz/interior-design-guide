import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from '@/app/utils/imageUtils';

interface HeroProps {
  category: string;
  title: string;
  coverImage: string;
  slug: string;
}

export default function HeroSection({ category, title, coverImage, slug }: HeroProps) {
  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      {/* 背景圖片 */}
      <div className="absolute inset-0">
        <Image
          src={getImageUrl(coverImage, 'hero')}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        {/* 深色遮罩 */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="max-w-[1440px] mx-auto px-8 pt-8 md:px-12">
        <div className="relative aspect-[16/9] group overflow-hidden rounded-lg">
          <Link href={`/${slug}`} className="block relative w-full h-full">
            {/* 背景圖片容器 - 全寬 */}
            <Image
              src={getImageUrl(coverImage, 'hero')}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-in-out group-hover:brightness-[0.85]"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10" />
          </Link>
          
          {/* 內容容器 */}
          <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4 pointer-events-none">
            <div className="max-w-4xl space-y-4 sm:space-y-6">
              <p className="text-xs sm:text-sm tracking-widest font-montserrat text-gray-100/90 uppercase">
                {category}
              </p>
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
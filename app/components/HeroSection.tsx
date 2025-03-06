import Image from "next/image";

type HeroProps = {
  category: string;
  title: string;
  date: string;
  coverImageUrl: string;
};

export default function HeroSection({ category, title, date, coverImageUrl }: HeroProps) {
  return (
    <div className="relative aspect-[16/9] group">
      {/* 背景圖片容器 - 全寬 */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 brightness-[0.85]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10" />
      </div>
      
      {/* 內容容器 */}
      <div className="relative h-full flex items-center">
        <div className="w-full text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-xs sm:text-sm tracking-widest mb-4 sm:mb-6 font-montserrat text-gray-100/90 uppercase">
              {category}
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 leading-tight">
              {title}
            </h1>
            <div className="text-xs sm:text-sm tracking-widest font-montserrat text-gray-100/80 uppercase">
              {date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
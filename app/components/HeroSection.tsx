import Image from "next/image";

type HeroProps = {
  category: string;
  title: string;
  date: string;
  image: string;
};

export default function HeroSection({ category, title, date, image }: HeroProps) {
  return (
    <div className="relative aspect-[16/9]">
      {/* 背景圖片容器 - 全寬 */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover brightness-95"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      
      {/* 內容容器 */}
      <div className="relative h-full flex items-center">
        <div className="w-full text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm tracking-widest mb-6 font-montserrat">
              {category}
            </div>
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl mb-6">
              {title}
            </h1>
            <div className="text-sm tracking-widest font-montserrat">
              {date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
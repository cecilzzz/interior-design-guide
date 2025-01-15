import Image from "next/image";

type HeroProps = {
  category: string;
  title: string;
  date: string;
  image: string;
};

export default function HeroSection({ category, title, date, image }: HeroProps) {
  return (
    <div className="relative h-[80vh] w-full">
      {/* 背景圖片 */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="100vw"
        className="object-cover brightness-95"
        priority
        quality={75}
      />
      
      {/* 內容遮罩 */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* 文字內容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl">
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
  );
} 
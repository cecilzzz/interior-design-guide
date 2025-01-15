import Image from "next/image";

type BlogPostProps = {
  category: string;
  title: string;
  date: string;
  image: string;
  content: string;
};

export default function BlogPost({ 
  category, 
  title, 
  date, 
  image, 
  content,
}: BlogPostProps) {
  return (
    <article>
      <div className="text-center mb-12">
        <div className="text-coral-500 uppercase tracking-widest text-sm mb-4">
          {category}
        </div>
        <h1 className="font-playfair text-4xl mb-4">{title}</h1>
        <div className="text-gray-500 text-sm">{date}</div>
      </div>
      
      <div className="mb-8 relative aspect-[16/9]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 700px, 100vw"
        />
      </div>
      
      <div className="prose max-w-none">
        {content}
      </div>
      
      <div className="flex justify-center space-x-4 mt-8">
        <a href="#" className="text-gray-500 hover:text-gray-700">
          <span className="sr-only">Facebook</span>
          {/* Facebook icon */}
        </a>
        {/* 其他社交媒體圖標 */}
      </div>
    </article>
  );
} 
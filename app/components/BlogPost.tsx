import Image from "next/image";
import ReactMarkdown from 'react-markdown';  // 需要安裝: npm install react-markdown

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
        <div className="text-coral-400 uppercase tracking-[0.2em] text-sm mb-6 font-light">
          {category} / <span className="text-gray-500">DESIGN</span>
        </div>
        <h1 className="font-playfair text-4xl md:text-5xl mb-6">{title}</h1>
        <div className="text-gray-400 text-sm tracking-wider">{date}</div>
      </div>
      
      <div className="mb-8 relative aspect-[16/9] overflow-hidden rounded-lg group">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
          sizes="(min-width: 1024px) 700px, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="prose max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
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
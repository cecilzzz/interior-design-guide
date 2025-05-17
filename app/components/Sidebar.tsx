import Image from "next/image";
import Link from "next/link";
import { Article } from 'contentlayer/generated';
import { getImageUrl } from '@/app/utils/imageUtils';

type SidebarProps = {
  recommendedArticles?: Article[];
};

export default function Sidebar({ recommendedArticles = [] }: SidebarProps) {
  if (!recommendedArticles || recommendedArticles.length === 0) {
    return null;
  }

  return (
    <aside className="space-y-8 bg-white border-l border-gray-200 pl-6">
      <div>
        <h3 className="section-title text-lg font-playfair mb-8 text-center relative after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-12 after:h-[1px] after:bg-black">
          <span>MUST READ ARTICLES</span>
        </h3>
        <div className="grid grid-cols-1 gap-6">
          {recommendedArticles.map((article) => (
            <Link 
              key={article.title}
              href={`/${article.slug}`}
              className="group"
            >
              <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                <Image
                  src={getImageUrl(article.coverImageUrl, 'hero')}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h4 className="text-sm font-medium text-center text-gray-800 group-hover:text-coral-500 transition-colors">
                {article.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
} 
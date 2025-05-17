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
    <aside className="space-y-8">
      <div>
        <h3 className="section-title text-lg font-playfair mb-8 text-center">
          <span>MUST READ ARTICLES</span>
        </h3>
        <div className="grid grid-cols-1 gap-6">
          {recommendedArticles.map((article) => (
            <Link 
              key={article.title}
              href={`/${article.slug}`}
              className="group"
            >
              <div className="relative w-full mb-4 overflow-hidden">
                <Image
                  src={getImageUrl(article.coverImageUrl, 'sidebar')}
                  alt={article.title}
                  width={0}
                  height={0}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h4 className="font-playfair text-base sm:text-lg mb-2 text-left text-gray-800 group-hover:text-coral-500 transition-colors">
                {article.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
} 
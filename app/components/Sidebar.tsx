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
    <aside className="hidden lg:block space-y-8">
      <div>
        <div className="grid grid-cols-1 gap-6">
          {recommendedArticles.map((article) => (
            <Link 
              key={article.title}
              href={`/${article.slug}/`}
              className="group"
            >
              <div className="relative w-full mb-4 overflow-hidden">
                <Image
                  src={getImageUrl(article.coverImage, 'thumbnail')}
                  alt={article.coverImageAlt || article.title}
                  width={0}
                  height={0}
                  className="w-full h-auto object-cover transition-all duration-500 group-hover:brightness-90"
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
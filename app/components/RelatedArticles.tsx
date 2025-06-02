import Image from "next/image";
import Link from "next/link";
import { Article } from 'contentlayer/generated';
import { format } from 'date-fns'
import { getImageUrl } from '@/app/utils/imageUtils';

type RelatedArticlesProps = {
  articles: Article[];
};

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <section>
      <h2 className="text-3xl font-playfair text-center mb-8">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link 
            key={article._id}
            href={`/${article.slug}/`}
            className="group block"
          >
            <div className="relative w-full mb-4 overflow-hidden">
              <Image
                src={getImageUrl(article.coverImage, 'sidebar')}
                alt={article.coverImageAlt || article.title}
                width={0}
                height={0}
                className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <div className="text-center">
              <div className="text-coral-400 uppercase tracking-[0.2em] text-xs mb-2">
                {article.categories.join(" / ")}
              </div>
              <h2 className="font-playfair text-xl mb-2 group-hover:text-coral-500 transition-colors">
                {article.title}
              </h2>
              <div className="text-gray-500 text-sm mb-3">
                {format(new Date(article.date), 'MMMM dd, yyyy')}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
} 
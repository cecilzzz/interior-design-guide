import { allArticles } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import HeroSection from "./components/HeroSection";
import FeaturedCards from "./components/FeaturedCards";
import ArticlePage from "./blog/[slug]/ArticlePage";
import Sidebar from "./components/Sidebar";
import RelatedArticles from './components/RelatedArticles';

export default function Home() {
  // 獲取最新的文章作為特色文章
  const featuredArticle = allArticles
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    [0];

  // 獲取相關文章（同類別的其他文章）
  const relatedArticles = allArticles
    .filter(article => 
      article.slug !== featuredArticle.slug &&
      article.categories.some(cat => 
        featuredArticle.categories.includes(cat)
      )
    )
    .slice(0, 3);

  // 獲取推薦文章（隨機選擇）
  const recommendedArticles = allArticles
    .filter(article => article.slug !== featuredArticle.slug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <main>
      <div>
        {/* Hero section */}
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-8">
          <HeroSection
            category={featuredArticle.categories[0]}
            title={featuredArticle.title}
            date={featuredArticle.date}
            coverImageUrl={featuredArticle.coverImageUrl}
            slug={featuredArticle.slug}
          />
          
         {/* <div className="py-12 md:py-16">
            <FeaturedCards />
          </div> */}
        </div>
        
        {/* Blog section */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
            <ArticlePage 
              article={featuredArticle}
              relatedArticles={relatedArticles}
            />
            <Sidebar 
              recommendedArticles={recommendedArticles}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

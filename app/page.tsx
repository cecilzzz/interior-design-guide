import { allArticles } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import HeroSection from "./components/HeroSection";
import ArticleLayout from "./components/ArticleLayout";

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
        <HeroSection
          category={featuredArticle.categories[0]}
          title={featuredArticle.title}
          date={featuredArticle.date}
          coverImageUrl={featuredArticle.coverImageUrl}
          slug={featuredArticle.slug}
        />
        
        {/* Blog section */}
        <ArticleLayout 
          article={featuredArticle}
          relatedArticles={relatedArticles}
          recommendedArticles={recommendedArticles}
        />
      </div>
    </main>
  );
}

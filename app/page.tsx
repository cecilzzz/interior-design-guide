import { allArticles } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import HeroSection from "./components/HeroSection";
import ArticleLayout from "./components/ArticleLayout";
import PostGrid from "./components/PostGrid";
import Sidebar from "./components/Sidebar";

export default function Home() {
  // 獲取最新的文章作為特色文章
  const featuredArticle = allArticles
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    [0];

  // 獲取最近發表的四篇文章（首屏顯示的文章）
  const recentArticles = allArticles
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, 4);
  
  const recentSlugs = recentArticles.map(article => article.slug);

  // 獲取相關文章（同類別的其他文章）
  const relatedArticles = allArticles
    .filter(article => 
      article.slug !== featuredArticle.slug &&
      article.categories.some(cat => 
        featuredArticle.categories.includes(cat)
      )
    )
    .slice(0, 3);

  // 獲取推薦文章（排除最近四篇，隨機選擇）
  const recommendedArticles = allArticles
    .filter(article => !recentSlugs.includes(article.slug))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <main>
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 pt-12 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,_0.4fr)] gap-8 md:gap-24">
        <PostGrid displayedArticles={allArticles} />
        <Sidebar recommendedArticles={recommendedArticles} />
      </div>
    </main>
  );
}

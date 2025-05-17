import { Article } from 'contentlayer/generated';

import RelatedArticles from './RelatedArticles';
import ArticleRenderer from './ArticleRenderer';
import Sidebar from './Sidebar';

interface ArticleLayoutProps {
  article: Article;
  relatedArticles: Article[];
  recommendedArticles: Article[];
}

export default function ArticleLayout({ 
  article, 
  relatedArticles, 
  recommendedArticles 
}: ArticleLayoutProps) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-12 grid grid-cols-[1fr_320px] gap-12">
      <div>
        {/* 文章渲染器 */}
        <ArticleRenderer article={article} />

        {/* 相關文章 */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-16 border-t border-gray-100">
            <RelatedArticles articles={relatedArticles} />
          </div>
        )}
      </div>

      {/* 側邊欄 */}
      <Sidebar recommendedArticles={recommendedArticles} />
    </div>
  );
}

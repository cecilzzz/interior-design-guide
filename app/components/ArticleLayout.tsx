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
    <div className="max-w-[1440px] mx-auto px-8 md:px-12 pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,_0.4fr)] gap-8 md:gap-24">
        <div>
          {/* 文章渲染器 */}
          <ArticleRenderer article={article} />
        </div>

        {/* 側邊欄 */}
        <Sidebar recommendedArticles={recommendedArticles} />
      </div>

      {/* 相關文章網格 */}
      {relatedArticles.length > 0 && (
        <div className="mt-16 pt-16 border-t border-gray-100">
          <RelatedArticles articles={relatedArticles} />
        </div>
      )}
    </div>
  );
}

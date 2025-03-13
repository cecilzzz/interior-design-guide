import { Article } from 'contentlayer/generated';

import RelatedArticles from './RelatedArticles';
import ArticleRenderer from './ArticleRenderer';

interface ArticleLayoutProps {
  article: Article;
  relatedArticles: Article[];
}

export default function ArticleLayout({ article, relatedArticles }: ArticleLayoutProps) {
  return (
    <div className="article-content">
      {/* 文章渲染器 */}
      <ArticleRenderer article={article} />

      {/* 相關文章 */}
      {relatedArticles.length > 0 && (
        <div className="mt-16 pt-16 border-t border-gray-100">
          <RelatedArticles articles={relatedArticles} />
        </div>
      )}
    </div>
  );
}

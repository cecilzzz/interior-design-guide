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

          {/* 作者介紹 */}
          <div className="hidden sm:block mt-16 pt-8 border-t border-gray-100">
            <div className="bg-white p-16 border border-gray-200 shadow-sm">
              <div className="text-coral-400 text-2xl font-playfair font-semibold mb-8">Akio Hasegawa</div>
              <div className="prose lg:prose-lg text-gray-700">
                <p>
                  Akio Hasegawa, M.Arch, is an interior design strategist with a multidisciplinary approach to architectural research and visual design. His work explores the intersections of spatial theory, cultural aesthetics, and contemporary design practices.
                </p>
                <p>
                  With advanced training from Harvard Graduate School of Design and recognition from the International Interior Design Association, Hasegawa brings a sophisticated perspective to the exploration of interior design and architectural spaces.
                </p>
              </div>
            </div>
          </div>
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

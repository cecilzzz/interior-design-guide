import ArticleRenderer from "./ArticleRenderer";
import RelatedPosts from "./RelatedPosts";
import { getImageUrl } from '@/app/lib/imageUtils';
import ReactMarkdown from 'react-markdown';

/**
 * ArticleLayout 組件
 * 負責文章頁面的整體佈局，包括：
 * 1. 主要文章內容
 * 2. 相關文章列表
 */
type ArticleLayoutProps = {
  post: {
    category: string;
    title: string;
    date: string;
    image: string;
    content: string;
  };
  relatedPosts: Array<{
    category: string;
    title: string;
    image: string;
    link: string;
  }>;
};

export default function ArticleLayout({ post, relatedPosts }: ArticleLayoutProps) {
  return (
    <div className="space-y-16">
      <ArticleRenderer {...post} />
      <RelatedPosts posts={relatedPosts} />
    </div>
  );
}

// 移除未使用的 BlogContentMarkdown 組件，因為我們現在在 ArticleRenderer 中處理 Markdown 
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

// 注意：Markdown 的處理已經移到 ArticleRenderer 組件中
// 該組件使用 ReactMarkdown 來渲染內容並處理圖片優化 
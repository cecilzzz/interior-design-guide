import { getAllArticles } from '@/app/lib/markdownProcessor';
import { getImageUrl } from '@/app/lib/imageUtils';
import PostGrid from '@/app/components/PostGrid';

export default async function BlogPage() {
  const articles = (await getAllArticles()).map(article => ({
    ...article,
    coverImageUrl: article.coverImageUrl.startsWith('http') ? article.coverImageUrl : getImageUrl(article.coverImageUrl, 'hero')
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-playfair text-center mb-12">Blog</h1>
      <PostGrid posts={articles} />
    </div>
  );
} 
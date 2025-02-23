import { getAllPosts } from '@/app/lib/posts';
import { getImageUrl } from '@/app/lib/imageUtils';
import PostGrid from '@/app/components/PostGrid';

export default function BlogPage() {
  const posts = getAllPosts().map(post => ({
    ...post,
    image: post.image.startsWith('http') ? post.image : getImageUrl(post.image, 'hero')
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-playfair text-center mb-12">Blog</h1>
      <PostGrid posts={posts} />
    </div>
  );
} 
import { getAllPosts } from '@/app/lib/posts';
import { getImageUrl } from '@/app/lib/imageUtils';
import Sidebar from '@/app/components/Sidebar';
import type { Metadata } from 'next';
import ArticlePage from './ArticlePage';

// 這些是示例數據，實際應該從數據庫或其他地方獲取
const relatedPosts = [
  {
    category: "Interior Design",
    title: "How to Choose the Perfect Color Palette",
    image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&q=80&w=800",
    link: "/blog/color-palette",
  },
  // ... 其他相關文章
];

const recommendedPosts = [
  {
    title: "Essential Steps to Design Your Perfect Living Room",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=200",
    link: "/blog/perfect-living-room",
  },
  // ... 其他推薦文章
];

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = getAllPosts();
  const post = posts.find((p) => p.id === params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  const imageUrl = post.image.startsWith('http') ? post.image : getImageUrl(post.image, 'hero');
  const canonicalUrl = `https://interior-design-guide.vercel.app/blog/${params.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    metadataBase: new URL('https://interior-design-guide.vercel.app'),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ['Interior Design Guide'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/jpeg',
        },
      ],
      url: canonicalUrl,
      siteName: 'Interior Design Guide',
      locale: 'en_US',
      section: post.categories[0] || 'Interior Design',
      tags: post.categories,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.id,
  }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const posts = getAllPosts();
  const post = posts.find((p) => p.id === params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  // 將 post 數據轉換為 BlogContent 需要的格式
  const blogPost = {
    ...post,
    image: getImageUrl(post.image, 'hero'),
    category: post.categories[0],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        <ArticlePage post={blogPost} relatedPosts={relatedPosts} />
        <Sidebar recommendedPosts={recommendedPosts} />
      </div>
    </div>
  );
} 
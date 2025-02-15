import BlogPost from "./BlogPost";
import RelatedPosts from "./RelatedPosts";
import { getImageUrl } from '@/app/lib/imageUtils';
import ReactMarkdown from 'react-markdown';

type BlogContentProps = {
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

export default function BlogContent({ post, relatedPosts }: BlogContentProps) {
  return (
    <div className="space-y-16">
      <BlogPost {...post} />
      <RelatedPosts posts={relatedPosts} />
    </div>
  );
}

export function BlogContentMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        img: ({ src, alt }) => (
          <img 
            src={src ? getImageUrl(src, 'content') : ''} 
            alt={alt || ''} 
            className="w-full rounded-lg"
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
} 
import BlogPost from "./BlogPost";
import RelatedPosts from "./RelatedPosts";

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
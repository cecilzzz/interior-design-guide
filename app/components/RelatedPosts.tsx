import Image from "next/image";
import Link from "next/link";

type RelatedPost = {
  category: string;
  title: string;
  image: string;
  link: string;
};

type RelatedPostsProps = {
  posts: RelatedPost[];
};

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <section>
      <h2 className="text-2xl font-playfair text-center mb-12">YOU MIGHT ALSO LIKE</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Link 
            key={post.title}
            href={post.link}
            className="group"
          >
            <div className="relative aspect-[3/2] mb-4">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="text-center">
              <div className="text-coral-500 uppercase tracking-widest text-xs mb-2">
                {post.category}
              </div>
              <h3 className="font-playfair text-lg group-hover:text-gray-600">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
} 
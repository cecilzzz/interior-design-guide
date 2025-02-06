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
      <h2 className="section-title text-xl sm:text-2xl md:text-3xl font-playfair mb-8 sm:mb-12">
        <span>YOU MIGHT ALSO LIKE</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {posts.map((post) => (
          <Link 
            key={post.title}
            href={post.link}
            className="group block overflow-hidden"
          >
            <div className="relative aspect-[3/2] mb-3 sm:mb-4 overflow-hidden rounded-lg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
                sizes="(min-width: 640px) 45vw, 90vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="text-center transform transition-transform duration-300 group-hover:translate-y-[-4px]">
              <div className="text-coral-400 uppercase tracking-[0.2em] text-xs sm:text-sm mb-2 transition-colors duration-300 group-hover:text-coral-500">
                {post.category}
              </div>
              <h3 className="font-playfair text-base sm:text-lg md:text-xl transition-colors duration-300 group-hover:text-gray-600">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
} 
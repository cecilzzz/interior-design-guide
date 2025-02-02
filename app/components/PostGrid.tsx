import Image from "next/image";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  categories: string[];  // 改為數組
  date: string;
  image: string;
  excerpt: string;
};

type PostGridProps = {
  posts: Post[];           // 所有文章
  category?: string;       // 當前分類
};

export default function PostGrid({ posts, category }: PostGridProps) {
  // 修改過濾邏輯
  const filteredPosts = category 
    ? posts.filter(post => 
        post.categories.some(cat => 
          cat.toLowerCase() === category.toLowerCase()
        )
      )
    : posts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredPosts.map((post) => (
        <Link 
          key={post.id}
          href={`/blog/${post.id}`}
          className="group block"
        >
          <div className="relative aspect-[3/2] mb-4 overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          <div className="text-center">
            <div className="text-coral-400 uppercase tracking-[0.2em] text-xs mb-2">
              {post.categories.join(" / ")}  {/* 顯示所有分類 */}
            </div>
            <h2 className="font-playfair text-xl mb-2 group-hover:text-coral-500 transition-colors">
              {post.title}
            </h2>
            <div className="text-gray-500 text-sm mb-3">
              {post.date}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">
              {post.excerpt}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
} 
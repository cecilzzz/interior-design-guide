import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest } from "react-icons/fa";
import { Article } from '@/app/types/article';

type SidebarProps = {
  recommendedArticles: Article[];
};

export default function Sidebar({ recommendedArticles }: SidebarProps) {
  return (
    <aside className="space-y-16">
      {/* 作者簡介 */}
      <div className="text-center">
        <h2 className="section-title text-2xl font-playfair mb-8">
          <span>HI I'M OLIVIA</span>
        </h2>
        <div className="relative w-48 h-48 mx-auto mb-6">
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
            alt="Olivia"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <h3 className="font-playfair text-lg mb-4">OLIVIA</h3>
        <p className="text-gray-600 italic mb-4">
          Interior Design Enthusiast & Style Curator
        </p>
        <p className="text-gray-600 text-sm px-4">
          Sharing my passion for timeless design and creating beautiful living spaces
        </p>
      </div>

      {/* 社交媒體連結 */}
      <div className="text-center">
        <h3 className="text-lg mb-6 font-playfair">FOLLOW ME!</h3>
        <div className="flex justify-center gap-6">
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            <span className="sr-only">Facebook</span>
            <FaFacebook size={20} />
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            <span className="sr-only">Twitter</span>
            <FaTwitter size={20} />
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            <span className="sr-only">Instagram</span>
            <FaInstagram size={20} />
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            <span className="sr-only">Pinterest</span>
            <FaPinterest size={20} />
          </Link>
        </div>
      </div>

      {/* 訂閱表單 */}
      <div className="bg-gray-50 p-8">
        <h3 className="section-title text-lg font-playfair mb-6">
          <span>NEWSLETTER</span>
        </h3>
        <p className="text-gray-600 text-sm text-center mb-6">
          Join our design community and get weekly inspiration delivered to your inbox
        </p>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <button
            type="submit"
            className="w-full bg-coral-400 text-white py-3 rounded hover:bg-coral-500 transition-colors"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>

      {/* 推薦文章 */}
      <div>
        <h3 className="section-title text-lg font-playfair mb-8">
          <span>MUST READ ARTICLES</span>
        </h3>
        <div className="space-y-6">
          {recommendedArticles.map((article, index) => (
            <Link 
              key={article.title}
              href={article.link}
              className="flex items-center gap-4 group transition-all duration-300 hover:bg-gray-50 p-2 rounded-lg"
            >
              <span className="text-2xl font-playfair text-gray-300 transition-colors duration-300 group-hover:text-coral-500">
                {index + 1}
              </span>
              <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={article.coverImageUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <h4 className="text-sm font-medium transition-colors duration-300 group-hover:text-coral-500">
                {article.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
} 
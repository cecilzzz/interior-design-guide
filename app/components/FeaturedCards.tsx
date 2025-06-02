import Image from "next/image";
import Link from "next/link";

interface Card {
  title: string;
  category: string;
  coverImage: string;
}

const featuredCards: Card[] = [
  {
    title: "Modern Minimalist Living",
    category: "Living Room",
    coverImage: "https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Scandinavian Bedroom Design",
    category: "Bedroom",
    coverImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Industrial Kitchen Style",
    category: "Kitchen",
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
  },
];

export default function FeaturedCards() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Designs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image
                  src={card.coverImage}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
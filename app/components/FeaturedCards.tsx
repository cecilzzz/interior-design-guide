import Image from "next/image";
import Link from "next/link";

type Card = {
  title: string;
  image: string;
  link: string;
};

const cards: Card[] = [
  {
    title: "DISCOVER CURATED FURNITURE COLLECTIONS",
    image: "https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&q=80&w=800",
    link: "/collections",
  },
  {
    title: "STYLE GUIDES: FIND YOUR PERFECT FURNITURE MATCH",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    link: "/style-guides",
  },
  {
    title: "EXPLORE OUR DESIGN INSPIRATION BLOG",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
    link: "/blog",
  },
];

export default function FeaturedCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      {cards.map((card) => (
        <Link 
          key={card.title} 
          href={card.link}
          className="group relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-lg hover:shadow-xl transition-all duration-500"
        >
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 brightness-[0.85]"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10 transition-opacity duration-500 group-hover:opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <div className="text-center transform transition-transform duration-500 group-hover:translate-y-[-4px]">
              <h2 className="text-center text-white font-playfair text-lg sm:text-xl md:text-2xl font-medium tracking-wide">
                {card.title}
              </h2>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="inline-block text-coral-400 text-sm tracking-wider font-montserrat">
                  EXPLORE NOW
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 
import HeroSection from "./components/HeroSection";
import FeaturedCards from "./components/FeaturedCards";
import BlogContent from "./components/BlogContent";
import Sidebar from "./components/Sidebar";

const recommendedPosts = [
  {
    title: "Essential Steps to Design Your Perfect Living Room",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=200",
    link: "/blog/perfect-living-room",
  },
  {
    title: "Modern Minimalism: Less is More",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=200",
    link: "/blog/modern-minimalism",
  },
  {
    title: "Color Psychology in Interior Design",
    image: "https://images.unsplash.com/photo-1618377385526-83312906f0dc?auto=format&fit=crop&q=80&w=200",
    link: "/blog/color-psychology",
  },
];

const relatedPosts = [
  {
    category: "INTERIOR DESIGN",
    title: "How to Choose the Perfect Color Palette",
    image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&q=80&w=800",
    link: "/blog/color-palette",
  },
  {
    category: "STYLING TIPS",
    title: "Small Space Solutions: Maximizing Your Home",
    image: "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&q=80&w=800",
    link: "/blog/small-space-solutions",
  },
  {
    category: "INSPIRATION",
    title: "Bringing Nature Indoors: Biophilic Design",
    image: "https://images.unsplash.com/photo-1617104666298-550277b2e27c?auto=format&fit=crop&q=80&w=800",
    link: "/blog/biophilic-design",
  },
];

export default function Home() {
  const blogPost = {
    category: "INTERIOR DESIGN",
    title: "2025 Interior Design Trends",
    date: "DECEMBER 18, 2024",
    image: "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&q=80&w=1920",
    content: "Discover the hottest interior design trends forecasted for 2025...",
  };

  return (
    <main>
      <HeroSection
        category="INTERIOR DESIGN"
        title="Transform Your Space with Timeless Design"
        date="DECEMBER 2024"
        image="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1920"
      />
      <FeaturedCards />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          <BlogContent post={blogPost} relatedPosts={relatedPosts} />
          <Sidebar recommendedPosts={recommendedPosts} />
        </div>
      </div>
    </main>
  );
}

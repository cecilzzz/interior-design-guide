import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

// 配置 Playfair Display 字體
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

// 配置 Montserrat 字體
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://interior-design-guide.vercel.app'),
  title: {
    default: "Interior Design Guide | Your Complete Resource for Home Design",
    template: "%s | Interior Design Guide"
  },
  description: "Discover expert tips, inspiration, and practical solutions for creating beautiful and functional living spaces. Your comprehensive guide to interior design.",
  keywords: "interior design, home decor, living spaces, design tips, home improvement",
  
  // Google Search Console Verification
  verification: {
    google: 'MIQAEqy4KvQJvS-DeDe1H-X9RYLznKd622lpC_sgydI',
  },
  
  // Basic OpenGraph
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Interior Design Guide",
    title: "Interior Design Guide",
    description: "Your comprehensive resource for interior design inspiration and guidance",
    images: [
      {
        url: "og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Design Guide"
      }
    ],
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Interior Design Guide",
    description: "Your comprehensive resource for interior design inspiration and guidance",
    images: ["og-default.jpg"],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  
  // Viewport
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${montserrat.variable}`}>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

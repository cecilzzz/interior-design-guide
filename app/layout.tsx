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
  title: "Interior Design Guide | Your Complete Resource for Home Design",
  description: "Discover expert tips, inspiration, and practical solutions for creating beautiful and functional living spaces. Your comprehensive guide to interior design.",
  keywords: "interior design, home decor, living spaces, design tips, home improvement",
  openGraph: {
    title: "Interior Design Guide",
    description: "Your comprehensive resource for interior design inspiration and guidance",
    type: "website",
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

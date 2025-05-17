import type { Metadata } from "next";
import localFont from 'next/font/local';
import Script from "next/script";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

// 配置 Playfair Display 字體（本地可變字體文件）
const playfair = localFont({
  src: '../public/fonts/Playfair_Display/PlayfairDisplay-VariableFont_wght.ttf',
  display: 'swap',
  variable: '--font-playfair',
});

// 配置 Montserrat 字體（本地可變字體文件）
const montserrat = localFont({
  src: '../public/fonts/Montserrat/Montserrat-VariableFont_wght.ttf',
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://akio-hasegawa.design'),
  title: {
    default: "Interior Design Journal | Akio Hasegawa's Design Perspectives",
    template: "%s | Interior Design Journal"
  },
  description: "A curated exploration of spatial design, revealing the poetry of environments through cultural aesthetics, architectural research, and contemporary design practices.",
  keywords: "interior design, spatial theory, architectural research, cultural aesthetics, design perspectives, Akio Hasegawa",
  
  // Google Search Console Verification
  verification: {
    google: 'MIQAEqy4KvQJvS-DeDe1H-X9RYLznKd622lpC_sgydI',
    other: {
      'p:domain_verify': ['b23e59bbecfac7fc71535e2c969afc73'],
    },
  },
  
  // Basic OpenGraph
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Interior Design Journal",
    title: "Interior Design Journal | Akio Hasegawa",
    description: "A curated exploration of spatial design, revealing the poetry of environments through cultural aesthetics, architectural research, and contemporary design practices.",
    images: [
      {
        url: "og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Interior Design Journal by Akio Hasegawa",
        type: 'image/jpeg',
      }
    ],
    url: 'https://akio-hasegawa.design',
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Interior Design Journal | Akio Hasegawa",
    description: "A curated exploration of spatial design, revealing the poetry of environments through cultural aesthetics, architectural research, and contemporary design practices.",
    images: ["og-default.jpg"],
    site: "@akiohasegawa",
    creator: "@akiohasegawa",
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
  
  // 添加額外的 meta tags
  other: {
    'og:site_name': 'Interior Design Journal',
    'og:type': 'website',
    'article:author': 'Akio Hasegawa',
    'article:publisher': 'https://www.pinterest.com/akiohasegawa/',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PGBK5E7000"
          strategy="afterInteractive"
        />
        <Script 
          id="google-analytics" 
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PGBK5E7000');
          `}
        </Script>
        <meta name="p:domain_verify" content="b23e59bbecfac7fc71535e2c969afc73" />
      </head>
      <body className={`${playfair.variable} ${montserrat.variable}`}>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

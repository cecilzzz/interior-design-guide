import type { Metadata } from "next";
import localFont from 'next/font/local';
import Script from "next/script";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

const playfair = localFont({
  // 字体文件路径（相对于项目根目录）
  src: '../public/fonts/Playfair_Display/PlayfairDisplay-VariableFont_wght.ttf',
  
  // 字体加载策略
  // - 'swap': 立即使用后备字体，字体加载完成后替换
  // - 'block': 等待字体加载，可能导致短暂白屏
  // - 'fallback': 介于 'swap' 和 'block' 之间的策略
  display: 'swap',
  
  // 定义 CSS 变量名，用于在 CSS 和 Tailwind 中引用
  variable: '--font-playfair',
});


const montserrat = localFont({
  src: '../public/fonts/Montserrat/Montserrat-VariableFont_wght.ttf',
  display: 'swap',
  variable: '--font-montserrat',
});

// localFont 輸出對象的詳細解構：
// playfair = {
//   className: string,     // 一個唯一的類名，使用這個類可以直接應用字體
//                         // 例如：className="class_hash123"
//                         // 生成的 CSS：
//                         // .class_hash123 {
//                         //   font-family: 'Playfair Display';
//                         // }
//   style: {
//     fontFamily: string,  // 字體的實際名稱，例如 'Playfair Display'
//   },
//   variable: string      // 一個唯一的類名，用於注入 CSS 變量
//                        // 例如：className="variable_hash456"
//                        // 生成的 CSS：
//                        // .variable_hash456 {
//                        //   --font-playfair: 'Playfair Display';
//                        // }
// }
//
// 使用方式：
// 1. className 方式：直接應用字體
//    <div className={playfair.className}>直接使用字體</div>
//    結果：這個 div 會直接使用 Playfair Display 字體
//    
// 2. variable 方式：通過 CSS 變量使用，更靈活
//    <div className={playfair.variable}>
//      <h1 className="font-playfair">使用 CSS 變量</h1>
//    </div>
//    結果：
//    - div 獲得 CSS 變量定義
//    - h1 通過 Tailwind 的 font-playfair 類使用該變量
//    - Tailwind 中定義：.font-playfair { font-family: var(--font-playfair) }

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
    <html 
      lang="zh-TW" 
      // 可选：直接设置字体变量（通常不需要）
      style={{
        // 使用 .style.fontFamily 获取实际字体名称
        '--font-montserrat': montserrat.style.fontFamily,
        '--font-playfair': playfair.style.fontFamily
      } as React.CSSProperties}
    >
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
      
      <body 
        // 使用 .variable 注入 CSS 变量
        // 这是推荐的字体应用方式
        className={`
          ${playfair.variable}    // 注入 --font-playfair 变量
          ${montserrat.variable}  // 注入 --font-montserrat 变量
          
          # 全局样式设置
          text-[rgb(0,0,0)]        // 文字颜色
          bg-[rgb(250,249,246)]    // 背景颜色
          font-montserrat          // 默认使用 Montserrat 字体
          
          # 导航栏高度的 padding
          pt-[100px]
          
          # 其他全局样式
          antialiased               // 平滑字体渲染
          scroll-smooth             // 平滑滚动
        `}
      >
        <Navigation />
        
        <main>{children}</main>
        
        <Footer />
      </body>
    </html>
  );
}

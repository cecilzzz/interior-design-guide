import { GetStaticProps } from 'next';
import { getAllArticlePaths, getAllArticles } from '@/app/lib/markdownProcessor';
import { notFound } from 'next/navigation';
import ArticlePage from './ArticlePage';
import Sidebar from '@/app/components/Sidebar';
import type { Metadata } from 'next';
import { ComponentType } from 'react';
import { Article } from '@/app/types/article';
import { ArticlePath } from '@/app/types/articlePath';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 靜態數據：相關文章列表
const relatedArticles = [
  {
    category: "Interior Design",
    title: "How to Choose the Perfect Color Palette",
    coverImageUrl: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&q=80&w=800",
    link: "/blog/color-palette",
  },
  // ... 其他相關文章
];

// 靜態數據：推薦文章列表
const recommendedArticles = [
  {
    title: "Essential Steps to Design Your Perfect Living Room",
    coverImageUrl: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=200",
    link: "/blog/perfect-living-room",
  },
  // ... 其他推薦文章
];

// 定義頁面參數類型
type PageProps = {
  params: { slug: string }
};

interface MDXImport {
  default: ComponentType; // MDX 文件的內容作為 React 組件
  frontmatter: {
    title: string;
    date: string;
    categories: string[];
    coverImageUrl?: string; // 可選屬性
    excerpt?: string; // 可選屬性
  };
}

/**
 * 生成頁面元數據
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const allArticlePaths: ArticlePath[] = await getAllArticlePaths();
  const articlePath: ArticlePath | undefined = allArticlePaths.find(p => p.slug === params.slug);
  
  if (!articlePath) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    };
  }

  // 導入文章數據
  // const { frontmatter } = await import(
  //   `@/content/posts/${articlePath.category}/${params.slug}.mdx`
  // );

  const filePath = path.join(process.cwd(), 'content/posts', articlePath.category, `${params.slug}.mdx`);
  const source = await fs.readFile(filePath, 'utf8');
  const { data: frontmatter } = matter(source);

  const canonicalUrl = `https://interior-design-guide.vercel.app/blog/${params.slug}`;

  // 先計算 section 值
  const section = frontmatter?.categories?.[0] ?? 'Interior Design';


  return {
    title: frontmatter.title,
    description: frontmatter.excerpt,
    metadataBase: new URL('https://interior-design-guide.vercel.app'),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      type: 'article',
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.date,
      authors: ['Interior Design Guide'],
      images: [
        {
          url: frontmatter.coverImageUrl,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
          type: 'image/jpeg',
        },
      ],
      url: canonicalUrl,
      siteName: 'Interior Design Guide',
      locale: 'en_US',
      section: section,
      tags: frontmatter?.categories ?? [],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.excerpt,
      images: [frontmatter.coverImageUrl],
    },
  };
}

/**
 * 生成靜態頁面參數
 */
export async function generateStaticParams() {
  const allArticlePaths: ArticlePath[] = await getAllArticlePaths();
  return allArticlePaths.map(({ slug }) => ({ slug }));
}

/**
 * 文章詳情頁面組件
 */
export default async function ArticleDetailPage({ params }: PageProps) {
  const articles: Article[] = await getAllArticles();
  const article = articles.find(article => article.id === params.slug);

  if (!article) {
    notFound(); // 如果找不到文章，返回 404
  }
  // 導入文章數據

  const currentArticle = {
    title: article.title,
    date: article.date,
    category: article.categories[0],
    coverImageUrl: article.coverImageUrl,
    content: article.content
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        <ArticlePage 
          currentArticle={currentArticle}
          relatedArticles={relatedArticles}
        />
        <Sidebar 
          recommendedArticles={recommendedArticles}
        />
      </div>
    </div>
  );
} 
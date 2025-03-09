import { allArticles } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import PostGrid from '@/app/components/PostGrid'

export default function BlogPage() {
  const posts = allArticles.sort((a, b) => 
    compareDesc(new Date(a.date), new Date(b.date))
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-playfair text-center mb-12">Blog</h1>
      <PostGrid allArticles={allArticles} />
    </div>
  )
} 
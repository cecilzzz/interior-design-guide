import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import { getImageUrl } from '@/app/utils/imageUtils';

export const Article = defineDocumentType(() => ({
  name: 'Article',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    categories: { type: 'list', of: { type: 'string' }, required: true },
    // 存儲 seoFileName（不帶副檔名），用於 Cloudinary 圖片處理
    coverImage: { type: 'string', required: true },
    coverImageAlt: { type: 'string', required: false },
    excerpt: { type: 'string', required: true }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => {
        return doc._raw.sourceFileName.replace(/\.mdx$/, '');
      }
    }
  }
}))

export default makeSource({
  contentDirPath: 'content/posts',
  documentTypes: [Article]
})
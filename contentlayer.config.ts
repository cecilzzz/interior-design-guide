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
    coverImageUrl: { type: 'string', required: true },
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
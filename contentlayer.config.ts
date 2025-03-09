import { defineDocumentType, makeSource } from 'contentlayer/source-files'

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
        // 只取最後一個路徑部分（文件名）
        const fileName = doc._raw.sourceFileName
          .replace(/\.mdx$/, '');
        return fileName;
      }
    }
  }
}))

export default makeSource({
  contentDirPath: 'content/posts',
  documentTypes: [Article]
})
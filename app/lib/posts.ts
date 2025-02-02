import fs from 'fs/promises';  // 使用 promises 版本
import path from 'path';
import matter from 'gray-matter';  // 需要安裝: npm install gray-matter

// 定義文章數據的類型
type Post = {
  id: string;
  content: string;
  title: string;
  categories: string[];  // 改為數組
  date: string;
  image: string;
  excerpt: string;
};

export async function getAllPosts(): Promise<Post[]> {  // 添加 async
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  const fileNames = await fs.readdir(postsDirectory);  // 添加 await
  
  const allPostsData = await Promise.all(fileNames.map(async (fileName) => {  // 使用 Promise.all
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = await fs.readFile(fullPath, 'utf8');  // 添加 await
    const { data, content } = matter(fileContents);

    return {
      id,
      content,
      ...(data as Omit<Post, 'id' | 'content'>),
    };
  }));

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
} 
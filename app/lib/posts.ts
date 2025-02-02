import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';  // 需要安裝: npm install gray-matter

// 定義文章數據的類型
type Post = {
  id: string;
  content: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
};

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPosts(): Post[] {
  // 讀取 posts 目錄下的所有文件
  const fileNames = fs.readdirSync(postsDirectory);
  
  // 處理每個文件
  const allPostsData = fileNames.map((fileName) => {
    // 從文件名獲取 id（移除 .md 後綴）
    const id = fileName.replace(/\.md$/, '');

    // 讀取 markdown 文件內容
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 使用 gray-matter 解析文件的 frontmatter 和內容
    const { data, content } = matter(fileContents);

    // 組合數據
    return {
      id,
      content,
      ...(data as Omit<Post, 'id' | 'content'>),
    };
  });

  // 按日期排序
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
} 
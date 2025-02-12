import fs from 'fs';
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

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPosts(): Post[] {
  try {
    // 確保目錄存在
    if (!fs.existsSync(postsDirectory)) {
      console.warn('Posts directory does not exist:', postsDirectory);
      return [];
    }

    // 讀取 posts 目錄下的所有文件
    const fileNames = fs.readdirSync(postsDirectory);
    
    // 如果沒有文件，返回空數組
    if (!fileNames || fileNames.length === 0) {
      console.warn('No posts found in directory:', postsDirectory);
      return [];
    }
    
    // 處理每個文件
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))  // 只處理 .md 文件
      .map((fileName) => {
        try {
          // 從文件名獲取 id（移除 .md 後綴）
          const id = fileName.replace(/\.md$/, '');

          // 讀取 markdown 文件內容
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');

          // 使用 gray-matter 解析文件的 frontmatter 和內容
          const { data, content } = matter(fileContents);

          // 確保必要的字段存在
          if (!data.title || !data.categories || !Array.isArray(data.categories)) {
            console.warn(`Post ${fileName} is missing required fields`);
            return null;
          }

          // 組合數據
          return {
            id,
            content,
            ...(data as Omit<Post, 'id' | 'content'>),
          };
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error);
          return null;
        }
      })
      .filter((post): post is Post => post !== null);  // 過濾掉處理失敗的文章

    // 按日期排序
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    return [];
  }
} 
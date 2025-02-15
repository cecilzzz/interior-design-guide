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

// 遞迴獲取所有 .md 文件
function getAllMarkdownFiles(dir: string): string[] {
  let results: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
}

export function getAllPosts(): Post[] {
  try {
    // 確保目錄存在
    if (!fs.existsSync(postsDirectory)) {
      console.warn('Posts directory does not exist:', postsDirectory);
      return [];
    }

    // 獲取所有 .md 文件的路徑
    const filePaths = getAllMarkdownFiles(postsDirectory);
    
    // 如果沒有文件，返回空數組
    if (!filePaths || filePaths.length === 0) {
      console.warn('No posts found in directory:', postsDirectory);
      return [];
    }
    
    // 處理每個文件
    const allPostsData = filePaths.map((filePath) => {
      try {
        // 從文件路徑生成 id（只使用文件名）
        const relativePath = path.relative(postsDirectory, filePath);
        const pathParts = relativePath.split(path.sep);
        const id = pathParts[pathParts.length - 1].replace(/\.md$/, '');  // 只取文件名作為 ID

        // 讀取 markdown 文件內容
        const fileContents = fs.readFileSync(filePath, 'utf8');

        // 使用 gray-matter 解析文件的 frontmatter 和內容
        const { data, content } = matter(fileContents);

        // 確保必要的字段存在
        if (!data.title || !data.categories || !Array.isArray(data.categories)) {
          console.warn(`Post ${filePath} is missing required fields`);
          return null;
        }

        // 組合數據
        return {
          id,
          content,
          ...(data as Omit<Post, 'id' | 'content'>),
        };
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        return null;
      }
    }).filter((post): post is Post => post !== null);

    // 按日期排序
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    return [];
  }
} 
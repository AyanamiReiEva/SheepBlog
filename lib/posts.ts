import { getStorage } from '@/lib/storage';

export interface PostMetadata {
  title: string;
  date: string;
  description: string;
  tags: string[];
  slug: string;
}

export function parseMetadata(fileContents: string, slug: string): PostMetadata {
  // 只检查文件开头的 frontmatter（必须在第一行）
  if (fileContents.trimStart().startsWith('---')) {
    const metadataMatch = fileContents.match(/^---\n([\s\S]*?)\n---/);
    if (metadataMatch) {
      const metadata = metadataMatch[1];
      const titleMatch = metadata.match(/title:\s*"([^"]+)"/);
      const dateMatch = metadata.match(/date:\s*"([^"]+)"/);
      const descriptionMatch = metadata.match(/description:\s*"([^"]+)"/);
      const tagsMatch = metadata.match(/tags:\s*\[([^\]]+)\]/);

      return {
        title: titleMatch ? titleMatch[1] : '',
        date: dateMatch ? dateMatch[1] : '',
        description: descriptionMatch ? descriptionMatch[1] : '',
        tags: tagsMatch ? tagsMatch[1].split(',').map((t) => t.trim().replace(/"/g, '')) : [],
        slug,
      };
    }
  }

  // 如果没有 frontmatter，从内容中提取信息
  const titleMatch = fileContents.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : slug;

  // 从内容中提取前几行作为描述
  const contentWithoutTitle = fileContents.replace(/^#\s+.+$/m, '').trim();
  const firstParagraph = contentWithoutTitle.split('\n').find((p) => p.trim().length > 0) || '';
  const description = firstParagraph.substring(0, 150) + (firstParagraph.length > 150 ? '...' : '');

  return {
    title,
    date: new Date().toISOString().split('T')[0],
    description,
    tags: [],
    slug,
  };
}

export async function getAllPostSlugs() {
  const storage = getStorage();
  return await storage.listFiles();
}

export async function getPostMetadata(slug: string): Promise<PostMetadata> {
  const storage = getStorage();
  const fileContents = await storage.readFile(slug);
  return parseMetadata(fileContents, slug);
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  const slugs = await getAllPostSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPostMetadata(slug)));
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostContent(slug: string) {
  const storage = getStorage();
  const fileContents = await storage.readFile(slug);
  return fileContents.replace(/---\n[\s\S]*?\n---\n/, '');
}


import { getStorage } from '@/lib/storage';

export interface PostMetadata {
  title: string;
  date: string;
  description: string;
  tags: string[];
  slug: string;
}

function parseMetadata(fileContents: string, slug: string): PostMetadata {
  const metadataMatch = fileContents.match(/---\n([\s\S]*?)\n---/);
  if (!metadataMatch) {
    throw new Error(`Post ${slug} has no metadata`);
  }

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


import fs from 'fs';
import path from 'path';

export interface PostMetadata {
  title: string;
  date: string;
  description: string;
  tags: string[];
  slug: string;
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => fileName.replace(/\.mdx$/, ''));
}

export function getPostMetadata(slug: string): PostMetadata {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

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

export function getAllPosts(): PostMetadata[] {
  const slugs = getAllPostSlugs();
  const posts = slugs.map((slug) => getPostMetadata(slug));
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostContent(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return fileContents.replace(/---\n[\s\S]*?\n---\n/, '');
}

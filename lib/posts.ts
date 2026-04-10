import { getStorage } from '@/lib/storage';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { getAllViews, getViews } from '@/lib/views';

export interface PostMetadata {
  title: string;
  date: string;
  description: string;
  tags: string[];
  slug: string;
  views?: number;
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
  const metadata = parseMetadata(fileContents, slug);
  const views = await getViews(slug);
  return { ...metadata, views };
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  try {
    const slugs = await getAllPostSlugs();
    const viewsData = await getAllViews();

    // 并行获取所有文章元数据，但对单个失败的文章进行容错处理
    const postPromises = slugs.map(async (slug) => {
      try {
        const metadata = await getPostMetadata(slug);
        return { ...metadata, views: viewsData[slug] || 0 };
      } catch (error) {
        console.warn(`[getAllPosts] Failed to get metadata for slug "${slug}", skipping:`, error);
        return null;
      }
    });

    const results = await Promise.all(postPromises);
    const posts = results.filter((post): post is PostMetadata => post !== null);

    console.log(`[getAllPosts] Successfully loaded ${posts.length}/${slugs.length} posts`);
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('[getAllPosts] Failed to get posts:', error);
    // 即使失败也返回空数组，而不是抛出异常
    return [];
  }
}

export async function getAllPostsSortedByViews(): Promise<PostMetadata[]> {
  const posts = await getAllPosts();
  return posts.sort((a, b) => (b.views || 0) - (a.views || 0));
}

export async function getPostContent(slug: string) {
  const storage = getStorage();
  const fileContents = await storage.readFile(slug);
  let content = fileContents.replace(/---\n[\s\S]*?\n---\n/, '');
  // 移除开头的标题（# 标题），因为页面会单独显示标题
  content = content.replace(/^#\s+.+(\n|$)/, '').trimStart();
  return content;
}

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkHtml, {
      sanitize: false,
    })
    .process(markdown);

  return String(file);
}

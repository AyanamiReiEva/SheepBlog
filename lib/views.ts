import fs from 'fs';
import path from 'path';

const VIEWS_FILE = path.join(process.cwd(), 'data', 'views.json');

interface ViewsData {
  [slug: string]: number;
}

async function ensureDataDir() {
  const dataDir = path.dirname(VIEWS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

async function readViews(): Promise<ViewsData> {
  await ensureDataDir();
  try {
    if (fs.existsSync(VIEWS_FILE)) {
      const content = fs.readFileSync(VIEWS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    // 文件不存在或读取失败，返回空对象
  }
  return {};
}

async function writeViews(views: ViewsData): Promise<void> {
  await ensureDataDir();
  fs.writeFileSync(VIEWS_FILE, JSON.stringify(views, null, 2));
}

export async function getViews(slug: string): Promise<number> {
  const views = await readViews();
  return views[slug] || 0;
}

export async function incrementViews(slug: string): Promise<number> {
  const views = await readViews();
  views[slug] = (views[slug] || 0) + 1;
  await writeViews(views);
  return views[slug];
}

export async function getAllViews(): Promise<ViewsData> {
  return await readViews();
}

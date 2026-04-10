import fs from 'fs';
import path from 'path';
import { StorageAdapter } from './types';

export class LocalStorageAdapter implements StorageAdapter {
  private postsDirectory: string;

  constructor(postsDirectory?: string) {
    this.postsDirectory = postsDirectory || path.join(process.cwd(), 'content', 'posts');
  }

  async isAvailable(): Promise<boolean> {
    try {
      await fs.promises.access(this.postsDirectory);
      return true;
    } catch {
      return false;
    }
  }

  async listFiles(): Promise<string[]> {
    const fileNames = await fs.promises.readdir(this.postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => fileName.replace(/\.mdx$/, ''));
  }

  async readFile(slug: string): Promise<string> {
    const fullPath = path.join(this.postsDirectory, `${slug}.mdx`);
    return await fs.promises.readFile(fullPath, 'utf8');
  }

  async fileExists(slug: string): Promise<boolean> {
    const fullPath = path.join(this.postsDirectory, `${slug}.mdx`);
    try {
      await fs.promises.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}

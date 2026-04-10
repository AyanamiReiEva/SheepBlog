import fs from 'fs';
import path from 'path';
import { StorageAdapter } from './types';

const supportedExtensions = ['.mdx', '.md'];

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
    console.log(`[LocalStorage] Listing files from ${this.postsDirectory}`);
    const fileNames = await fs.promises.readdir(this.postsDirectory);
    const files = fileNames
      .filter((fileName) => supportedExtensions.some((ext) => fileName.endsWith(ext)))
      .map((fileName) => {
        for (const ext of supportedExtensions) {
          if (fileName.endsWith(ext)) {
            return fileName.slice(0, -ext.length);
          }
        }
        return fileName;
      });
    console.log(`[LocalStorage] Found ${files.length} files:`, files);
    return files;
  }

  private async findFilePath(slug: string): Promise<string | null> {
    for (const ext of supportedExtensions) {
      const fullPath = path.join(this.postsDirectory, `${slug}${ext}`);
      try {
        await fs.promises.access(fullPath);
        return fullPath;
      } catch {
        continue;
      }
    }
    return null;
  }

  async readFile(slug: string): Promise<string> {
    const filePath = await this.findFilePath(slug);
    if (!filePath) {
      throw new Error(`File not found for slug: ${slug}`);
    }
    return await fs.promises.readFile(filePath, 'utf8');
  }

  async fileExists(slug: string): Promise<boolean> {
    const filePath = await this.findFilePath(slug);
    return filePath !== null;
  }
}

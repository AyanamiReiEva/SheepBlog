import { createClient, WebDAVClient } from 'webdav';
import { StorageAdapter } from './types';

export interface JianguoyunConfig {
  webdavUrl: string;
  username: string;
  password: string;
  basePath: string;
}

export class JianguoyunStorageAdapter implements StorageAdapter {
  private client: WebDAVClient;
  private config: JianguoyunConfig;

  constructor(config: JianguoyunConfig) {
    this.config = config;
    this.client = createClient(config.webdavUrl, {
      username: config.username,
      password: config.password,
    });
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.exists(this.config.basePath);
      return true;
    } catch {
      return false;
    }
  }

  async listFiles(): Promise<string[]> {
    try {
      const contents = await this.client.getDirectoryContents(this.config.basePath);
      if (Array.isArray(contents)) {
        return contents
          .filter((item) => item.type === 'file' && item.basename.endsWith('.mdx'))
          .map((item) => item.basename.replace(/\.mdx$/, ''));
      }
      return [];
    } catch (error) {
      console.error('Failed to list files from Jianguoyun:', error);
      throw error;
    }
  }

  async readFile(slug: string): Promise<string> {
    try {
      const filePath = `${this.config.basePath}/${slug}.mdx`;
      const content = await this.client.getFileContents(filePath, { format: 'text' });
      return content as string;
    } catch (error) {
      console.error(`Failed to read file ${slug} from Jianguoyun:`, error);
      throw error;
    }
  }

  async fileExists(slug: string): Promise<boolean> {
    try {
      const filePath = `${this.config.basePath}/${slug}.mdx`;
      return await this.client.exists(filePath);
    } catch {
      return false;
    }
  }
}

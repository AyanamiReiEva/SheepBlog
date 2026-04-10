import { createClient, WebDAVClient } from 'webdav';
import { StorageAdapter } from './types';

const supportedExtensions = ['.mdx', '.md'];

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
          .filter(
            (item) =>
              item.type === 'file' && supportedExtensions.some((ext) => item.basename.endsWith(ext))
          )
          .map((item) => {
            for (const ext of supportedExtensions) {
              if (item.basename.endsWith(ext)) {
                return item.basename.slice(0, -ext.length);
              }
            }
            return item.basename;
          });
      }
      return [];
    } catch (error) {
      console.error('Failed to list files from Jianguoyun:', error);
      throw error;
    }
  }

  private async findFilePath(slug: string): Promise<string | null> {
    for (const ext of supportedExtensions) {
      const cleanBasePath = this.config.basePath.endsWith('/')
        ? this.config.basePath.slice(0, -1)
        : this.config.basePath;
      const filePath = `${cleanBasePath}/${slug}${ext}`;
      try {
        const exists = await this.client.exists(filePath);
        if (exists) {
          return filePath;
        }
      } catch {
        continue;
      }
    }
    return null;
  }

  async readFile(slug: string): Promise<string> {
    try {
      const filePath = await this.findFilePath(slug);
      if (!filePath) {
        throw new Error(`File not found for slug: ${slug}`);
      }
      const content = await this.client.getFileContents(filePath, { format: 'text' });
      return content as string;
    } catch (error) {
      console.error(`Failed to read file ${slug} from Jianguoyun:`, error);
      throw error;
    }
  }

  async fileExists(slug: string): Promise<boolean> {
    try {
      const filePath = await this.findFilePath(slug);
      return filePath !== null;
    } catch {
      return false;
    }
  }
}

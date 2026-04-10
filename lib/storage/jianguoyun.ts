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
      console.log(`[Jianguoyun] Listing files from ${this.config.basePath}`);
      const contents = await this.client.getDirectoryContents(this.config.basePath);
      if (Array.isArray(contents)) {
        const files = contents
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
        console.log(`[Jianguoyun] Found ${files.length} files:`, files);
        return files;
      }
      console.log(`[Jianguoyun] No files found (contents not an array)`);
      return [];
    } catch (error) {
      console.error('[Jianguoyun] Failed to list files:', error);
      throw error;
    }
  }

  private async findFilePath(slug: string): Promise<string | null> {
    console.log(`[Jianguoyun] Looking for file with slug: "${slug}"`);
    const cleanBasePath = this.config.basePath.endsWith('/')
      ? this.config.basePath.slice(0, -1)
      : this.config.basePath;

    // 先列出所有文件，看看实际有什么，并尝试直接匹配
    try {
      const contents = await this.client.getDirectoryContents(this.config.basePath);
      if (Array.isArray(contents)) {
        console.log(
          '[Jianguoyun] Files in directory:',
          contents.map((item) => item.basename)
        );

        // 直接在列出的文件中查找匹配的
        for (const item of contents) {
          if (item.type === 'file') {
            for (const ext of supportedExtensions) {
              if (item.basename === `${slug}${ext}`) {
                console.log(`[Jianguoyun] Found exact match: ${item.basename}`);
                const cleanBasePath = this.config.basePath.endsWith('/')
                  ? this.config.basePath.slice(0, -1)
                  : this.config.basePath;
                return `${cleanBasePath}/${item.basename}`;
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn('[Jianguoyun] Failed to list directory for debugging:', error);
    }

    // 如果直接匹配没找到，再尝试原来的方法
    for (const ext of supportedExtensions) {
      const filePath = `${cleanBasePath}/${slug}${ext}`;
      console.log(`[Jianguoyun] Checking path: ${filePath}`);
      try {
        const exists = await this.client.exists(filePath);
        console.log(`[Jianguoyun] Path ${filePath} exists: ${exists}`);
        if (exists) {
          return filePath;
        }
      } catch (error) {
        console.warn(`[Jianguoyun] Error checking path ${filePath}:`, error);
        continue;
      }
    }
    console.log(`[Jianguoyun] No file found for slug: ${slug}`);
    return null;
  }

  async readFile(slug: string): Promise<string> {
    try {
      const filePath = await this.findFilePath(slug);
      if (!filePath) {
        throw new Error(`File not found for slug: ${slug}`);
      }
      console.log(`[Jianguoyun] Reading file from: ${filePath}`);
      const content = await this.client.getFileContents(filePath, {
        format: 'text',
      });
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

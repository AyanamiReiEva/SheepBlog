import { StorageAdapter } from './types';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

export class CachedStorageAdapter implements StorageAdapter {
  private adapter: StorageAdapter;
  private ttl: number;

  private listFilesCache: CacheEntry<string[]> | null = null;
  private fileContentCache: Map<string, CacheEntry<string>> = new Map();
  private fileExistsCache: Map<string, CacheEntry<boolean>> = new Map();

  constructor(adapter: StorageAdapter, ttlSeconds: number = 60) {
    this.adapter = adapter;
    this.ttl = ttlSeconds * 1000;
  }

  private isExpired(entry: CacheEntry<unknown>): boolean {
    return Date.now() - entry.timestamp > this.ttl;
  }

  async isAvailable(): Promise<boolean> {
    return this.adapter.isAvailable();
  }

  async listFiles(): Promise<string[]> {
    // 暂时禁用缓存以便调试
    const files = await this.adapter.listFiles();
    this.listFilesCache = { value: files, timestamp: Date.now() };
    return files;
  }

  async readFile(slug: string): Promise<string> {
    // 暂时禁用缓存以便调试
    const content = await this.adapter.readFile(slug);
    this.fileContentCache.set(slug, { value: content, timestamp: Date.now() });
    return content;
  }

  async fileExists(slug: string): Promise<boolean> {
    // 暂时禁用缓存以便调试
    const exists = await this.adapter.fileExists(slug);
    this.fileExistsCache.set(slug, { value: exists, timestamp: Date.now() });
    return exists;
  }

  clearCache(): void {
    this.listFilesCache = null;
    this.fileContentCache.clear();
    this.fileExistsCache.clear();
  }
}

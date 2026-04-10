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

  constructor(adapter: StorageAdapter, ttlSeconds: number = 300) {
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
    // 先尝试使用缓存
    if (this.listFilesCache && !this.isExpired(this.listFilesCache)) {
      console.log('[CachedStorage] Using cached file list');
      return this.listFilesCache.value;
    }

    try {
      const files = await this.adapter.listFiles();
      this.listFilesCache = { value: files, timestamp: Date.now() };
      return files;
    } catch (error) {
      // 如果适配器失败但有缓存，使用过期缓存作为后备
      if (this.listFilesCache) {
        console.warn('[CachedStorage] listFiles failed, using stale cache:', error);
        return this.listFilesCache.value;
      }
      throw error;
    }
  }

  async readFile(slug: string): Promise<string> {
    // 先尝试使用缓存
    const cached = this.fileContentCache.get(slug);
    if (cached && !this.isExpired(cached)) {
      console.log('[CachedStorage] Using cached content for:', slug);
      return cached.value;
    }

    try {
      const content = await this.adapter.readFile(slug);
      this.fileContentCache.set(slug, {
        value: content,
        timestamp: Date.now(),
      });
      return content;
    } catch (error) {
      // 如果适配器失败但有缓存，使用过期缓存作为后备
      if (cached) {
        console.warn('[CachedStorage] readFile failed for', slug, 'using stale cache:', error);
        return cached.value;
      }
      throw error;
    }
  }

  async fileExists(slug: string): Promise<boolean> {
    // 先尝试使用缓存
    const cached = this.fileExistsCache.get(slug);
    if (cached && !this.isExpired(cached)) {
      return cached.value;
    }

    try {
      const exists = await this.adapter.fileExists(slug);
      this.fileExistsCache.set(slug, { value: exists, timestamp: Date.now() });
      return exists;
    } catch (error) {
      // 如果适配器失败但有缓存，使用过期缓存作为后备
      if (cached) {
        console.warn('[CachedStorage] fileExists failed for', slug, 'using stale cache:', error);
        return cached.value;
      }
      throw error;
    }
  }

  clearCache(): void {
    this.listFilesCache = null;
    this.fileContentCache.clear();
    this.fileExistsCache.clear();
  }
}

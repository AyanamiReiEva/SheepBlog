import { StorageAdapter } from './types';

export class FallbackStorageAdapter implements StorageAdapter {
  private primary: StorageAdapter;
  private fallback: StorageAdapter;

  constructor(primary: StorageAdapter, fallback: StorageAdapter) {
    this.primary = primary;
    this.fallback = fallback;
  }

  async isAvailable(): Promise<boolean> {
    const primaryAvailable = await this.primary.isAvailable();
    const fallbackAvailable = await this.fallback.isAvailable();
    return primaryAvailable || fallbackAvailable;
  }

  async listFiles(): Promise<string[]> {
    const [primaryFiles, fallbackFiles] = await Promise.allSettled([
      this.primary.listFiles(),
      this.fallback.listFiles(),
    ]);

    const files = new Set<string>();

    if (primaryFiles.status === 'fulfilled') {
      primaryFiles.value.forEach((file) => files.add(file));
    } else {
      console.warn('Primary storage failed for listFiles:', primaryFiles.reason);
    }

    if (fallbackFiles.status === 'fulfilled') {
      fallbackFiles.value.forEach((file) => files.add(file));
    }

    return Array.from(files);
  }

  async readFile(path: string): Promise<string> {
    // 先尝试主存储
    try {
      const primaryAvailable = await this.primary.isAvailable();
      if (primaryAvailable) {
        try {
          const primaryExists = await this.primary.fileExists(path);
          if (primaryExists) {
            return await this.primary.readFile(path);
          }
        } catch (error) {
          console.warn(`Primary storage file check failed for readFile(${path}):`, error);
        }
      }
    } catch (error) {
      console.warn(`Primary storage availability check failed:`, error);
    }

    // 回退到备用存储
    console.log(`Falling back to local storage for file: ${path}`);
    return await this.fallback.readFile(path);
  }

  async fileExists(path: string): Promise<boolean> {
    // 先检查主存储
    try {
      const primaryExists = await this.primary.fileExists(path);
      if (primaryExists) {
        return true;
      }
    } catch (error) {
      console.warn(`Primary storage failed for fileExists(${path}):`, error);
    }

    // 再检查备用存储
    return await this.fallback.fileExists(path);
  }
}

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
    // 先尝试主存储
    let primaryFiles: string[] = [];
    try {
      primaryFiles = await this.primary.listFiles();
    } catch (error) {
      console.warn('Primary storage failed for listFiles, using fallback only:', error);
    }

    // 总是获取备用存储的文件
    let fallbackFiles: string[] = [];
    try {
      fallbackFiles = await this.fallback.listFiles();
    } catch (error) {
      console.error('Fallback storage also failed for listFiles:', error);
    }

    // 合并文件，优先使用主存储的文件，备用存储作为补充
    const files = new Set<string>();
    primaryFiles.forEach((file) => files.add(file));
    fallbackFiles.forEach((file) => files.add(file));

    const result = Array.from(files);
    console.log(
      `[FallbackStorage] Combined ${result.length} files (primary: ${primaryFiles.length}, fallback: ${fallbackFiles.length})`
    );
    return result;
  }

  async readFile(path: string): Promise<string> {
    // 先检查主存储中文件是否存在
    try {
      const primaryExists = await this.primary.fileExists(path);
      if (primaryExists) {
        try {
          return await this.primary.readFile(path);
        } catch (error) {
          console.warn(`Primary storage file exists but read failed for ${path}:`, error);
        }
      }
    } catch (error) {
      console.warn(`Primary storage fileExists check failed for ${path}:`, error);
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
    try {
      return await this.fallback.fileExists(path);
    } catch (error) {
      console.warn(`Fallback storage also failed for fileExists(${path}):`, error);
      return false;
    }
  }
}

import { StorageAdapter } from './types';

export class FallbackStorageAdapter implements StorageAdapter {
  private primary: StorageAdapter;
  private fallback: StorageAdapter;
  private usingFallback: boolean = false;

  constructor(primary: StorageAdapter, fallback: StorageAdapter) {
    this.primary = primary;
    this.fallback = fallback;
  }

  private async withFallback<T>(
    operation: (adapter: StorageAdapter) => Promise<T>,
    operationName: string
  ): Promise<T> {
    if (!this.usingFallback) {
      try {
        return await operation(this.primary);
      } catch (error) {
        console.warn(`Primary storage failed for ${operationName}, falling back to local storage:`, error);
        this.usingFallback = true;
      }
    }
    return await operation(this.fallback);
  }

  async isAvailable(): Promise<boolean> {
    const primaryAvailable = await this.primary.isAvailable();
    if (primaryAvailable) {
      this.usingFallback = false;
      return true;
    }
    this.usingFallback = true;
    return await this.fallback.isAvailable();
  }

  async listFiles(): Promise<string[]> {
    return this.withFallback(
      (adapter) => adapter.listFiles(),
      'listFiles'
    );
  }

  async readFile(path: string): Promise<string> {
    return this.withFallback(
      (adapter) => adapter.readFile(path),
      `readFile(${path})`
    );
  }

  async fileExists(path: string): Promise<boolean> {
    return this.withFallback(
      (adapter) => adapter.fileExists(path),
      `fileExists(${path})`
    );
  }

  isUsingFallback(): boolean {
    return this.usingFallback;
  }
}

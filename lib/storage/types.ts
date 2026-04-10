export interface StorageAdapter {
  listFiles(): Promise<string[]>;
  readFile(path: string): Promise<string>;
  fileExists(path: string): Promise<boolean>;
  isAvailable(): Promise<boolean>;
}

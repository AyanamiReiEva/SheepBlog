import config from '@/config';
import { StorageAdapter } from './types';
import { LocalStorageAdapter } from './local';
import { JianguoyunStorageAdapter, JianguoyunConfig } from './jianguoyun';
import { FallbackStorageAdapter } from './fallback';
import { CachedStorageAdapter } from './cached';

let storageInstance: StorageAdapter | null = null;

function createJianguoyunAdapter(): JianguoyunStorageAdapter {
  const jgyConfig = config.storage.jianguoyun;
  if (!jgyConfig.username || !jgyConfig.password) {
    throw new Error('Jianguoyun storage requires username and password to be configured');
  }
  return new JianguoyunStorageAdapter({
    webdavUrl: jgyConfig.webdavUrl,
    username: jgyConfig.username,
    password: jgyConfig.password,
    basePath: jgyConfig.basePath,
  });
}

function createStorageAdapter(): StorageAdapter {
  const localAdapter = new LocalStorageAdapter();

  let adapter: StorageAdapter;

  if (config.storage.primary === 'jianguoyun') {
    try {
      const jianguoyunAdapter = createJianguoyunAdapter();
      adapter = new FallbackStorageAdapter(jianguoyunAdapter, localAdapter);
    } catch (error) {
      console.warn(
        'Failed to initialize Jianguoyun storage, falling back to local storage:',
        error
      );
      adapter = localAdapter;
    }
  } else {
    adapter = localAdapter;
  }

  // 添加缓存包装，60秒缓存
  return new CachedStorageAdapter(adapter, 60);
}

export function getStorage(): StorageAdapter {
  if (!storageInstance) {
    storageInstance = createStorageAdapter();
  }
  return storageInstance;
}

export type { StorageAdapter } from './types';
export { LocalStorageAdapter } from './local';
export { JianguoyunStorageAdapter } from './jianguoyun';
export { FallbackStorageAdapter } from './fallback';

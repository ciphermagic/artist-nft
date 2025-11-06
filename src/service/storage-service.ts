import { STORAGE_CONFIG } from '../config';
import type { NftMeta } from './types';
import { IpfsStorageService } from './ipfs-service.ts';
import { ArweaveStorageService } from './arweave-service.ts';

/**
 * 统一存储服务接口
 * 为IPFS和Arweave提供一致的API
 */
export interface IStorageService {
  storeMeta(data: NftMeta): Promise<string>;
  storeNftImage(file: File): Promise<string>;
  storeArticle(content: string): Promise<string>;
}

/**
 * 存储服务实例缓存
 */
let storageInstance: IStorageService | null = null;

/**
 * 获取存储服务实例（单例模式）
 * 根据配置自动选择IPFS或Arweave服务
 */
const getStorageService = (): IStorageService => {
  if (!storageInstance) {
    const provider = STORAGE_CONFIG.provider;

    switch (provider) {
      case 'ipfs':
        storageInstance = new IpfsStorageService();
        break;
      case 'arweave':
        storageInstance = new ArweaveStorageService();
        break;
      default:
        throw new Error(`不支持的存储服务提供商: ${provider}`);
    }

    console.log(`使用存储服务: ${provider}`);
  }

  return storageInstance;
};

export const storeMeta = async (data: NftMeta): Promise<string> => {
  const service = getStorageService();
  return await service.storeMeta(data);
};

export const storeNftImage = async (file: File): Promise<string> => {
  const service = getStorageService();
  return await service.storeNftImage(file);
};

export const storeArticle = async (content: string): Promise<string> => {
  const service = getStorageService();
  return await service.storeArticle(content);
};

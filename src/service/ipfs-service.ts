import { create as ipfsHttpClient } from 'ipfs-http-client';
import type { IPFSHTTPClient } from 'ipfs-http-client';
import { IPFS } from '../config.ts';
import type { NftMeta } from './types.ts';
import type { IStorageService } from './storage-service.ts';

// IPFS客户端实例
let ipfsClient: IPFSHTTPClient | null = null;

export class IpfsStorageService implements IStorageService {
  async storeMeta(data: NftMeta): Promise<string> {
    try {
      const json = JSON.stringify(data);
      return await addToIpfs(json);
    } catch (error) {
      console.error('IPFS存储失败:', error);
      throw new Error(`IPFS存储失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  async storeNftImage(file: File): Promise<string> {
    return await addToIpfs(file);
  }

  async storeArticle(content: string): Promise<string> {
    return await addToIpfs(content);
  }
}

/**
 * 获取IPFS客户端实例（单例模式）
 */
const getIpfsClient = (): IPFSHTTPClient => {
  if (!ipfsClient) {
    try {
      ipfsClient = ipfsHttpClient({
        host: IPFS.domain,
        port: 5001,
        protocol: 'http',
      });
    } catch (error) {
      console.error('Failed to create IPFS client:', error);
      throw new Error('无法连接到IPFS服务');
    }
  }
  return ipfsClient;
};

/**
 * 将文件或数据添加到IPFS
 * @param data - 要存储的文件或字符串数据
 * @returns 完整的IPFS URL
 * @throws 当IPFS存储失败时抛出错误
 */
const addToIpfs = async (data: File | string): Promise<string> => {
  try {
    const client = getIpfsClient();
    const added = await client.add(data);
    const cid = added.path;
    const fullUrl = IPFS.url_prefix + cid;

    console.log('IPFS存储成功:', fullUrl);
    return fullUrl;
  } catch (error) {
    console.error('IPFS存储失败:', error);
    throw new Error(`IPFS存储失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

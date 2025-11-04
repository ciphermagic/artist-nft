import { create as ipfsHttpClient } from 'ipfs-http-client';
import type { IPFSHTTPClient } from 'ipfs-http-client';
import { IPFS } from '../config.ts';

// IPFS客户端实例
let ipfsClient: IPFSHTTPClient | null = null;

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
 * 用户元数据接口
 */
interface UserMeta {
  name: string;
  [key: string]: string | number | boolean | null | undefined; // 支持扩展其他属性
}

/**
 * 将用户元数据存储到IPFS（调试用途）
 * @param data - 用户元数据对象
 */
export const storeMeta = async (data: UserMeta): Promise<void> => {
  console.log('Storing user meta to IPFS:', data);

  try {
    const json = JSON.stringify(data);
    const client = getIpfsClient();
    const added = await client.add(json);

    console.log('User meta stored successfully, CID:', added.path);
    alert(`User meta stored successfully: ${added.path}`);
  } catch (error) {
    console.error('IPFS存储失败:', error);
    alert(`IPFS存储失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

/**
 * 将文件或数据添加到IPFS
 * @param data - 要存储的文件或字符串数据
 * @returns 完整的IPFS URL
 * @throws 当IPFS存储失败时抛出错误
 */
export const addToIpfs = async (data: File | string): Promise<string> => {
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

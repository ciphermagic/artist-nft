import Arweave from 'arweave';
import { ARWEAVE } from '../config';
import type { IStorageService } from './storage-service.ts';
import type { NftMeta } from './types.ts';
import { ArweaveWebWallet } from 'arweave-wallet-connector';

const wallet = new ArweaveWebWallet({
  name: 'Artist NFT',
  logo: 'logo',
});
wallet.setUrl('arweave.app');
wallet.keepPopup = false;

const arweave = Arweave.init({
  host: ARWEAVE.domain,
  port: ARWEAVE.port,
  protocol: ARWEAVE.protocol,
});

type Entity = string | Uint8Array | ArrayBuffer;
type Tags = { [key: string]: string };

export class ArweaveStorageService implements IStorageService {
  async storeMeta(data: NftMeta): Promise<string> {
    const json = JSON.stringify(data);
    const tags = { 'Content-Type': 'text/json', 'Domain-Type': 'meta' };
    return await toArweave(json, tags);
  }

  async storeNftImage(file: File): Promise<string> {
    const data = await readImageFile(file);
    const tags = { 'Content-Type': 'image/jpeg', 'Domain-Type': 'nft-image' };
    return await toArweave(data, tags);
  }

  async storeArticle(content: string): Promise<string> {
    const tags = { 'Content-Type': 'text/html', 'Domain-Type': 'article' };
    return await toArweave(content, tags);
  }
}

const connectWallet = async () => {
  if (!wallet.connected) {
    await wallet.connect();
  }
};

const readImageFile = (file: File): Promise<ArrayBuffer> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Invalid result type'));
      }
    };
    reader.onerror = event => {
      reject(event);
    };
    reader.readAsArrayBuffer(file);
  });
};

export const toArweave = async (entity: Entity, tags: Tags) => {
  await connectWallet();
  const tx = await arweave.createTransaction({
    data: entity,
  });
  Object.keys(tags).map(k => {
    tx.addTag(k, tags[k]);
  });
  await arweave.transactions.sign(tx);
  const response = await arweave.transactions.post(tx);
  console.log(response);
  return ARWEAVE.url_prefix + tx.id;
};

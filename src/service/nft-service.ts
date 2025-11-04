import type { Nft, NftMeta } from './types.ts';
import { trying } from './connection-service.ts';
import { ethers } from 'ethers';
import { type ArtistNFT, ArtistNFT__factory } from '../typechain-types';
import { configuration, rpcUrl } from '../config.ts';
import axios, { type AxiosResponse } from 'axios';
import { messageBox } from './message-service.ts';

export const getContract = (signerOrProvider: ethers.ContractRunner | ethers.AbstractProvider): ArtistNFT => {
  return ArtistNFT__factory.connect(configuration().nftAddress, signerOrProvider);
};

export const ownedNft = async (): Promise<{
  success: boolean;
  data: Nft[];
}> => {
  const { success, signer } = await trying(false);
  if (!success || !signer) {
    return { success: false, data: [] };
  }
  const address: string = await signer.getAddress();
  const contract: ArtistNFT = getContract(signer);
  const count: bigint = await contract.balanceOf(address);
  const number: number = Number(count);
  const result: Nft[] = await Promise.all(
    Array.from({ length: number }, async (_, i: number): Promise<Nft> => {
      const tokenId: string = await contract.tokenOfOwnerByIndex(address, i).then(i => i.toString());
      const tokenUri: string = await contract.tokenURI(tokenId);
      const meta: AxiosResponse<NftMeta> = await axios.get(tokenUri);
      return {
        ...meta.data,
        tokenId: tokenId,
        tokenUri: tokenUri,
      };
    })
  );
  return { success: true, data: result };
};

export const totalNftByType = async (type: string): Promise<{ success: boolean; data: Nft[] }> => {
  const provider = new ethers.JsonRpcProvider(rpcUrl());
  const contract = getContract(provider);
  const number: number = await totalSupply();
  const data: Nft[] = await Promise.all(
    Array.from({ length: number }, async (_, i: number): Promise<Nft> => {
      const tokenId: string = await contract.tokenByIndex(i).then(i => i.toString());
      const tokenUri: string = await contract.tokenURI(tokenId);
      const owner: string = await contract.ownerOf(tokenId);
      const meta: AxiosResponse<NftMeta> = await axios.get(tokenUri);
      return {
        ...meta.data,
        owner: owner,
        tokenId: tokenId,
        tokenUri: tokenUri,
      };
    })
  );
  const result = data.filter((e: Nft) => e.type === type);
  return { success: true, data: result };
};

export const ownedNftByType = async (type: string): Promise<{ success: boolean; data: Nft[] }> => {
  const { success, data } = await ownedNft();
  if (!success) {
    return { success, data };
  }
  const rst = data.filter((e: Nft) => e.type === type);
  return { success: true, data: rst };
};

export const totalSupply = async (): Promise<number> => {
  const provider = new ethers.JsonRpcProvider(rpcUrl());
  const contract = getContract(provider);
  const totalSupply = await contract.totalSupply();
  return Number(totalSupply);
};

export const mintNft = async (
  tokenUri: string
): Promise<{
  success: boolean;
  tokenId?: number;
}> => {
  const { success, signer } = await trying(false);
  if (!success || !signer) {
    return { success: false };
  }
  const address: string = await signer.getAddress();
  const contract: ArtistNFT = getContract(signer);
  const transaction = await contract.mint(address, tokenUri);
  const tx = await transaction.wait(1);
  const event = tx?.logs.map(log => contract.interface.parseLog(log)).find(parsedLog => parsedLog?.name === 'Transfer');
  if (event) {
    const value = event.args[2];
    const tokenId = Number(value);
    await messageBox('success', '', `铸币成功，ID: ${tokenId}`);
    return { success: true, tokenId: tokenId };
  } else {
    await messageBox('danger', '', '事件解析失败');
    return { success: false };
  }
};

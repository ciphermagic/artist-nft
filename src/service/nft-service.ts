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
      const royaltyInfoResult = await getTokenRoyaltyInfo(tokenId);
      return {
        ...meta.data,
        tokenId: tokenId,
        tokenUri: tokenUri,
        royaltyInfo: royaltyInfoResult.success
          ? {
              receiver: royaltyInfoResult.receiver,
              royaltyAmount: royaltyInfoResult.royaltyAmount,
            }
          : undefined,
      };
    }),
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
      const royaltyInfoResult = await getTokenRoyaltyInfo(tokenId);
      return {
        ...meta.data,
        owner: owner,
        tokenId: tokenId,
        tokenUri: tokenUri,
        royaltyInfo: royaltyInfoResult.success
          ? {
              receiver: royaltyInfoResult.receiver,
              royaltyAmount: royaltyInfoResult.royaltyAmount,
            }
          : undefined,
      };
    }),
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

// 读取版税配置
export const getRoyaltyFraction = async (): Promise<{ success: boolean; fraction: number }> => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl());
    const contract = getContract(provider);
    const fraction = await contract.royaltyFraction();
    return { success: true, fraction: Number(fraction) };
  } catch (error) {
    console.error('获取版税比例失败:', error);
    return { success: false, fraction: 0 };
  }
};

// 获取特定NFT的版税信息
export const getTokenRoyaltyInfo = async (
  tokenId: string,
  salePrice: string = '1000000000000000000',
): Promise<{ success: boolean; receiver: string; royaltyAmount: string }> => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl());
    const contract = getContract(provider);
    const result = await contract.royaltyInfo(tokenId, salePrice);
    return { success: true, receiver: result.receiver, royaltyAmount: result.amount.toString() };
  } catch (error) {
    console.error('获取NFT版税信息失败:', error);
    return { success: false, receiver: '', royaltyAmount: '0' };
  }
};

export const getFeeRate = async (): Promise<{ success: boolean; feeRate: string }> => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl());
    const contract = getContract(provider);
    const feeRate = await contract.feeRate();
    return { success: true, feeRate: feeRate.toString() };
  } catch (error) {
    console.error('获取铸造费用失败:', error);
    return { success: false, feeRate: '0' };
  }
};

export const getFeeCollector = async (): Promise<{ success: boolean; collector: string }> => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl());
    const contract = getContract(provider);
    const collector = await contract.feeCollector();
    return { success: true, collector };
  } catch (error) {
    console.error('获取费用收集者失败:', error);
    return { success: false, collector: '' };
  }
};

// 设置版税配置（仅合约所有者）
export const setRoyaltyFraction = async (fraction: number): Promise<{ success: boolean }> => {
  try {
    const { success, signer } = await trying(false);
    if (!success || !signer) {
      await messageBox('danger', '', '请先连接钱包');
      return { success: false };
    }
    const contract = getContract(signer);
    const tx = await contract.setFeeRoyaltyFraction(fraction);
    await tx.wait(1);
    await messageBox('success', '', '版税比例设置成功');
    return { success: true };
  } catch (error) {
    console.error('设置版税比例失败:', error);
    await messageBox('danger', '', `设置失败: ${error || '未知错误'}`);
    return { success: false };
  }
};

export const setFeeRate = async (feeRate: string): Promise<{ success: boolean }> => {
  try {
    const { success, signer } = await trying(false);
    if (!success || !signer) {
      await messageBox('danger', '', '请先连接钱包');
      return { success: false };
    }
    const contract = getContract(signer);
    const tx = await contract.setFeeRate(feeRate);
    await tx.wait(1);
    await messageBox('success', '', '铸造费用设置成功');
    return { success: true };
  } catch (error) {
    console.error('设置铸造费用失败:', error);
    await messageBox('danger', '', `设置失败: ${error || '未知错误'}`);
    return { success: false };
  }
};

export const setFeeCollector = async (collector: string): Promise<{ success: boolean }> => {
  try {
    const { success, signer } = await trying(false);
    if (!success || !signer) {
      await messageBox('danger', '', '请先连接钱包');
      return { success: false };
    }
    const contract = getContract(signer);
    const tx = await contract.setFeeCollector(collector);
    await tx.wait(1);
    await messageBox('success', '', '费用收集者设置成功');
    return { success: true };
  } catch (error) {
    console.error('设置费用收集者失败:', error);
    await messageBox('danger', '', `设置失败: ${error || '未知错误'}`);
    return { success: false };
  }
};

// 获取合约余额
export const getContractBalance = async (): Promise<{ success: boolean; balance: string }> => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl());
    const contract = getContract(provider);
    const contractAddress = await contract.getAddress();
    const balance = await provider.getBalance(contractAddress);
    return { success: true, balance: balance.toString() };
  } catch (error) {
    console.error('获取合约余额失败:', error);
    return { success: false, balance: '0' };
  }
};

// 提取合约资金（仅费用收集者）
export const withdrawFees = async (): Promise<{ success: boolean }> => {
  try {
    const { success, signer } = await trying(false);
    if (!success || !signer) {
      await messageBox('danger', '', '请先连接钱包');
      return { success: false };
    }
    const contract = getContract(signer);
    const tx = await contract.withdraw();
    await tx.wait(1);
    await messageBox('success', '', '资金提取成功');
    return { success: true };
  } catch (error) {
    console.error('提取资金失败:', error);
    await messageBox('danger', '', `提取失败: ${error || '未知错误'}`);
    return { success: false };
  }
};

// 铸造NFT（支持费用支付）
export const mintNft = async (
  tokenUri: string,
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

  // 获取铸造费用
  const feeRateResult = await getFeeRate();
  if (!feeRateResult.success) {
    await messageBox('danger', '', '无法获取铸造费用');
    return { success: false };
  }

  const transaction = await contract.mint(address, tokenUri, { value: feeRateResult.feeRate });
  const tx = await transaction.wait(1);
  const event = tx?.logs.map(log => contract.interface.parseLog(log)).find(parsedLog => parsedLog?.name === 'Transfer');
  if (event) {
    const value = event.args[2];
    const tokenId = Number(value);
    return { success: true, tokenId: tokenId };
  } else {
    return { success: false };
  }
};

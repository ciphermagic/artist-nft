export type Nft = {
  tokenId: string;
  tokenUri: string;
  name: string;
  description: string;
  imageUri: string;
  uri: string;
  type: string;
  owner?: string;
};

export type NftMeta = {
  name: string;
  description: string;
  imageUri: string;
  uri: string;
  type: string;
};

export type Scratch = {
  key: number;
  index: number;
  title: string;
  content: string;
};

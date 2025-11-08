// opensea-types.ts
export type NFT = {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url: string;
  display_image_url: string;
  display_animation_url: string;
  metadata_url: string;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
};

export type Payment = {
  quantity: string;
  token_address: string;
  decimals: number;
  symbol: string;
};

export type Trait = {
  type: string;
  value: string;
};

export type Criteria = {
  collection?: { slug: string };
  contract?: { address: string };
  trait?: Trait;
  traits?: Trait[];
  traitList?: Trait[];
};

export type AssetEvent = {
  event_type: string;
  event_timestamp: number;
  transaction: string | null;
  order_hash: string | null;
  protocol_address: string | null;
  chain: string;
  payment?: Payment;
  order_type?: string;
  start_date?: number;
  expiration_date?: number;
  asset?: NFT;
  quantity: number;
  maker?: string;
  taker?: string;
  criteria?: Criteria;
  is_private_listing?: boolean;
  closing_date?: number;
  seller?: string;
  buyer?: string;
  nft?: NFT;
  from_address?: string;
  to_address?: string;
};

export type EventsResponse = {
  asset_events: AssetEvent[];
  next: string | null;
};

export type StatsTotal = {
  volume: number;
  sales: number;
  num_owners: number;
  market_cap: number;
  floor_price: number;
  floor_price_symbol: string;
  average_price: number;
};

export type StatsInterval = {
  interval: string;
  volume: number;
  volume_diff: number;
  volume_change: number;
  sales: number;
  sales_diff: number;
  average_price: number;
};

export type CollectionStatsResponse = {
  total: StatsTotal;
  intervals: StatsInterval[];
};

export type Contract = {
  address: string;
  chain: string;
};

export type Fee = {
  fee: number;
  recipient: string;
  required: boolean;
};

export type Rarity = {
  calculated_at: string;
  max_rank: number;
  total_supply: number;
  strategy_id: string;
  strategy_version: string;
};

export type PaymentToken = {
  symbol: string;
  address: string;
  chain: string;
  image: string;
  name: string;
  decimals: number;
  eth_price: string;
  usd_price: string;
};

export type BaseCollection = {
  collection: string;
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string;
  owner: string;
  safelist_status: string;
  category: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  trait_offers_enabled: boolean;
  collection_offers_enabled: boolean;
  opensea_url: string;
  project_url: string;
  wiki_url: string;
  discord_url: string;
  telegram_url: string;
  twitter_username: string;
  instagram_username: string;
  contracts: Contract[];
};

export type DetailedCollection = BaseCollection & {
  editors: string[];
  fees: Fee[];
  required_zone: string;
  rarity: Rarity;
  total_supply: number;
  created_date: string;
  payment_tokens: PaymentToken[];
};

export type CollectionsResponse = {
  collections: BaseCollection[];
  next: string | null;
};

export type NFTsResponse = {
  nfts: NFT[];
  next: string | null;
};

export type NFTResponse = {
  nfts: NFT[];
  next: string | null;
};

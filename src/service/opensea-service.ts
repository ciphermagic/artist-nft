import type {
  CollectionStatsResponse,
  EventsResponse,
  DetailedCollection,
  CollectionsResponse,
  NFTsResponse,
  NFTResponse,
} from './opensea-types';
import { OPENSEA_CONFIG } from '../config.ts';

const API_BASE = OPENSEA_CONFIG.baseUrl;

const getApiKey = (): string => {
  const apiKey = OPENSEA_CONFIG.apiKey;
  if (!apiKey) {
    throw new Error('OpenSea API key is missing');
  }
  return apiKey;
};

const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  }
  return searchParams.toString();
};

const apiFetch = async <T>(url: string): Promise<T> => {
  const apiKey = getApiKey();
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return (await response.json()) as Promise<T>;
};

export async function getCollectionStats(slug: string): Promise<CollectionStatsResponse> {
  const url = `${API_BASE}/collections/${slug}/stats`;
  return apiFetch<CollectionStatsResponse>(url);
}

export async function getEventsByCollection(
  slug: string,
  params: {
    after?: number;
    before?: number;
    event_type?: string[];
    next?: string;
    limit?: number;
  } = {},
): Promise<EventsResponse> {
  const query = buildQueryString(params);
  const url = `${API_BASE}/events/collection/${slug}${query ? `?${query}` : ''}`;
  return apiFetch<EventsResponse>(url);
}

export async function getEventsByNFT(
  chain: string,
  address: string,
  identifier: string,
  params: {
    after?: number;
    before?: number;
    event_type?: string[];
    next?: string;
    limit?: number;
  } = {},
): Promise<EventsResponse> {
  const query = buildQueryString(params);
  const url = `${API_BASE}/events/chain/${chain}/contract/${address}/nfts/${identifier}${query ? `?${query}` : ''}`;
  return apiFetch<EventsResponse>(url);
}

export async function getEventsByAccount(
  address: string,
  params: {
    after?: number;
    before?: number;
    event_type?: string[];
    chain?: string;
    next?: string;
    limit?: number;
  } = {},
): Promise<EventsResponse> {
  const query = buildQueryString(params);
  const url = `${API_BASE}/events/accounts/${address}${query ? `?${query}` : ''}`;
  return apiFetch<EventsResponse>(url);
}

export async function getEvents(
  params: {
    after?: number;
    before?: number;
    event_type?: string[];
    next?: string;
    limit?: number;
  } = {},
): Promise<EventsResponse> {
  const query = buildQueryString(params);
  const url = `${API_BASE}/events${query ? `?${query}` : ''}`;
  return apiFetch<EventsResponse>(url);
}

export async function getSingleCollection(slug: string): Promise<DetailedCollection> {
  const url = `${API_BASE}/collections/${slug}`;
  return apiFetch<DetailedCollection>(url);
}

export async function getMultipleCollections(
  params: {
    next?: string;
    limit?: number;
    chain?: string;
    creator_username?: string;
    include_hidden?: boolean;
    order_by?: string;
  } = {},
): Promise<CollectionsResponse> {
  const query = buildQueryString(params);
  const url = `${API_BASE}/collections${query ? `?${query}` : ''}`;
  return apiFetch<CollectionsResponse>(url);
}

export async function getNFTsByCollection(
  slug: string,
  params: {
    next?: string;
    limit?: number;
  } = {},
): Promise<NFTsResponse> {
  const query = buildQueryString(params);
  const url = `${API_BASE}/collection/${slug}/nfts${query ? `?${query}` : ''}`;
  return apiFetch<NFTsResponse>(url);
}

export async function getNFT(chain: string, address: string, identifier: string): Promise<NFTResponse> {
  const url = `${API_BASE}/chain/${chain}/contract/${address}/nfts/${identifier}`;
  return apiFetch<NFTResponse>(url);
}

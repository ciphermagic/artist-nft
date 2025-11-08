import { useEffect, useState } from 'react';
import { getCollectionStats, getEventsByCollection, getNFTsByCollection } from '../service/opensea-service';
import type { CollectionStatsResponse, EventsResponse, NFTsResponse, AssetEvent, NFT } from '../service/opensea-types';

function NftMarket() {
  const [slug, setSlug] = useState<string>('boredapeyachtclub');
  const [stats, setStats] = useState<CollectionStatsResponse | null>(null);
  const [events, setEvents] = useState<EventsResponse | null>(null);
  const [nfts, setNfts] = useState<NFTsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!slug.trim()) {
      setError('Please enter a collection slug');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const processedSlug = slug.replace(/\s+/g, '').toLowerCase();
      const [statsData, eventsData, nftsData] = await Promise.all([
        getCollectionStats(processedSlug),
        getEventsByCollection(processedSlug, { limit: 10 }),
        getNFTsByCollection(processedSlug, { limit: 10 }),
      ]);
      setStats(statsData);
      setEvents(eventsData);
      setNfts(nftsData);
    } catch (err) {
      setError('Failed to fetch data. Please check the slug and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      void fetchData();
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div>
        <label htmlFor='slug'>收藏集: </label>
        <input
          id='slug'
          type='text'
          value={slug}
          onChange={e => setSlug(e.target.value)}
          placeholder='e.g., boredapeyachtclub'
          style={{ marginRight: '10px' }}
        />
        <button onClick={fetchData} disabled={loading}>
          {loading ? 'Loading...' : '搜索'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {stats && (
        <div style={{ marginTop: '20px' }}>
          <h2>收藏统计</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>指标</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>价值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Total Volume</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stats.total.volume}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Total Sales</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stats.total.sales}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Number of Owners</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stats.total.num_owners}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Market Cap</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stats.total.market_cap}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Floor Price</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {stats.total.floor_price} {stats.total.floor_price_symbol}
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Average Price</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stats.total.average_price}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {events && events.asset_events.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>近期事件</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Timestamp</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Payment</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>NFT Name</th>
              </tr>
            </thead>
            <tbody>
              {events.asset_events.map((event: AssetEvent, index: number) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.event_type}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {new Date(event.event_timestamp * 1000).toLocaleString()}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.quantity}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {event.payment ? `${event.payment.quantity} ${event.payment.symbol}` : 'N/A'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {event.nft?.name || event.asset?.name || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {nfts && nfts.nfts.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>NFT收藏</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Image</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Identifier</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {nfts.nfts.map((nft: NFT, index: number) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {nft.image_url && (
                      <img src={nft.image_url} alt={nft.name} style={{ width: '50px', height: '50px' }} />
                    )}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{nft.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{nft.identifier}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{nft.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default NftMarket;

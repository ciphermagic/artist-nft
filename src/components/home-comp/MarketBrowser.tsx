import React, { useState, useEffect } from 'react';
import { getMultipleCollections, getCollectionStats, getNFTsByCollection } from '../../service/opensea-service';
import type { BaseCollection, CollectionStatsResponse, NFT } from '../../service/opensea-types';
import { Card, Col, Row, Spin, Alert, Button, Typography, Image, Space, Statistic, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface EnhancedCollection extends BaseCollection {
  stats?: CollectionStatsResponse;
}

const MarketBrowser: React.FC = () => {
  const [collections, setCollections] = useState<EnhancedCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<EnhancedCollection | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMultipleCollections({
          chain: 'ethereum',
          limit: 20,
          order_by: 'seven_day_volume',
        });

        const enhanced = await Promise.all(
          response.collections.map(async (col: BaseCollection) => {
            try {
              const stats = await getCollectionStats(col.collection);
              return { ...col, stats };
            } catch {
              return col;
            }
          }),
        );
        setCollections(enhanced);
      } catch (err) {
        setError('Failed to fetch collections.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void fetchCollections();
  }, []);

  const fetchNFTs = async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNFTsByCollection(slug, { limit: 50 });
      setNfts(response.nfts);
    } catch (err) {
      setError('Failed to fetch NFTs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCollection = (col: EnhancedCollection) => {
    setSelectedCollection(col);
    void fetchNFTs(col.collection);
  };

  const handleBack = () => {
    setSelectedCollection(null);
    setNfts([]);
  };

  if (loading && collections.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Spin size='large' />
        <div style={{ marginTop: 16 }}>
          <Text type='secondary'>Loading collections...</Text>
        </div>
      </div>
    );
  }

  if (error && collections.length === 0) {
    return (
      <div style={{ padding: '40px' }}>
        <Alert message='Error' description={error} type='error' showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {!selectedCollection ? (
        <>
          <Title level={4}>热门系列</Title>
          {collections.length === 0 ? (
            <Empty description='No collections found' />
          ) : (
            <Row gutter={[16, 16]}>
              {collections.map((col: EnhancedCollection) => (
                <Col xs={16} sm={8} md={6} lg={4} key={col.collection}>
                  <Card
                    hoverable
                    onClick={() => handleSelectCollection(col)}
                    cover={
                      col.image_url ? (
                        <div style={{ height: 180, overflow: 'hidden' }}>
                          <Image
                            src={col.image_url}
                            alt={col.name}
                            preview={false}
                            style={{ height: 180, overflow: 'hidden' }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            height: 200,
                            background: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text type='secondary'>No Image</Text>
                        </div>
                      )
                    }
                    styles={{ body: { padding: '16px' } }}
                  >
                    <Card.Meta
                      title={<Text strong>{col.name}</Text>}
                      description={
                        <Space direction='vertical' size={4} style={{ width: '100%' }}>
                          {col.stats ? (
                            <>
                              <Statistic
                                title='Floor Price'
                                value={col.stats.total.floor_price}
                                suffix={col.stats.total.floor_price_symbol}
                                valueStyle={{ fontSize: 14 }}
                                precision={2}
                              />
                              <Statistic
                                title='Total Volume'
                                value={col.stats.total.volume}
                                valueStyle={{ fontSize: 14 }}
                                precision={2}
                              />
                            </>
                          ) : (
                            <Text type='secondary'>Stats unavailable</Text>
                          )}
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      ) : (
        <>
          <div style={{ marginBottom: 24 }}>
            <Button type='text' icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ padding: 0 }}>
              Back to Collections
            </Button>
          </div>

          <Title level={3}>{selectedCollection.name}</Title>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size='large' />
              <div style={{ marginTop: 16 }}>
                <Text type='secondary'>Loading NFTs...</Text>
              </div>
            </div>
          ) : error ? (
            <Alert message='Error' description={error} type='error' showIcon />
          ) : nfts.length === 0 ? (
            <Empty description='No NFTs found in this collection' />
          ) : (
            <Row gutter={[16, 16]}>
              {nfts.map((nft: NFT) => (
                <Col xs={12} sm={8} md={6} lg={4} key={nft.identifier}>
                  <Card
                    hoverable
                    cover={
                      nft.image_url ? (
                        <div style={{ height: 180, overflow: 'hidden' }}>
                          <Image
                            src={nft.image_url}
                            alt={nft.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            preview={false}
                            fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            height: 180,
                            background: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text type='secondary'>No Image</Text>
                        </div>
                      )
                    }
                    styles={{ body: { padding: '12px' } }}
                  >
                    <Card.Meta
                      title={
                        <Text strong ellipsis style={{ fontSize: 14 }}>
                          {nft.name || `#${nft.identifier}`}
                        </Text>
                      }
                      description={
                        <Space direction='vertical' size={0} style={{ width: '100%' }}>
                          {selectedCollection.stats && (
                            <Text type='secondary' style={{ fontSize: 12 }}>
                              Floor: {selectedCollection.stats.total.floor_price}{' '}
                              {selectedCollection.stats.total.floor_price_symbol}
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default MarketBrowser;

import { Card, Typography } from 'antd';
import { formatEther } from 'ethers';
import type { Nft } from '../../service/types';

const { Meta } = Card;
const { Text } = Typography;

function NftCard({ nft }: { nft: Nft }) {
  return (
    <Card
      style={{
        width: '12.5rem',
        boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.2)',
      }}
      cover={<img style={{ height: '11.5rem' }} alt={nft.name} src={nft.imageUri} />}
    >
      <Meta
        title={nft.name}
        description={
          <div>
            <div>{nft.description}</div>
            {nft.owner && (
              <Text type='secondary'>
                作者: {nft.owner.substring(0, 6)}...
                {nft.owner.substring(nft.owner.length - 4)}
              </Text>
            )}
            {nft.royaltyInfo && (
              <div>
                <Text type='secondary'>版税: {formatEther(nft.royaltyInfo.royaltyAmount)} ETH</Text>
                <br />
                <Text type='secondary'>
                  收益人: {nft.royaltyInfo.receiver.substring(0, 6)}...
                  {nft.royaltyInfo.receiver.substring(nft.royaltyInfo.receiver.length - 4)}
                </Text>
              </div>
            )}
          </div>
        }
      />
    </Card>
  );
}

export default NftCard;

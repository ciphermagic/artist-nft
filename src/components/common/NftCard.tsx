import { Card } from 'antd';
import type { Nft } from '../../service/types';

const { Meta } = Card;

function NftCard({ nft, owner }: { nft: Nft; owner: boolean }) {
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
          owner ? (
            <div
              style={{
                whiteSpace: 'normal', // 允许换行
                wordBreak: 'break-word', // 长词也换行
                lineHeight: 1.5, // 可读性更好
              }}
            >
              {nft.description + ' by ' + nft.owner}
            </div>
          ) : (
            nft.description
          )
        }
      />
    </Card>
  );
}

export default NftCard;

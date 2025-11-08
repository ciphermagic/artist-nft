import NftCard from './NftCard';
import type { Nft } from '../../service/types';
import styles from './NftBrowser.module.css';

function NftBrowser({ nfts }: { nfts: Nft[] }) {
  return (
    <div className={styles.main}>
      {nfts.map(nft => {
        return <NftCard key={nft.tokenId} nft={nft} />;
      })}
    </div>
  );
}

export default NftBrowser;

import { useEffect, useState } from 'react';
import type { Nft } from '../../service/types.ts';
import { ownedNftByType } from '../../service/nft-service.ts';
import NftBrowser from '../common/NftBrowser.tsx';
import { messageBox } from '../../service/message-service.ts';

function ImageNftList() {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadNfts = async () => {
    const ns = await ownedNftByType('image');
    if (ns.success) {
      setNfts(ns.data);
      setTotal(ns.data.length);
    } else {
      await messageBox('danger', '', '获取数据失败');
    }
  };

  useEffect(() => {
    loadNfts().then(() => console.log('Loaded MyNft'));
  }, []);

  return (
    <div className='main'>
      <div style={{ marginBottom: '10px' }}>已铸造：{total}</div>
      <NftBrowser nfts={nfts} owner={false} />
    </div>
  );
}

export default ImageNftList;

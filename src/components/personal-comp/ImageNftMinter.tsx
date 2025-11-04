import { type ChangeEvent, useState } from 'react';
import type { NftMeta } from '../../service/types';
import { messageBox } from '../../service/message-service';
import { addToIpfs } from '../../service/ipfs-service';
import styles from './NftMintor.module.css';
import { Button, Input } from 'antd';
import { mintNft } from '../../service/nft-service.ts';
import { useNavigate } from 'react-router-dom';

function ImageNftMinter() {
  const navigate = useNavigate();
  const [meta, updateMeta] = useState<NftMeta>({ name: '', description: '', imageUri: '', uri: '', type: '' });
  const [uri, setUri] = useState('');

  const store = async (file: File) => {
    try {
      const imageUri = await addToIpfs(file);
      await messageBox('success', '', imageUri);
      setUri(imageUri);
    } catch (error) {
      if (error instanceof Error) {
        await messageBox('danger', '', error.message);
      }
    }
  };

  const mint = async () => {
    try {
      const data: NftMeta = { ...meta, imageUri: uri, type: 'image' };
      const json = JSON.stringify(data);
      const metaUri = await addToIpfs(json);
      await messageBox('success', '', metaUri);
      const { success } = await mintNft(metaUri);
      if (success) {
        navigate('/personal/collectible-browse');
      } else {
        await messageBox('danger', '', '铸币失败');
      }
    } catch (error) {
      if (error instanceof Error) await messageBox('danger', '', error.message);
    }
  };

  return (
    <div className={styles.CreatorWrapper}>
      <div className={styles.CreatorContainer}>
        <Input
          placeholder='Asset Name'
          className={styles.NftField}
          onChange={e => updateMeta({ ...meta, name: e.target.value })}
        />

        <Input.TextArea
          placeholder='Asset Description'
          className={styles.NftField}
          onChange={e => {
            updateMeta({ ...meta, description: e.target.value });
          }}
        />

        <Input
          type='file'
          placeholder='Asset Image'
          className={styles.NftField}
          onChange={async (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              await store(e.target.files[0]);
            }
          }}
        />

        <div className={styles.ImgContainer}>
          <img src={uri} className={styles.NftImage} alt='NFT图片' />
        </div>

        <Button type='primary' onClick={mint}>
          铸币
        </Button>
      </div>
    </div>
  );
}

export default ImageNftMinter;

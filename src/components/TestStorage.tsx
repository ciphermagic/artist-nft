import 'react-notifications-component/dist/theme.css';
import { IpfsStorageService } from '../service/ipfs-service.ts';
import { ArweaveWebWallet } from 'arweave-wallet-connector';
import { ArweaveStorageService } from '../service/arweave-service.ts';
import axios from 'axios';
import { ARWEAVE } from '../config';

function TestStorage() {
  const wallet = new ArweaveWebWallet({
    name: 'Artist NFT',
    logo: 'logo',
  });
  wallet.setUrl('arweave.app');
  wallet.keepPopup = false;

  const connectIpfs = async () => {
    const storageInstance = new IpfsStorageService();
    const url = await storageInstance.storeMeta({
      name: 'title',
      description: 'title',
      imageUri: '',
      uri: 'uri',
      type: 'article',
    });
    alert(url);
  };

  const connectArweave = async () => {
    if (!wallet.connected) {
      await wallet.connect();
      const storageInstance = new ArweaveStorageService();
      const url = await storageInstance.storeArticle('你好AR');
      alert(url);
    }
  };

  const mineArweave = async () => {
    const url = `${ARWEAVE.url_prefix}mine`;
    axios.get(url).then(res => {
      console.log(res.data);
      alert('挖矿成功');
    });
  };

  return (
    <div>
      <h1>测试去中心化存储</h1>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', maxWidth: '500px' }}>
        <button onClick={connectIpfs}>connectIpfs</button>
        <button onClick={connectArweave}>connectArweave</button>
        <button onClick={mineArweave}>arweave挖矿</button>
      </div>
    </div>
  );
}

export default TestStorage;

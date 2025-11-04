import 'react-notifications-component/dist/theme.css';
import { storeMeta } from '../service/ipfs-service.ts';

function ConnectIpfs() {
  const connectIpfs = async () => {
    await storeMeta({ name: 'cipher' });
  };
  return (
    <div>
      <a onClick={connectIpfs}>connectIpfs</a>
    </div>
  );
}

export default ConnectIpfs;

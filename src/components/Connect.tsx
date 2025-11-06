import 'react-notifications-component/dist/theme.css';
import { connect } from '../service/connection-service';

function Connect() {
  const connectWallet = async () => {
    await connect();
  };
  return (
    <div>
      <a onClick={connectWallet}>连接钱包</a>
    </div>
  );
}

export default Connect;

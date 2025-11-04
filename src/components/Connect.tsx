import 'react-notifications-component/dist/theme.css';
import { connect } from '../service/connection-service';

function Connect() {
  const connectWallet = async () => {
    await connect();
  };
  return (
    <div>
      <a onClick={connectWallet}>connect</a>
    </div>
  );
}

export default Connect;

import { useState, useEffect, useRef } from 'react';
import { ethers, JsonRpcProvider } from 'ethers';
import { Lock__factory } from '../typechain-types';

function Test() {
  // 状态管理
  const [address, setAddress] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // 引用管理
  const inputRef = useRef<HTMLInputElement>(null);
  const contractAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707' as const;

  // 提供者和签名者
  const [provider, setProvider] = useState<JsonRpcProvider | ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  // 合约实例（只读）
  const getContract = (signerOrProvider: ethers.ContractRunner | ethers.AbstractProvider) => {
    return Lock__factory.connect(contractAddress, signerOrProvider);
  };

  // 连接钱包
  const connectWallet = async (): Promise<void> => {
    try {
      if (!window.ethereum) {
        alert('连接钱包失败，未安装 MetaMask。');
        return;
      }
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await browserProvider.send('eth_requestAccounts', []); // 请求账户访问权限
      const signer = await browserProvider.getSigner();
      const userAddress = await signer.getAddress();
      setSigner(signer);
      setProvider(browserProvider);
      setAddress(userAddress);
      setIsConnected(true);
      console.log(`Signer address: ${userAddress}`);
    } catch (error) {
      console.error('Connection failed:', error);
      alert('连接钱包失败，请检查 MetaMask。');
    }
  };

  // 读取消息
  const readMessage = async (): Promise<void> => {
    if (!provider) {
      alert('尚未连接钱包。');
      return;
    }
    try {
      const contract = getContract(provider);
      const currentMessage = await contract.message();
      setNewMessage(currentMessage);
      alert(`当前消息: ${currentMessage}`);
    } catch (error) {
      console.error('读取消息失败:', error);
      alert('读取消息失败，请检查合约地址。');
    }
  };

  // 设置消息
  const setMessage = async (): Promise<void> => {
    if (!provider || !signer || !isConnected) {
      alert('尚未连接钱包。');
      return;
    }

    const newMsg = inputRef.current?.value || '';
    if (!newMsg.trim()) {
      alert('请输入消息。');
      return;
    }

    try {
      const contract = getContract(signer);
      const transaction = await contract.setMessage(newMsg);
      const tx = await transaction.wait(1); // 等待 1 个区块确认
      const event = tx?.logs
        .map(log => contract.interface.parseLog(log))
        .find(parsedLog => parsedLog?.name === 'SetMessage');
      if (event) {
        const value = event.args[0];
        const parsedMessage = value.toString();
        alert(`消息已设置: ${parsedMessage}`);
        setNewMessage(parsedMessage); // 更新状态
      } else {
        alert('事件解析失败。');
      }
    } catch (error) {
      console.error('设置消息失败:', error);
      alert('设置消息失败，请检查 Gas 或合约权限。');
    }
  };

  // 组件挂载时自动尝试连接
  useEffect(() => {
    connectWallet().catch(error => {
      console.error('连接钱包失败:', error);
    });
  }, []);

  return (
    <div className='App'>
      <h1>Lock 合约交互</h1>
      <button onClick={connectWallet} disabled={isConnected}>
        {isConnected ? '已连接' : '连接钱包'}
      </button>
      {address && <p>地址: {address}</p>}
      <button onClick={readMessage} disabled={!isConnected}>
        读取消息
      </button>
      <button onClick={setMessage} disabled={!isConnected}>
        设置消息
      </button>
      <input ref={inputRef} type='text' placeholder='输入新消息' disabled={!isConnected} />
      {newMessage && <p>当前消息: {newMessage}</p>}
    </div>
  );
}

export default Test;

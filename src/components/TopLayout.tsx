import { Layout, Menu } from 'antd';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Connect from './Connect';
import NftMarket from './NftMarket';
import Personal from './Personal';
import TestContract from './TestContract.tsx';
import TestStorage from './TestStorage.tsx';

const { Header } = Layout;

const menuItems = [
  {
    key: 'index',
    label: '首页',
    path: '/',
  },
  {
    key: 'nft-market',
    label: 'NFT市场',
    path: '/nft-market',
  },
  {
    key: 'personal',
    label: '个人中心',
    path: '/personal',
  },
  {
    key: 'connect',
    label: '连接钱包',
    path: '',
  },
  {
    key: 'test-contract',
    label: '测试合约',
    path: '/test-contract',
  },
  {
    key: 'test-storage',
    label: '测试存储',
    path: '/test-storage',
  },
];

export default function TopLayout() {
  return (
    <Layout>
      <Header className='header'>
        <Menu
          theme='dark'
          mode='horizontal'
          items={menuItems.map(item => ({
            key: item.key,
            label: item.path ? <Link to={item.path}>{item.label}</Link> : <Connect />,
          }))}
        />
      </Header>
      <div>
        <Routes>
          <Route path='/*' element={<Home />} />
          <Route path='/nft-market/*' element={<NftMarket />} />
          <Route path='/personal/*' element={<Personal />} />
          <Route path='/test-contract/*' element={<TestContract />} />
          <Route path='/test-storage/*' element={<TestStorage />} />
        </Routes>
      </div>
    </Layout>
  );
}

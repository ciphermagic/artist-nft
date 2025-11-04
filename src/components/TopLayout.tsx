import { Layout, Menu } from 'antd';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Connect from './Connect';
import NftMarket from './NftMarket';
import Personal from './Personal';
import Test from './Test';
import ConnectIpfs from './ConnectIpfs';

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
    key: 'test',
    label: '测试',
    path: '/test',
  },
  {
    key: 'connect',
    label: 'Connect',
    path: '',
  },
  {
    key: 'connect-ipfs',
    label: 'ConnectIpfs',
    path: '',
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
            label: item.path ? (
              <Link to={item.path}>{item.label}</Link>
            ) : item.key === 'connect' ? (
              <Connect />
            ) : (
              <ConnectIpfs />
            ),
          }))}
        />
      </Header>
      <div>
        <Routes>
          <Route path='/*' element={<Home />} />
          <Route path='/nft-market/*' element={<NftMarket />} />
          <Route path='/personal/*' element={<Personal />} />
          <Route path='/test/*' element={<Test />} />
        </Routes>
      </div>
    </Layout>
  );
}

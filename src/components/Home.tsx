import { EditOutlined, PoundOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Routes, Route, Link } from 'react-router-dom';
import ArticleBrowser from './home-comp/ArticleBrowser';
import MarketBrowser from './home-comp/MarketBrowser';
import ImageBrowser from './home-comp/ImageBrowser.tsx';

const { Content, Sider } = Layout;

const menuItems = [
  {
    key: 'article',
    label: '文章',
    path: 'article',
    icon: <EditOutlined />,
  },
  {
    key: 'image',
    label: '藏品',
    path: 'image',
    icon: <UserOutlined />,
  },
  {
    key: 'market',
    label: '市场',
    path: 'market',
    icon: <PoundOutlined />,
  },
];

export default function Home() {
  return (
    <Layout>
      <Sider breakpoint='lg' collapsedWidth='0' width={200}>
        <Menu
          mode='inline'
          theme='light'
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems.map(item => ({
            key: item.key,
            label: <Link to={item.path}>{item.label}</Link>,
            icon: item.icon,
          }))}
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Routes>
            <Route path='article' element={<ArticleBrowser />} />
            <Route path='market' element={<MarketBrowser />} />
            <Route path='image' element={<ImageBrowser />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

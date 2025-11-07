import { useEffect, useState } from 'react';
import {
  PoundOutlined,
  FileOutlined,
  EditOutlined,
  FolderViewOutlined,
  PropertySafetyOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ImageNftMinter from './personal-comp/ImageNftMinter.tsx';
import ImageNftList from './personal-comp/ImageNftList.tsx';
import ArticleEditor from './personal-comp/ArticleEditor.tsx';
import ArticleScratch from './personal-comp/ArticleScratch.tsx';
import ArticleNftList from './personal-comp/ArticleNftList.tsx';

const { Content, Sider } = Layout;

const menuItems = [
  {
    key: 'collectible',
    label: '藏品',
    items: [
      {
        key: 'collectible-mint',
        label: '铸币',
        path: 'collectible-mint',
        icon: <PoundOutlined />,
        element: <ImageNftMinter />,
      },
      {
        key: 'collectible-browse',
        label: '浏览',
        path: 'collectible-browse',
        icon: <PropertySafetyOutlined />,
        element: <ImageNftList />,
      },
    ],
  },
  {
    key: 'article',
    label: '文章',
    items: [
      {
        key: 'article-write',
        label: '写文章',
        path: 'article-write',
        icon: <EditOutlined />,
        element: <ArticleEditor />,
      },
      {
        key: 'article-scratch',
        label: '草稿',
        path: 'article-scratch',
        icon: <FileOutlined />,
        element: <ArticleScratch />,
      },
      {
        key: 'article-browse',
        label: '浏览',
        path: 'article-browse',
        icon: <FolderViewOutlined />,
        element: <ArticleNftList />,
      },
    ],
  },
];

export default function Personal() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    const selectedItem = menuItems.flatMap(item => item.items).find(item => item.path === path)?.key;

    if (selectedItem) {
      setSelectedKeys([selectedItem]);
    }
  }, [location.pathname]);

  return (
    <Layout>
      <Sider breakpoint='lg' collapsedWidth='0' width={200}>
        <Menu
          mode='inline'
          selectedKeys={selectedKeys}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems.map(item => ({
            key: item.key,
            label: item.label,
            children: item.items.map(child => ({
              key: child.key,
              label: <Link to={child.path}>{child.label}</Link>,
              icon: child.icon,
            })),
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
          <Routes
            children={menuItems.map(item =>
              item.items.map(child => <Route key={child.key} path={child.path} element={child.element} />)
            )}
          />
        </Content>
      </Layout>
    </Layout>
  );
}

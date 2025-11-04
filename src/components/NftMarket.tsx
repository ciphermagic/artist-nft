import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, theme, message, Dropdown } from 'antd';
import { Input, Space } from 'antd';

const { Search } = Input;
const { Content } = Layout;

const onSearch = (value: string) => console.log(value);
const onClick: MenuProps['onClick'] = async ({ key }) => {
  message.info(`Click on item ${key}`);
};

const items: MenuProps['items'] = [
  {
    label: '书法',
    key: '书法',
    children: [
      {
        label: '传统',
        key: '传统',
      },
      {
        label: '当代',
        key: '当代',
      },
    ],
  },
  {
    label: '绘画',
    key: '绘画',
  },
  {
    label: '诗词',
    key: '诗词',
  },
];

export default function NftMarket() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <div style={{ margin: '16px 0' }}>
        <Space>
          <Dropdown menu={{ items, onClick }}>
            <a onClick={e => e.preventDefault()}>
              <Space>
                分类
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
          <Search placeholder='input search text' onSearch={onSearch} style={{ width: 200 }} />
        </Space>
      </div>
      <Content
        style={{
          padding: 24,
          margin: 0,
          height: 800,
          background: colorBgContainer,
        }}
      ></Content>
    </Layout>
  );
}

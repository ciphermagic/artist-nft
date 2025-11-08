import { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { formatEther } from 'ethers';
import { ownedNftByType } from '../../service/nft-service';
import type { Nft } from '../../service/types.ts';
import { messageBox } from '../../service/message-service.ts';
import axios, { type AxiosResponse } from 'axios';
import ArticleViewerModal from '../common/ArticleViewerModal.tsx';

const { Text } = Typography;

function ArticleNftList() {
  const [articles, setArticles] = useState<Nft[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const columns = [
    {
      title: 'ID',
      dataIndex: 'tokenId',
      width: 80,
      render: (id: string) => <div>{id}</div>,
    },
    {
      title: '标题',
      dataIndex: 'name',
      width: 200,
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: '版税(ETH)',
      dataIndex: 'royaltyInfo',
      width: 100,
      render: (royaltyInfo: Nft['royaltyInfo']) => (
        <div>
          {royaltyInfo ? <Text>{formatEther(royaltyInfo.royaltyAmount)}</Text> : <Text type='secondary'>N/A</Text>}
        </div>
      ),
    },
    {
      title: '收益人',
      dataIndex: 'royaltyInfo',
      width: 120,
      render: (royaltyInfo: Nft['royaltyInfo']) => (
        <div>
          {royaltyInfo ? (
            <Text>
              {royaltyInfo.receiver.substring(0, 6)}...{royaltyInfo.receiver.substring(royaltyInfo.receiver.length - 4)}
            </Text>
          ) : (
            <Text type='secondary'>N/A</Text>
          )}
        </div>
      ),
    },
    {
      title: '阅读',
      width: 80,
      render: (record: Nft) => (
        <a
          href='#'
          onClick={async e => {
            e.preventDefault(); // 阻止默认跳转行为
            await view(record);
          }}
        >
          阅读
        </a>
      ),
    },
  ];

  useEffect(() => {
    loadArticles().then(() => 'Loaded ArticleNftList');
  }, []);

  const loadArticles = async () => {
    const { success, data } = await ownedNftByType('article');
    if (success) {
      setArticles(data);
    } else {
      await messageBox('danger', '', '获取文章列表失败');
    }
  };

  const view = async (record: Nft) => {
    const res: AxiosResponse<string> = await axios.get(record.uri);
    if (res.status === 200) {
      setModalTitle(record.name);
      setModalContent(res.data);
      setModalOpen(true);
    } else {
      await messageBox('danger', '', '获取文章内容失败');
    }
  };

  return (
    <div>
      <Table
        columns={columns}
        rowKey='tokenId'
        dataSource={articles}
        pagination={{
          pageSize: 20,
          total: articles.length,
          showSizeChanger: false,
          showTotal: total => `已铸造：${total}`,
        }}
        bordered
      ></Table>
      <ArticleViewerModal
        open={modalOpen}
        title={modalTitle}
        content={modalContent}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
export default ArticleNftList;

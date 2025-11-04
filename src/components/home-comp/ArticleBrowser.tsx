import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { totalNftByType } from '../../service/nft-service';
import type { Nft } from '../../service/types.ts';
import { messageBox } from '../../service/message-service.ts';
import axios, { type AxiosResponse } from 'axios';
import ArticleViewerModal from '../common/ArticleViewerModal.tsx';

function ArticleBrowser() {
  const [articles, setArticles] = useState<Nft[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const columns = [
    {
      title: 'ID',
      dataIndex: 'tokenId',
      width: 100,
      render: (id: string) => <div>{id}</div>,
    },
    {
      title: '作者',
      dataIndex: 'owner',
      width: 200,
      render: (owner: string) => <div>{owner}</div>,
    },
    {
      title: '标题',
      dataIndex: 'name',
      width: 500,
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: '阅读',
      width: 500,
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
    const { success, data } = await totalNftByType('article');
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
export default ArticleBrowser;

import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { articles as getArticles, getArticle, removeArticle } from '../../service/storage-service';
import { useNavigate } from 'react-router-dom';
import type { Scratch } from '../../service/types.ts';

function ArticleScratch() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Scratch[]>([]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 500,
      render: (text: string) => (
        <a target='_self' onClick={() => edit(text)}>
          {text}
        </a>
      ),
    },
    {
      title: '操作',
      dataIndex: 'title',
      width: 500,
      render: (text: string) => (
        <a target='_self' onClick={() => remove(text)}>
          删除
        </a>
      ),
    },
  ];

  useEffect(() => {
    loadArticles().then(() => console.log('ok'));
  }, []);

  const edit = async (title: string) => {
    const content = await getArticle(title);
    navigate('/personal/article-write', { state: { title, content } });
  };

  const remove = async (title: string) => {
    await removeArticle(title);
    await loadArticles();
  };

  const loadArticles = async () => {
    const as = await getArticles();
    setArticles(as);
  };

  return (
    <div>
      <Table columns={columns} dataSource={articles} bordered></Table>
    </div>
  );
}

export default ArticleScratch;

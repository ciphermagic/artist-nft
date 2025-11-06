import { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { Layout, Button, Space, Input } from 'antd';
import { saveArticle } from '../../service/local-service';
import { useLocation, useNavigate } from 'react-router-dom';
import { messageBox } from '../../service/message-service.ts';
import { storeArticle, storeMeta } from '../../service/storage-service.ts';
import type { NftMeta } from '../../service/types.ts';
import { mintNft } from '../../service/nft-service.ts';

const { Content, Footer } = Layout;

function JordiEditor() {
  const navigate = useNavigate();
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const location = useLocation();

  const config = {
    zIndex: 0,
    readonly: false,
    theme: 'default',
    enableDragAndDropFileToEditor: true,
    saveModeInCookie: false,
    spellcheck: false,
    editorCssClass: false,
    triggerChangeEvent: true,
    height: 400,
    imageDefaultWidth: 100,
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  useEffect(() => {
    setTitle(location.state?.title);
    setContent(location.state?.content);
  }, [location.state?.content, location.state?.title]);

  async function savePost() {
    await saveArticle(title, content);
    await messageBox('success', '', '保存草稿成功');
    navigate('/personal/article-scratch');
  }

  async function publishPost() {
    await mintArticle();
  }

  const storageContent = async (content: string) => {
    return await storeArticle(content);
  };

  const mintArticle = async () => {
    const uri = await storageContent(content);
    const data: NftMeta = { name: title, description: title, imageUri: '', uri: uri, type: 'article' };
    const metaUri = await storeMeta(data);
    const { success } = await mintNft(metaUri);
    if (success) {
      navigate('/personal/article-browse');
    } else {
      await messageBox('danger', '', '铸币失败');
    }
  };

  return (
    <Layout>
      <Content>
        <Input
          value={title}
          style={{ textAlign: 'center', fontSize: 24 }}
          onChange={e => setTitle(e.target.value)}
          placeholder='请输入标题'
        />
        <JoditEditor ref={editor} value={content} config={config} onBlur={newContent => setContent(newContent)} />
      </Content>
      <Footer>
        <Space wrap>
          <Button type='primary' onClick={publishPost}>
            发表NFT
          </Button>
          <Button type='primary' onClick={savePost}>
            保存草稿
          </Button>
        </Space>
      </Footer>
    </Layout>
  );
}
export default JordiEditor;

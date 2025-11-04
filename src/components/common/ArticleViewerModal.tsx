import { useRef } from 'react';
import JoditEditor from 'jodit-react';
import { Input, Modal } from 'antd';

interface ArticleViewerModalProps {
  open: boolean;
  title: string;
  content: string;
  onCancel: () => void;
}

function ArticleViewerModal({ open, title, content, onCancel }: ArticleViewerModalProps) {
  const editor = useRef(null);

  const config = {
    zIndex: 0,
    readonly: true,
    theme: 'default',
    height: 400,
    imageDefaultWidth: 100,
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
      centered
      styles={{
        body: { padding: '24px 40px' },
      }}
    >
      <Input value={title} readOnly style={{ textAlign: 'center', fontSize: 24 }} />
      <JoditEditor ref={editor} value={content} config={config} />
    </Modal>
  );
}
export default ArticleViewerModal;

import { type ChangeEvent, useState } from 'react';
import type { NftMeta } from '../../service/types';
import { messageBox } from '../../service/message-service';
import { storeNftImage, storeMeta } from '../../service/storage-service';
import styles from './ImageNftMinter.module.css';
import { mintNft } from '../../service/nft-service.ts';
import { useNavigate } from 'react-router-dom';

function ImageNftMinter() {
  const navigate = useNavigate();
  const [meta, updateMeta] = useState<NftMeta>({ name: '', description: '', imageUri: '', uri: '', type: '' });
  const [imageUri, setImageUri] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        await messageBox('danger', '', '请选择图片文件');
        return;
      }

      // 检查文件大小 (最大10MB)
      if (file.size > 10 * 1024 * 1024) {
        await messageBox('danger', '', '图片大小不能超过10MB');
        return;
      }

      setIsUploading(true);
      try {
        const uri = await storeNftImage(file);
        setImageUri(uri);
        await messageBox('success', '上传成功', '图片上传成功');
      } catch (error) {
        if (error instanceof Error) {
          await messageBox('danger', '', error.message);
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleMint = async () => {
    if (!meta.name.trim()) {
      await messageBox('warning', '', '请输入NFT名称');
      return;
    }

    if (!meta.description.trim()) {
      await messageBox('warning', '', '请输入NFT描述');
      return;
    }

    if (!imageUri) {
      await messageBox('warning', '', '请先上传图片');
      return;
    }

    setIsMinting(true);
    try {
      const data: NftMeta = { ...meta, imageUri: imageUri, uri: imageUri, type: 'image' };
      const metaUri = await storeMeta(data);
      await messageBox('success', '元数据保存成功', 'NFT元数据已保存');

      const { success, tokenId } = await mintNft(metaUri);
      if (success) {
        await messageBox('success', '铸币成功', `NFT铸造成功，ID: ${tokenId}`);
        navigate('/personal/collectible-browse');
      } else {
        await messageBox('danger', '', '铸币失败');
      }
    } catch (error) {
      if (error instanceof Error) {
        await messageBox('danger', '', error.message);
      }
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className={styles.MinterWrapper}>
      <div className={styles.MinterContainer}>
        <div className={styles.Header}>
          <h1 className={styles.Title}>创建NFT艺术品</h1>
          <p className={styles.Subtitle}>上传您的数字艺术品并将其铸造成NFT</p>
        </div>

        <div className={styles.FormSection}>
          <div className={styles.FormGroup}>
            <label className={styles.Label}>NFT名称</label>
            <input
              type='text'
              className={styles.InputField}
              placeholder='为您的NFT作品命名'
              value={meta.name}
              onChange={e => updateMeta({ ...meta, name: e.target.value })}
            />
          </div>

          <div className={styles.FormGroup}>
            <label className={styles.Label}>描述</label>
            <textarea
              className={styles.TextArea}
              placeholder='描述您的NFT作品，包括创作灵感、技术细节等'
              value={meta.description}
              onChange={e => updateMeta({ ...meta, description: e.target.value })}
            />
          </div>

          <div className={styles.FormGroup}>
            <label className={styles.Label}>上传图片</label>
            <div className={styles.UploadPreviewContainer}>
              {imageUri ? (
                <div className={styles.PreviewContainer}>
                  <img src={imageUri} className={styles.PreviewImage} alt='NFT预览' />
                  <div className={styles.PreviewOverlay}>
                    <button
                      type='button'
                      className={styles.RemoveButton}
                      onClick={() => setImageUri('')}
                      disabled={isUploading}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.FileUpload}>
                  <div className={styles.FileUploadIcon}>📁</div>
                  <p className={styles.FileUploadText}>点击选择图片或拖拽到此处</p>
                  <p className={styles.FileUploadHint}>支持 JPG, PNG, GIF 格式，最大10MB</p>
                  <input
                    type='file'
                    className={styles.FileInput}
                    accept='image/*'
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.ActionSection}>
            <button
              className={styles.MintButton}
              onClick={handleMint}
              disabled={isMinting || isUploading || !meta.name || !meta.description || !imageUri}
            >
              {isMinting ? (
                <>
                  <span className={styles.LoadingSpinner}></span>
                  铸造中...
                </>
              ) : (
                '铸造NFT'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageNftMinter;

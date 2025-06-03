"use client";
import OperateModal from '@/components/operate-modal';
import { useState, useImperativeHandle } from 'react';
import { useTranslation } from '@/utils/i18n';
import { Upload, Button, message } from 'antd';
import type { UploadProps } from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import { useUserInfoContext } from '@/context/userInfo';
import { supabase } from '@/utils/supabaseClient';
import { ModalConfig } from '../types';
const { Dragger } = Upload;

const UploadModal = ({ ref, onSuccess }: { ref: any; onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [visiable, setVisiable] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any>([]);
  const [formData, setFormData] = useState<any>();

  useImperativeHandle(ref, () => ({
    showModal: ({ type, form }: ModalConfig) => {
      setVisiable(true);
      setFormData(form);
    }
  }));

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    setFileList(fileList);
  };

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    fileList: fileList,
    onChange: handleChange,
    beforeUpload: (file) => {
      const isCSV = file.type === "text/csv" || file.name.endsWith('.csv');
      if (!isCSV) {
        message.warning('仅支持上传csv文件')
      }
      return isCSV;
    },
    accept: '.csv'
  };

  const handleSubmit = async () => {
    setConfirmLoading(true);
    const file = fileList[0];
    const { data, error } = await supabase.storage
      .from('datasets')
      .upload(`${formData.folder}/${file.name}`, file.originFileObj, {
        cacheControl: '3600',
        upsert: false
      });
    if (!error) {
      await supabase.from('anomaly_detection_train_data').insert([
        {
          dataset_id: formData.dataset_id,
          tenant_id: formData.tenant_id,
          user_id: formData.user_id,
          name: file.name,
          storage_path: data.path
        }
      ]);
      setConfirmLoading(false);
      setVisiable(false);
      message.success(t('datasets.uploadSuccess'));
      onSuccess();
      
    } else {
      setConfirmLoading(false);
      message.error(`${error.message}`);
    }

  };

  const handleCancel = () => {
    setVisiable(false);
  };

  return (
    <OperateModal
      title={t(`datasets.upload`)}
      open={visiable}
      onCancel={() => setVisiable(false)}
      footer={[
        <Button key="submit" loading={confirmLoading} type="primary" onClick={handleSubmit}>
          {t('common.confirm')}
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          {t('common.cancel')}
        </Button>,
      ]}
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t('datasets.uploadText')}</p>
      </Dragger>
      <p>仅支持csv格式的文件，点击<a href="">下载模板</a></p>
    </OperateModal>
  )
};

export default UploadModal;
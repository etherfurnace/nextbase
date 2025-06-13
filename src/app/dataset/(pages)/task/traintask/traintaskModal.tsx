"use client";
import OperateModal from '@/components/operate-modal';
import { Form, Input, Button, Select, Typography, FormInstance, message } from 'antd';
import { useState, useImperativeHandle, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from '@/utils/i18n';
import { SupabaseClient, User } from '@supabase/supabase-js';
const { Paragraph } = Typography;

interface TrainTaskModalProps {
  supabase: SupabaseClient;
  user: User;
  // options: any,
  onSuccess: () => void;
  [key: string]: any
}

interface DatasetProp {
  id: string | number;
  tenant_id: string | number;
  dataset_id: string | number;
  storage_path: string | number;
  user_id: string | number;
  name: string;
  [key: string]: any
}

const TrainTaskModal = ({ ref, supabase, user, options, onSuccess }: TrainTaskModalProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [type, setType] = useState<string>('add');
  const [title, setTitle] = useState<string>('addtask');
  const [datasets, setDatasets] = useState<DatasetProp[]>([]);
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
  });
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const formRef = useRef<FormInstance>(null);

  const algorithmsParam = [
    {
      name: 'n_estimators',
      type: 'value',
      default: 100
    },
    {
      name: 'max_samples',
      type: 'value',
      default: 'auto'
    },
    {
      name: 'contamination',
      type: 'value',
      default: 'auto'
    },
    {
      name: 'max_features',
      type: 'value',
      default: 1.0
    },
    {
      name: 'bootstrap',
      type: 'enum',
      default: 'False'
    },
    {
      name: 'n_jobs',
      type: 'value',
      default: 'None',
    },
    {
      name: 'random_state',
      type: 'value',
      default: 'None'
    },
    {
      name: 'verbose',
      type: 'value',
      default: 0
    },
    {
      name: 'warm_start',
      type: 'enum',
      default: 'False'
    }
  ];

  useImperativeHandle(ref, () => ({
    showModal: ({ type, title, form }: {
      type: string;
      title: string;
      form: any;
    }) => {
      setIsModalOpen(true);
      setType(type);
      setTitle(title);
      setFormData(form);
    }
  }));

  const datasetItems = useMemo(() => {
    return datasets.map((item) => {
      return {
        value: item.id,
        label: item.name
      }
    })
  }, [datasets])

  useEffect(() => {
    if (isModalOpen && formRef.current) {
      formRef.current?.resetFields();
      getDataSets();
      // 设置算法参数的默认值
      const defaultParams: Record<string, any> = {};
      algorithmsParam.forEach(item => {
        defaultParams[item.name] = item.default;
      });

      formRef.current?.setFieldsValue({
        ...formData,
        type: 'anomaly',
        algorithms: 'IsolationForst',
        params: defaultParams
      });
    }
  }, [formData, isModalOpen]);

  const renderItem = (param: any[]) => {
    return param.map((item) => {
      return (
        <Form.Item key={item.name} name={['params', item.name]} label={item.name} rules={[{ required: true, message: t('common.inputMsg') }]}>
          {item.type === 'value' ? <Input /> :
            <Select
              options={[
                { value: 'False', label: 'False' },
                { value: 'True', label: 'True' },
              ]}
            />
          }
        </Form.Item>
      )
    })
  };

  const getDataSets = async () => {
    const { data } = await supabase.from('anomaly_detection_train_data').select();
    setDatasets(data as DatasetProp[]);
  };

  const handleSubmit = async () => {
    setConfirmLoading(true);
    try {
      const data = formRef.current?.getFieldsValue();
      console.log(data)
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <OperateModal
        title={t(`traintask.${title}`)}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="submit" loading={confirmLoading} type="primary" onClick={handleSubmit}>
            {t('common.confirm')}
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            {t('common.cancel')}
          </Button>,
        ]}
      >
        <Form
          ref={formRef}
          layout="vertical"
        // labelCol={{ span: 4 }}
        // wrapperCol={{ span: 14 }}
        >
          <Form.Item
            name='name'
            label={t('common.name')}
            rules={[{ required: true, message: t('common.inputMsg') }]}
          >
            <Input placeholder={t('common.inputMsg')} />
          </Form.Item>
          <Form.Item
            name='type'
            label={t('common.type')}
            rules={[{ required: true, message: t('common.inputMsg') }]}
          >
            <Select placeholder={t('common.inputMsg')} options={[
              { value: 'anomaly', label: '单指标检测异常' },
            ]} />
          </Form.Item>
          <Form.Item
            name='traindata'
            label={t('traintask.traindata')}
            rules={[{ required: true, message: t('common.inputMsg') }]}
          >
            <Select placeholder={t('common.inputMsg')} options={datasetItems} />
          </Form.Item>
          <Form.Item
            name='algorithms'
            label={t('traintask.algorithms')}
            rules={[{ required: true, message: t('common.inputMsg') }]}
          >
            <Select placeholder={t('common.inputMsg')} onChange={(value) => { console.log(value) }} options={[
              { value: 'IsolationForst', label: '孤立森林' },
            ]} />
          </Form.Item>
          <Paragraph>
            <pre style={{ border: 'none' }}>
              {renderItem(algorithmsParam)}
            </pre>
          </Paragraph>
        </Form>
      </OperateModal>
    </>
  )
};

export default TrainTaskModal;
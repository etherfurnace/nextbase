'use client'
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { MenuItem } from '@/types';
import MainLayout from '../mainlayout/layout'
import CustomTable from '@/components/custom-table';
import { ColumnItem } from '@/types';
import { ModalRef } from '../types';
import { Button, TablePaginationConfig, Input, Popconfirm, message } from 'antd';
import { supabase } from '@/utils/supabaseClient';
import '@ant-design/v5-patch-for-react-19';
import { useTranslation } from '@/utils/i18n';
import UploadModal from './uploadModal';
const { Search } = Input;

interface TableData {
  id: number,
  name: string,
  anomaly?: number,
  [key: string]: any
}

const Detail = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const modalRef = useRef<ModalRef>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    total: 1,
    pageSize: 20,
  });

  const columns: ColumnItem[] = [
    {
      title: t('common.name'),
      key: 'name',
      dataIndex: 'name',
      width: 200,
      render(_, record) {
        return (
          <>
            {record?.name || '--'}
          </>
        )
      },
    },
    {
      title: t('datasets.anomalyTitle'),
      key: 'anomaly',
      dataIndex: 'anomaly',
      render(_, record) {
        return (
          <>
            {record?.anomaly || '--'}
          </>
        )
      },
    },
    {
      title: t('common.action'),
      key: 'action',
      dataIndex: 'action',
      width: 200,
      fixed: 'right',
      render: (_: unknown, record: any) => (
        <>
          <Button
            type="link"
            className="mr-[10px]"
          >
            {t('datasets.annotate')}
          </Button>
          <Popconfirm
            title={t('datasets.deleteTitle')}
            description={t('datasets.deleteContent')}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
            okButtonProps={{ loading: confirmLoading }}
            onConfirm={() => onDelete(record)}
          >
            <Button type="link">
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  useEffect(() => {
    const items: MenuItem[] = [
      {
        name: 'test',
        url: 'test',
        title: 'test',
        icon: 'caijiqi',
        operation: ['null']
      }
    ];
    getDataset();
    setItems(items);
  }, []);

  const getDataset = async (search: string = '') => {
    setLoading(true);
    const { data, error } = await supabase.from('anomaly_detection_train_data')
      .select()
      .eq('dataset_id', searchParams.get('id'))
      .ilike('name', `%${search}%`);
    setTableData(data as TableData[]);
    setLoading(false);
    console.log(data);
  };

  const onSearch = (search: string) => { 
    getDataset(search);
   };

  const onUpload = () => {
    const data = {
      dataset_id: searchParams.get('id'),
      tenant_id: searchParams.get('tenant_id'),
      folder: searchParams.get('name'),
      user_id: searchParams.get('user_id')
    };
    modalRef.current?.showModal({ type: 'edit', form: data });
  };

  const onDelete = async (data: any) => {
    setConfirmLoading(true);
    const { error } = await supabase.storage
      .from('datasets')
      .remove([data.storage_path]);
    if(error) return message.error(error.message);
    await supabase.from('anomaly_detection_train_data').delete().eq('id', data.id);
    setConfirmLoading(false);
    getDataset();
  };

  return (
    <>
      <MainLayout menuItems={items}>
        <div className="flex justify-end">
          <div className='mr-1.5'>
            <Search
              className="w-[240px]"
              placeholder={t('common.search')}
              enterButton
              onSearch={onSearch}
            />
          </div>
          <Button type="primary" onClick={onUpload}>{t("datasets.upload")}</Button>
        </div>
        <div className="flex-1 relative">
          <CustomTable
            className="mt-3 absolute w-[100%]"
            scroll={{ x: 'calc(100vw - 400px)', y: 'calc(100vh - 400px)' }}
            dataSource={tableData}
            columns={columns}
            pagination={pagination}
            loading={loading}
            rowKey="id"
          />
        </div>
      </MainLayout>
      <UploadModal ref={modalRef} onSuccess={() => getDataset()} />
    </>
  )
};

export default Detail;
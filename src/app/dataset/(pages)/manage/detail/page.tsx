'use client'
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { MenuItem } from '@/types';
import { BankOutlined } from '@ant-design/icons';
import CustomTable from '@/components/custom-table';
import { ColumnItem } from '@/types';
import { ModalRef } from '../types';
import { Button, TablePaginationConfig, Input, Popconfirm, message } from 'antd';
import { supabase } from '@/utils/supabaseClient';
import '@ant-design/v5-patch-for-react-19';
import { useTranslation } from '@/utils/i18n';
import UploadModal from './uploadModal';
import { usePathname, useRouter } from 'next/navigation';
import sideMenuStyle from './index.module.scss';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Icon from '@/components/icon';
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
  const router = useRouter();
  const modalRef = useRef<ModalRef>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    total: 1,
    pageSize: 5,
  });

  const columns: ColumnItem[] = [
    {
      title: t('common.name'),
      key: 'name',
      dataIndex: 'name',
      width: 200,
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
            onClick={() => toAnnotation(record)}
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

  const Topsection = () => {
    const pathname = usePathname();
    const getTitle = () => {
      const temp = pathname.split('/')[3];
      return '文档列表';
    };
    return (
      <>
        <div className={`w-[216px] rounded-md mr-4 flex h-[90px] flex-col items-center justify-center ${sideMenuStyle.sectionContainer}`}>

          <div className={`flex justify-center items-center mb-2`}>
            <Icon
              type="shiyongwendang"
              className="mr-2"
              style={{ height: '22px', width: '22px', color: 'blue' }}
            ></Icon>
            <h1 className="text-center text-lg font-bold leading-[24px]">{'Weops'}</h1>
          </div>
          <p>这是知识库的...</p>
        </div>
        <div className={`flex flex-col w-full h-[90px] p-4 rounded-md overflow-hidden ${sideMenuStyle.sectionContainer}`}>
          <h1 className="text-lg">{getTitle()}</h1>
          <p className="text-sm overflow-hidden w-full min-w-[1000px] mt-[8px]">
            {'支持上传时序数据，并为这些数据进行打标，以便后续进行模型训练。'}
          </p>
        </div>
      </>
    );
  };

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
    setPagination((prev) => {
      return {
        ...prev,
        total: data?.length
      }
    });
    setLoading(false);
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
    if (error) return message.error(error.message);
    await supabase.from('anomaly_detection_train_data').delete().eq('id', data.id);
    setConfirmLoading(false);
    getDataset();
  };

  const toAnnotation = (data: any) => {
    router.push(`/dataset/manage/annotation?id=${data.id}`);
  };

  const back = () => {
    console.log(back)
    router.back();
  };

  const handleChange = (value: any) => {
    setPagination(value)
  };

  return (
    <>
      <div className={`flex w-full h-full text-sm p-[20px] ${sideMenuStyle.sideMenuLayout} grow`}>
        <div className="w-full flex grow flex-1 h-full">
          <section className="flex-1 flex flex-col overflow-hidden">
            <div className={`mb-4 flex w-full rounded-md`}>
              <Topsection />
            </div>
            <div className={`p-4 flex-1 rounded-md overflow-hidden ${sideMenuStyle.sectionContainer} ${sideMenuStyle.sectionContext}`}>
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
                <button
                  className="absolute bottom-1 left-4 flex items-center py-2 rounded-md text-sm z-999 cursor-pointer"
                  onClick={() => router.back()}
                >
                  <ArrowLeftOutlined className="mr-2" />
                </button>
                <CustomTable
                  rowKey="id"
                  className="mt-3 absolute w-[100%]"
                  scroll={{ x: 'calc(100vw - 400px)', y: 'calc(100vh - 400px)' }}
                  dataSource={tableData}
                  columns={columns}
                  pagination={pagination}
                  loading={loading}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
      <UploadModal ref={modalRef} onSuccess={() => getDataset()} />
    </>
  )
};

export default Detail;
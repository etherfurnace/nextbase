"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Segmented, Modal, message } from 'antd';
import EntityList from '@/components/entity-list';
import { useTranslation } from '@/utils/i18n';
import { useRouter } from 'next/navigation';
import DatasetModal from './dataSetsModal';
import { ModalRef } from './types';
import '@ant-design/v5-patch-for-react-19';
import { supabase } from '@/utils/supabaseClient';
import { User } from '@supabase/supabase-js';
import { useSession } from 'next-auth/react';
const { confirm } = Modal;
import sideMenuStyle from './index.module.scss';

const DatasetManagePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('anomaly');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<any>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const modalRef = useRef<ModalRef>(null);

  useEffect(() => {
    if (!session?.supabase?.access_token && !session?.supabase?.refresh_token) {
      supabase.auth.signOut();
      return;
    }
    console.log('test')
    supabase.auth.setSession({
      access_token: session.supabase.access_token,
      refresh_token: session.supabase.refresh_token,
    });
    if (!user) {
      supabase.auth
        .getUser()
        .then((res) => {
          const { data, error } = res;
          console.log(error)
          setUser(data.user);
        })
    }
  }, [session, activeTab]);

  useEffect(() => {
    if (!loading) {
      getDataSets();
    }
  }, [activeTab]);

  const datasetTypes = [
    { key: 'anomaly', value: 'anomaly', label: t('datasets.anomaly') },
    { key: 'forecast', value: 'forecast', label: t('datasets.forecast') },
    { key: 'log', value: 'log', label: t('datasets.log') },
  ];

  const menuActions = (data: any) => [
    {
      key: 'edit',
      label: (
        <div>
          <span className="block w-full" onClick={() => handleOpenModal('edit', 'editform', data)}>{t('common.edit')}</span>
        </div>
      ),
    },
    {
      key: 'delete',
      label: (
        <div>
          <span className="block w-full" onClick={() => handleDelete(data)}>{t('common.delete')}</span>
        </div>
      ),
    },
  ];

  const getDataSets = async () => {
    setLoading(true);
    if (activeTab === 'anomaly') {
      const { data, error } = await supabase
        .from('anomaly_detection_datasets')
        .select(`*,tenants (name)`);
      if (data?.length) {
        const _data = data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            description: item.description || '--',
            icon: 'caijixinxi',
            creator: item.tenants?.name || '--',
          }
        })
        setDatasets(_data);
      } else {
        setDatasets([
          { id: '1', name: 'Dataset 1', description: 'Description for Dataset 1', icon: 'caijixinxi', creator: 'User A' },
          { id: '2', name: 'Dataset 2', description: 'Description for Dataset 2', icon: 'caijixinxi', creator: 'User B' },
        ])
      }
    } else {
      setDatasets([]);
    }
    setLoading(false);
  }

  const infoText = (item: any) => {
    return `Created by: ${item.creator}`;
  };

  const navigateToNode = () => {
    router.push(
      `/dataset/manage/detail`
    );
  };

  const handleTabChange = (key: string) => {
    console.log(key)
    setActiveTab(key);
    setSearchTerm('');
    setFilterValue([]);
  };

  const handleDelete = (data: any) => {
    confirm({
      title: t(`datasets.delDataset`),
      content: t(`datasets.delDatasetInfo`),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      centered: true,
      onOk() {
        return new Promise(async (resolve) => {
          try {
            const { error } = await supabase.from('anomaly_detection_datasets').delete().eq('id', data.id);
            if (error) {
              console.log(error);
              message.error('error');
            } else {
              message.success(t('common.successfullyDeleted'));
            }
          } finally {
            getDataSets();
            return resolve(true);
          }
        })
      }
    });
  };

  const handleOpenModal = (type: string, title: string, form: any = {}) => {
    modalRef.current?.showModal({ type, title, form })
  };

  return (
    <div className={`p-4`}>
      <div className={`flex flex-col w-full h-full ${sideMenuStyle.segmented}`}>
        <Segmented
          options={datasetTypes.map((type) => ({
            label: type.label,
            value: type.key,
          }))}
          value={activeTab}
          onChange={handleTabChange}
        />
      </div>
      <EntityList
        data={datasets}
        loading={loading}
        onSearch={setSearchTerm}
        changeFilter={setFilterValue}
        // isSingleIconAction={false}
        menuActions={menuActions}
        openModal={() => handleOpenModal('add', 'addform')}
        infoText={infoText}
        onCardClick={() => {
          navigateToNode();
        }}
      />
      <DatasetModal
        ref={modalRef}
        supabase={supabase}
        user={user as User}
        options={datasetTypes}
        onSuccess={getDataSets}
      />
    </div>
  );
};

export default DatasetManagePage;

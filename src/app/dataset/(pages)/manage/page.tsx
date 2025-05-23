"use client";
import React, { useState } from 'react';
import { Segmented, Menu, Form, Input, Switch, Button } from 'antd';
import EntityList from '@/components/entity-list';
import { useTranslation } from '@/utils/i18n';
import OperateModal from '@/components/operate-modal';

const DatasetManagePage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('anomaly');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [form] = Form.useForm();

  const datasetTypes = [
    { key: 'anomaly', label: 'Single Indicator Anomaly Detection' },
    { key: 'forecast', label: 'Time Series Forecasting' },
    { key: 'log', label: 'Log' },
  ];

  const datasets = [
    { id: '1', name: 'Dataset 1', description: 'Description for Dataset 1', icon: 'caijixinxi', creator: 'User A' },
    { id: '2', name: 'Dataset 2', description: 'Description for Dataset 2', icon: 'caijixinxi', creator: 'User B' },
  ];

  const menuActions = () => [
    {
      key: 'edit',
      label: (
        <div>
          <span className="block w-full">{t('common.edit')}</span>
        </div>
      ),
    },
    {
      key: 'delete',
      label: (
        <div>
          <span className="block w-full">{t('common.delete')}</span>
        </div>
      ),
    },
  ];
  
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setSearchTerm('');
    setFilterValue([]);
  };

  const handleAddDataset = () => {
    form.validateFields().then((values) => {
      console.log('Form values:', values);
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div className="p-4">
      <Segmented
        options={datasetTypes.map((type) => ({
          label: type.label,
          value: type.key,
        }))}
        value={activeTab}
        onChange={handleTabChange}
      />
      <EntityList
        data={datasets}
        loading={false}
        onSearch={setSearchTerm}
        changeFilter={setFilterValue}
        isSingleIconAction={false}
        menuActions={menuActions}
        openModal={() => setIsModalOpen(true)} // Open modal on ADD
        infoText={(item) => `Created by: ${item.creator}`}
      />
      <OperateModal
        title="Add New Dataset"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddDataset}>
            Add
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the dataset name' }]}
          >
            <Input placeholder="Enter dataset name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input.TextArea placeholder="Enter dataset description" />
          </Form.Item>
          <Form.Item
            name="isAnomaly"
            label="Is Anomaly Displayed"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </OperateModal>
    </div>
  );
};

export default DatasetManagePage;

'use client';
import React from 'react';
import SubLayout from '@/components/sub-layout/page';
import { BankOutlined } from '@ant-design/icons'
import { useTranslation } from '@/utils/i18n';
import { usePathname } from 'next/navigation';
import Icon from '@/components/icon/index';
import { useRouter } from 'next/navigation';
import { MenuItem } from '@/types';

const Collectorintro = () => {
  // const searchParams = new URLSearchParams(window.location.search);
  const name = 'WeOps';
  return (
    <div className="flex h-[58px] flex-col items-center justify-center">
      {/* <Icon
          type="UserOutlined"
          className="h-16 w-16"
          style={{ height: '36px', width: '36px' }}
        ></Icon> */}
      <div className='flex justify-center mb-2'><BankOutlined className='text-2xl mr-3' twoToneColor="#eb2f96" /><h1 className="text-center leading-[24px]">{name}</h1></div>
      <p>数据列表</p>
    </div>
  );
};

const CollectorLayout = ({
  children,
  menuItems
}: Readonly<{
  children: React.ReactNode;
  menuItems: MenuItem[]
}>) => {
  const router = useRouter();
  const { t } = useTranslation();
  const Topsection = () => {
    const pathname = usePathname();
    const getTitle = () => {
      const temp = pathname.split('/')[3];
      return '文档列表';
    };
    return (
      <div className="flex flex-col h-[90px] p-4 overflow-hidden">
        <h1 className="text-lg">{getTitle()}</h1>
        <p className="text-sm overflow-hidden w-full min-w-[1000px] mt-[8px]">
          {'支持上传时序数据，并为这些数据进行打标，以便后续进行模型训练。'}
        </p>
      </div>
    );
  };
  return (
    <div>
      <SubLayout
        topSection={<Topsection></Topsection>}
        menuItems={menuItems}
        showBackButton={true}
        intro={<Collectorintro></Collectorintro>}
        onBackButtonClick={() => {
          router.back()
        }}
      >
        {children}
      </SubLayout>
    </div>
  );
};

export default CollectorLayout;
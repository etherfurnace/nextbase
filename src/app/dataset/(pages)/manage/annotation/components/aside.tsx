'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import sideMenuStyle from './index.module.scss';
import { Spin } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import Icon from '@/components/icon';
import { useRouter } from 'next/navigation';
import { MenuItem } from '@/types/index';
import EllipsisWithTooltip from '@/components/ellipsis-with-tooltip';

const Aside = ({ children, menuItems, loading }: { children: any, menuItems: any, loading: boolean }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const buildUrlWithParams = (id: number) => {
    // const params = new URLSearchParams(searchParams || undefined);
    return `?id=${id}`;
  };

  const isActive = (id: number): boolean => {
    if (pathname === null) return false;
    return searchParams.get('id') === id.toString();
  };
  return (
    <>
      <aside className={`w-[216px] pr-4 flex flex-shrink-0 flex-col h-full ${sideMenuStyle.sideMenu}`}>
        <div className={`p-4 rounded-md mb-3 h-[90px] ${sideMenuStyle.introduction}`}>
          {children}
        </div>
        <nav className={`flex-1 relative rounded-md ${sideMenuStyle.nav}`}>
          {loading ? (
            <div className="min-h-[300px] flex items-center justify-center">
              <Spin spinning={loading}></Spin>
            </div>
          ) : (
            <ul className="p-3">
              {menuItems.map((item: any) => (
                <li key={item.id} className={`rounded-md mb-1 ${isActive(item.id) ? sideMenuStyle.active : ''}`}>
                  <Link href={buildUrlWithParams(item.id)} className={`group flex items-center overflow-hidden h-9 rounded-md py-2 text-sm font-normal px-3`}
                    onClick={async (e) => {
                      e.preventDefault();
                      const shouldSave = window.confirm('请确认数据已保存，是否继续？');
                      if (shouldSave) {
                        router.push(buildUrlWithParams(item.id))
                      }
                    }}
                  >
                    {<Icon type={'caijiqi'} className="text-xl pr-1.5" />}
                    <EllipsisWithTooltip
                      text={item.name}
                      className="w-[100px] overflow-hidden text-ellipsis whitespace-nowrap"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {/* {showProgress && (
            <>
              {taskProgressComponent}
            </>
          )} */}
          <button
            className="absolute bottom-4 left-4 flex items-center py-2 rounded-md text-sm cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeftOutlined className="mr-2" />
          </button>
        </nav>
      </aside>
    </>
  )
};

export default Aside;
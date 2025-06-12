import sideMenuStyle from './index.module.scss';
import React, { useState, useEffect, useMemo } from 'react';
import SideMenu from './side-menu';
import { MenuItem } from '@/types/index';
import { Segmented } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/icon';

interface WithSideMenuLayoutProps {
  intro?: React.ReactNode;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  children: React.ReactNode;
  topSection?: React.ReactNode;
  showProgress?: boolean;
  showSideMenu?: boolean;
  layoutType?: 'sideMenu' | 'segmented';
  taskProgressComponent?: React.ReactNode;
  pagePathName?: string;
  menuItems?: MenuItem[]
}

const SubLayout: React.FC<WithSideMenuLayoutProps> = ({
  intro,
  showBackButton,
  onBackButtonClick,
  children,
  topSection,
  showProgress,
  showSideMenu = true,
  layoutType = 'sideMenu',
  taskProgressComponent,
  pagePathName,
  menuItems = []
}) => {
  const router = useRouter();
  const curRouterName = usePathname();
  const pathname = pagePathName ?? curRouterName;
  const [selectedKey, setSelectedKey] = useState<string>(pathname ?? '');

  useEffect(() => {
    let urlKey: string | undefined = curRouterName ?? undefined;
    if (pagePathName) {
      urlKey = menuItems.find(
        (menu) => menu.url && curRouterName && curRouterName.startsWith(menu.url)
      )?.url;
    }
    setSelectedKey(urlKey as string);
  }, [curRouterName, menuItems]);


  const handleSegmentChange = (key: string | number) => {
    router.push(key as string);
    setSelectedKey(key as string);
  };

  return (
    <div className={`flex w-full h-full text-sm p-[10px] ${sideMenuStyle.sideMenuLayout} ${(intro && topSection) ? 'grow' : 'flex-col'}`}>
      {layoutType === 'sideMenu' ? (
        <>
          {(!intro && topSection) && (
            <div className="mb-4 w-full rounded-md">
              {topSection}
            </div>
          )}
          <div className="w-full flex grow flex-1 h-full">
            {showSideMenu && menuItems.length > 0 &&  (
              <SideMenu
                menuItems={menuItems}
                showBackButton={showBackButton}
                showProgress={showProgress}
                taskProgressComponent={taskProgressComponent}
                onBackButtonClick={onBackButtonClick}
              >
                {intro}
              </SideMenu>
            )}
            <section className="flex-1 flex flex-col overflow-hidden">
              {(intro && topSection) && (
                <div className={`mb-4 w-full rounded-md ${sideMenuStyle.sectionContainer}`}>
                  {topSection}
                </div>
              )}
              <div className={`p-4 flex-1 rounded-md overflow-auto ${sideMenuStyle.sectionContainer} ${sideMenuStyle.sectionContext}`}>
                {children}
              </div>
            </section>
          </div>
        </>
      ) : (
        <div className={`flex flex-col w-full h-full ${sideMenuStyle.segmented}`}>
          {menuItems.length > 0 ? (
            <>
              <Segmented
                options={menuItems.map(item => ({
                  label: (
                    <div className="flex items-center justify-center">
                      {item.icon && (
                        <Icon type={item.icon} className="mr-2 text-sm" />
                      )} {item.title}
                    </div>
                  ),
                  value: item.url,
                }))}
                value={selectedKey}
                onChange={handleSegmentChange}
              />
              <div className="flex-1 pt-4 rounded-md overflow-auto">
                {children}
              </div>
            </>
          ) : (
            <div className="flex-1 pt-4 rounded-md overflow-auto">
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubLayout;
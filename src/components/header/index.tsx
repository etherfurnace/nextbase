"use client";
import { Dropdown, Space, Avatar, Menu, MenuProps, message } from 'antd';
import { useSession, signOut } from "next-auth/react";
// import { createClient } from "@supabase/supabase-js";
import { useTranslation } from "@/utils/i18n";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import * as Icons from "@ant-design/icons";
import Icon from '../icon';
import { supabase } from "@/utils/supabaseClient";
import { DownOutlined } from '@ant-design/icons';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

interface MenuItem {
  url: string;
  icon: string;
  title: string;
}

export default function Header() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const pathname = usePathname();
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const locale = localStorage.getItem('locale') || 'en';
        const response = await fetch(`/api/menu?locale=${locale}`);
        const data: MenuItem[] = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    };
    fetchMenu();
  }, []);

  const handleLogout = async () => {
    console.log('sign out!')
    await supabase.auth.signOut();
    signOut();
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  const handleMenuClick = ({ key }: any) => {
    console.log(key)
    if (key === 'logout') handleLogout();
    setDropdownVisible(false);
  };

  const items: MenuProps['items'] = [
    {
      key: 'logout',
      label: (<button>{t('common.logout')}</button>)
    }
  ]

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-4 py-2 shadow-xs z-10">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="App Logo" className="h-8 w-8" />
        <span className="text-lg font-bold text-black">NextBase</span>
      </div>
      <nav className="flex gap-4 items-center">
        {menuItems.map((item) => (
          <a
            key={item.url}
            href={item.url}
            className={`flex items-center gap-2 text-sm ${pathname.includes(item.url) ? "text-blue-500 font-bold" : "text-gray-700 hover:text-blue-500"
              }`}
          >
            <Icon type={item.icon} className="w-4 h-4" />
            <span>{item.title}</span>
          </a>
        ))}
      </nav>
      <div>
        {session?.user ? (
          <div className="flex items-center gap-2">
            <Dropdown
              menu={{
                items,
                onClick: handleMenuClick
               }}
              trigger={['click']}
              open={dropdownVisible}
              onOpenChange={setDropdownVisible}
            >
              <a className='cursor-pointer' onClick={(e) => e.preventDefault()}>
                <div className="flex items-center">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-500 text-white mr-1">
                    {session.user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-950 mr-1">{session.user.email}</span>
                  <DownOutlined style={{ fontSize: '10px', color: 'black' }} />
                </div>
              </a>
            </Dropdown>
          </div>
        ) : (
          <button
            onClick={() => window.location.href = "/api/auth/signin?csrf=true"}
            className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('common.login')}
          </button>
        )}
      </div>
    </header>
  );
}

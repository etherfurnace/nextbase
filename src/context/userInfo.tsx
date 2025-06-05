'use client'
import { useSession, signOut } from 'next-auth/react';
import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

interface UserInfoContextType {
  [key: string]: any
}

const UserInfoContext = createContext<UserInfoContextType | undefined>(undefined);

export const UserInfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    const isToken = session?.supabase;
    const isLogin = session?.user;
    if (isToken && isLogin) {
      supabase.auth.setSession({
        access_token: session.supabase.access_token,
        refresh_token: session.supabase.refresh_token,
      });
      supabase.auth.getSession().then((res) => {
        const { data, error } = res;
        console.log(res);
        if (!data.session) {
          supabase.auth.signOut();
          signOut();
        }
      })
    } 
    // else {
    //   supabase.auth.signOut();
    //   signOut();
    // }
  }, [session]);

  return (
    <UserInfoContext.Provider value={{ session }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfoContext = () => {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error('useUserInfoContext must be used within a UserInfoProvider');
  }
  return context;
};
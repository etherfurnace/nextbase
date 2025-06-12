'use client'
import { useSession, signOut } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { User } from '@supabase/supabase-js';

interface UserInfoContextType {
  user: User | null,
  [key: string]: any
}

export const UserInfoContext = createContext<UserInfoContextType>({
  user: null
});

export const UserInfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);

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
        if (!data.session) {
          supabase.auth.signOut();
          signOut();
        } else {
          (async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
              setUser(null);
              return;
            } else {
              setUser(data.user);
            }
          })()
        }
      });
    }
  }, [session]);

  return (
    <UserInfoContext.Provider value={{ session, user }}>
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
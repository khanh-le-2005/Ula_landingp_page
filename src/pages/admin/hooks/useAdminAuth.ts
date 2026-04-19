import { useEffect, useState } from 'react';
import {
  clearStoredAdminSession,
  getStoredAdminToken,
  getStoredAdminUser,
  setStoredAdminSession,
  type AdminUserInfo,
} from '../adminApi';

type AdminSession = {
  token: string;
  user: AdminUserInfo | null;
};

const getSession = (): AdminSession => ({
  token: getStoredAdminToken(),
  user: getStoredAdminUser(),
});

export function useAdminAuth() {
  const [session, setSession] = useState<AdminSession>(getSession);

  useEffect(() => {
    const onStorage = () => setSession(getSession());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setSessionState = (token: string, user: AdminUserInfo) => {
    setStoredAdminSession(token, user);
    setSession({ token, user });
  };

  const clearSession = () => {
    clearStoredAdminSession();
    setSession({ token: '', user: null });
  };

  return {
    token: session.token,
    user: session.user,
    isAuthenticated: Boolean(session.token),
    setSession: setSessionState,
    clearSession,
  };
}


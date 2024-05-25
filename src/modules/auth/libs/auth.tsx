import { type User } from 'lucia';
import { createContext, useContext, useMemo } from 'react';

import { userFn } from '@/modules/auth/api/get-user';
import { loginFn } from '@/modules/auth/api/login';
import { logoutFn } from '@/modules/auth/api/logout';
import { registerFn } from '@/modules/auth/api/register';

import { configureAuth } from './react-query-auth';

const authConfig = {
  loginFn,
  logoutFn,
  registerFn,
  userFn,
};

const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

export { AuthLoader, useUser };

export type AuthContext = {
  isAuthenticated: boolean;
  useLogin: typeof useLogin;
  useLogout: typeof useLogout;
  useRegister: typeof useRegister;
  user: User | null | undefined;
};

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useUser();
  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({
      isAuthenticated,
      useLogin,
      useLogout,
      useRegister,
      user,
    }),
    [isAuthenticated, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

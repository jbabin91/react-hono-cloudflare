import {
  type MutationFunction,
  type QueryFunction,
  type QueryKey,
  queryOptions,
  useMutation,
  type UseMutationOptions,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { useCallback } from 'react';

export type ReactQueryAuthConfig<User, LoginCredentials, RegisterCredentials> =
  {
    userFn: QueryFunction<User, QueryKey>;
    loginFn: MutationFunction<User, LoginCredentials>;
    registerFn: MutationFunction<User, RegisterCredentials>;
    logoutFn: MutationFunction<unknown, unknown>;
    userKey?: QueryKey;
  };

export type AuthProviderProps = {
  children: React.ReactNode;
};

export function configureAuth<
  User,
  Error,
  LoginCredentials,
  RegisterCredentials,
>(config: ReactQueryAuthConfig<User, LoginCredentials, RegisterCredentials>) {
  const {
    userFn,
    userKey = ['authenticated-user'],
    loginFn,
    registerFn,
    logoutFn,
  } = config;

  function userQueryOptions() {
    return queryOptions<User | null, Error, User, QueryKey>({
      queryFn: userFn,
      queryKey: userKey,
    });
  }

  function useUser(
    options?: Omit<
      UseQueryOptions<User | null, Error, User, QueryKey>,
      'queryKey' | 'queryFn'
    >,
  ) {
    return useQuery({
      ...userQueryOptions(),
      ...options,
    });
  }

  function useLogin(
    options?: Omit<
      UseMutationOptions<User, Error, LoginCredentials>,
      'mutationFn'
    >,
  ) {
    const queryClient = useQueryClient();

    const setUser = useCallback(
      (data: User) =>
        queryClient.setQueryData(userQueryOptions().queryKey, data),
      [queryClient],
    );

    return useMutation({
      mutationFn: loginFn,
      onSuccess: (user, ...rest) => {
        setUser(user);
        options?.onSuccess?.(user, ...rest);
      },
      ...options,
    });
  }

  function useRegister(
    options?: Omit<
      UseMutationOptions<User, Error, RegisterCredentials>,
      'mutationFn'
    >,
  ) {
    const queryClient = useQueryClient();

    const setUser = useCallback(
      (data: User) =>
        queryClient.setQueryData(userQueryOptions().queryKey, data),
      [queryClient],
    );

    return useMutation({
      mutationFn: registerFn,
      onSuccess: (user, ...rest) => {
        setUser(user);
        options?.onSuccess?.(user, ...rest);
      },
      ...options,
    });
  }

  function useLogout(options?: UseMutationOptions<unknown, Error, unknown>) {
    const queryClient = useQueryClient();

    const setUser = useCallback(
      (data: User | null) =>
        queryClient.setQueryData(userQueryOptions().queryKey, data),
      [queryClient],
    );

    return useMutation({
      mutationFn: logoutFn,
      onSuccess: (...args) => {
        setUser(null);
        options?.onSuccess?.(...args);
      },
      ...options,
    });
  }

  function AuthLoader({
    children,
    renderLoading,
    renderUnauthenticated,
    renderError = (error: Error) => <>{JSON.stringify(error)}</>,
  }: {
    children: React.ReactNode;
    renderLoading: React.ReactNode;
    renderUnauthenticated?: React.ReactNode;
    renderError?: (error: Error) => React.ReactNode;
  }) {
    const { isSuccess, isFetched, status, data, error } = useUser();

    if (isSuccess) {
      if (renderUnauthenticated && !data) {
        return <>{renderUnauthenticated}</>;
      }
      return <>{children}</>;
    }

    if (!isFetched) {
      return <>{renderLoading}</>;
    }

    if (status === 'error') {
      return <>{renderError(error)}</>;
    }
  }

  return {
    AuthLoader,
    useLogin,
    useLogout,
    useRegister,
    useUser,
    userQueryOptions,
  };
}

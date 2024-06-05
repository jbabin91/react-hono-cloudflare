import { queryOptions, useQuery } from '@tanstack/react-query';

import { client } from '@/libs/api-client';
import { type QueryConfig } from '@/libs/react-query';

const $get = client.api.users.$get;

export async function getUsers() {
  const res = await $get();
  if (!res.ok && res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to fetch users');
  return await res.json();
}

export function getUsersQueryOptions() {
  return queryOptions({
    queryFn: getUsers,
    queryKey: ['users'],
  });
}

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export function useDiscussions({ queryConfig }: UseUsersOptions = {}) {
  return useQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
}

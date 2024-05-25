import { queryOptions, useQuery } from '@tanstack/react-query';

import { client } from '@/libs/api-client';
import { type QueryConfig } from '@/libs/react-query';

export async function getUser() {
  const res = await client.api.auth.me.$get();
  return await res.json();
}

export function getUserQueryOptions() {
  return queryOptions({
    queryFn: getUser,
    queryKey: ['authorized-user'],
  });
}

type UseUserOptions = {
  queryConfig?: QueryConfig<typeof getUserQueryOptions>;
};

export function useUser({ queryConfig }: UseUserOptions = {}) {
  return useQuery({
    ...getUserQueryOptions(),
    ...queryConfig,
  });
}

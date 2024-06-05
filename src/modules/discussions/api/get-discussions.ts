import { queryOptions, useQuery } from '@tanstack/react-query';

import { client } from '@/libs/api-client';
import { type QueryConfig } from '@/libs/react-query';

const $get = client.api.discussions.$get;

export async function getDiscussions() {
  const res = await $get();
  if (!res.ok && res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to fetch discussions');
  return await res.json();
}

export function getDiscussionsQueryOptions() {
  return queryOptions({
    queryFn: getDiscussions,
    queryKey: ['discussions'],
  });
}

type UseDiscussionsOptions = {
  queryConfig?: QueryConfig<typeof getDiscussionsQueryOptions>;
};

export function useDiscussions({ queryConfig }: UseDiscussionsOptions = {}) {
  return useQuery({
    ...getDiscussionsQueryOptions(),
    ...queryConfig,
  });
}

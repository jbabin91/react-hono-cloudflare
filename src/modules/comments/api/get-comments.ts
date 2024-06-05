import { queryOptions, useQuery } from '@tanstack/react-query';

import { client } from '@/libs/api-client';
import { type QueryConfig } from '@/libs/react-query';

const $get = client.api.comments.$get;

export async function getComments() {
  const res = await $get();
  if (!res.ok && res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to fetch comments');
  return await res.json();
}

export function getCommentsQueryOptions() {
  return queryOptions({
    queryFn: getComments,
    queryKey: ['comments'],
  });
}

type UseCommentsOptions = {
  queryConfig?: QueryConfig<typeof getCommentsQueryOptions>;
};

export function useComments({ queryConfig }: UseCommentsOptions = {}) {
  return useQuery({
    ...getCommentsQueryOptions(),
    ...queryConfig,
  });
}

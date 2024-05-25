import { queryOptions, useQuery } from '@tanstack/react-query';

import { client } from '@/libs/api-client';
import { type QueryConfig } from '@/libs/react-query';

const $get = client.api.todos.$get;

export async function getTodos() {
  const res = await $get();
  if (!res.ok && res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to fetch todos');
  return await res.json();
}

export function getTodosQueryOptions() {
  return queryOptions({
    queryFn: getTodos,
    queryKey: ['todos'],
  });
}

type UseUserOptions = {
  queryConfig?: QueryConfig<typeof getTodosQueryOptions>;
};

export function useTodos({ queryConfig }: UseUserOptions = {}) {
  return useQuery({
    ...getTodosQueryOptions(),
    ...queryConfig,
  });
}

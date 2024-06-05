import { queryOptions, useQuery } from '@tanstack/react-query';

import { client } from '@/libs/api-client';
import { type QueryConfig } from '@/libs/react-query';

const $get = client.api.teams.$get;

export async function getTeams() {
  const res = await $get();
  if (!res.ok && res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to fetch teams');
  return await res.json();
}

export function getTeamsQueryOptions() {
  return queryOptions({
    queryFn: getTeams,
    queryKey: ['teams'],
  });
}

type UseTeamsOptions = {
  queryConfig?: QueryConfig<typeof getTeamsQueryOptions>;
};

export function useTeams({ queryConfig }: UseTeamsOptions = {}) {
  return useQuery({
    ...getTeamsQueryOptions(),
    ...queryConfig,
  });
}

import { queryOptions, useQuery } from '@tanstack/react-query';

import { client } from '@/libs/api-client';
import { type QueryConfig } from '@/libs/react-query';

const $get = client.api.discussions[':discussionId'].$get;

export async function getDiscussion(discussionId: string) {
  const res = await $get({
    param: {
      discussionId,
    },
  });
  if (!res.ok && res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to fetch discussion');
  return await res.json();
}

export function getDiscussionQueryOptions(discussionId: string) {
  return queryOptions({
    queryFn: () => getDiscussion(discussionId),
    queryKey: ['discussion', discussionId],
  });
}

type UseDiscussionOptions = {
  discussionId: string;
  queryConfig?: QueryConfig<typeof getDiscussionQueryOptions>;
};

export function useDiscussion({
  discussionId,
  queryConfig,
}: UseDiscussionOptions) {
  return useQuery({
    ...getDiscussionQueryOptions(discussionId),
    ...queryConfig,
  });
}

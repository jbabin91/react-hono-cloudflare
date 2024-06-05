import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/libs/api-client';
import { type MutationConfig } from '@/libs/react-query';

import { getDiscussionsQueryOptions } from './get-discussions';

const $delete = client.api.discussions[':discussionId'].$delete;

export async function deleteDiscussion(discussionId: string) {
  const res = await $delete({
    param: {
      discussionId,
    },
  });
  if (!res.ok && res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to delete discussion');
  return await res.json();
}

type UseDeleteDiscussionOptions = {
  mutationConfig?: MutationConfig<typeof deleteDiscussion>;
};

export function useDeleteDiscussion({
  mutationConfig,
}: UseDeleteDiscussionOptions) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: deleteDiscussion,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getDiscussionsQueryOptions().queryKey,
      });
      toast.success('Successfully delete discussion');
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}

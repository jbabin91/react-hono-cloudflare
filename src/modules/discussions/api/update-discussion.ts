import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type InferRequestType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/libs/api-client';
import { type MutationConfig } from '@/libs/react-query';

import { getDiscussionsQueryOptions } from './get-discussions';

const $patch = client.api.discussions[':discussionId'].$patch;

export async function updateDiscussion({
  form,
  discussionId,
}: {
  form: InferRequestType<typeof $patch>['form'];
  discussionId: string;
}) {
  const res = await $patch({
    form,
    param: {
      discussionId,
    },
  });
  if (!res.ok) throw new Error('Failed to update a discussion');
  return res.json();
}

type UseUpdateDiscussionOptions = {
  mutationConfig?: MutationConfig<typeof updateDiscussion>;
};

export function useUpdateDiscussion({
  mutationConfig,
}: UseUpdateDiscussionOptions) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: updateDiscussion,
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update discussion');
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getDiscussionsQueryOptions().queryKey,
      });
      toast.success('Discussion updated!');
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}

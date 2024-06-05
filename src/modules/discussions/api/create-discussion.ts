import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type InferRequestType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/libs/api-client';
import { type MutationConfig } from '@/libs/react-query';

import { getDiscussionsQueryOptions } from './get-discussions';

const $post = client.api.discussions.$post;

export async function createDiscussion(
  form: InferRequestType<typeof $post>['form'],
) {
  const res = await $post({ form });
  if (!res.ok) throw new Error('Failed to create a discussion');
  return res.json();
}

type UseCreateDiscussionOptions = {
  mutationConfig?: MutationConfig<typeof createDiscussion>;
};

export function useCreateDiscussion({
  mutationConfig,
}: UseCreateDiscussionOptions = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: createDiscussion,
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create discussion');
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getDiscussionsQueryOptions().queryKey,
      });
      toast.success('Discussion created!');
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}

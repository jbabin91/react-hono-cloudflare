import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type InferRequestType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/libs/api-client';
import { type MutationConfig } from '@/libs/react-query';

import { getCommentsQueryOptions } from './get-comments';

const $post = client.api.comments.$post;

export async function createComment(
  form: InferRequestType<typeof $post>['form'],
) {
  const res = await $post({ form });
  if (!res.ok) throw new Error('Failed to create a comment');
  return res.json();
}

type UseCreateCommentOptions = {
  mutationConfig?: MutationConfig<typeof createComment>;
};

export function useCreateComment({
  mutationConfig,
}: UseCreateCommentOptions = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: createComment,
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create comment');
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getCommentsQueryOptions().queryKey,
      });
      toast.success('Comment created!');
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}

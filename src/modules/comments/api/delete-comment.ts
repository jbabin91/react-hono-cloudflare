import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/libs/api-client';
import { type MutationConfig } from '@/libs/react-query';

import { getCommentsQueryOptions } from './get-comments';

const $delete = client.api.comments[':commentId'].$delete;

export async function deleteComment(commentId: string) {
  const res = await $delete({
    param: {
      commentId,
    },
  });
  if (!res.ok && res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to delete comment');
  return await res.json();
}

type UseDeleteCommentOptions = {
  mutationConfig?: MutationConfig<typeof deleteComment>;
};

export function useDeleteComment({ mutationConfig }: UseDeleteCommentOptions) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getCommentsQueryOptions().queryKey,
      });
      toast.success('Successfully delete comment');
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}

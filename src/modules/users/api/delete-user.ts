import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/libs/api-client';
import { type MutationConfig } from '@/libs/react-query';

import { getUsersQueryOptions } from './get-users';

const $delete = client.api.users[':userId'].$delete;

export async function deleteUser(userId: string) {
  const res = await $delete({
    param: {
      userId,
    },
  });
  if (!res.ok && res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to delete user');
  return await res.json();
}

type UseDeleteUserOptions = {
  mutationConfig?: MutationConfig<typeof deleteUser>;
};

export function useDeleteUser({ mutationConfig }: UseDeleteUserOptions) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getUsersQueryOptions().queryKey,
      });
      toast.success('Successfully delete user');
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}

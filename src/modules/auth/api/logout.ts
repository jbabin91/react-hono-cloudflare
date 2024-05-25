import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/libs/api-client';
import { type MutationConfig } from '@/libs/react-query';
import { getUserQueryOptions } from '@/modules/auth/api/get-user';

const $post = client.api.auth.logout.$post;

export async function logoutFn() {
  const res = await $post();
  return await res.json();
}

type UseLogoutOptions = {
  mutationConfig?: MutationConfig<typeof logoutFn>;
};

export function useLogout({ mutationConfig }: UseLogoutOptions = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: logoutFn,
    onError: (...args) => {
      console.error(args[0].message);
      toast.error('Error logging out', {
        description: 'Please try again',
      });
      onError?.(...args);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getUserQueryOptions().queryKey,
      });
      toast.success('User logged out successfully');
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}

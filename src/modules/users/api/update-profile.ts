import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type InferRequestType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/libs/api-client';
import { type MutationConfig } from '@/libs/react-query';

import { getUsersQueryOptions } from './get-users';

const $patch = client.api.users.profile.$patch;

export async function updateProfile(
  form: InferRequestType<typeof $patch>['form'],
) {
  const res = await $patch({ form });
  if (!res.ok) throw new Error('Failed to update a profile');
  return res.json();
}

type UseUpdateProfileOptions = {
  mutationConfig?: MutationConfig<typeof updateProfile>;
};

export function useUpdateProfile({ mutationConfig }: UseUpdateProfileOptions) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      console.error(error);
      toast.error('Failed to update profile');
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getUsersQueryOptions().queryKey,
      });
      toast.success('Profile updated!');
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}

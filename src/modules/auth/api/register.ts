import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type InferRequestType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/libs/api-client';
import { type MutationConfig } from '@/libs/react-query';
import { getUserQueryOptions } from '@/modules/auth/api/get-user';

const $post = client.api.auth.register.$post;

export async function registerFn(form: InferRequestType<typeof $post>['form']) {
  const res = await client.api.auth.register.$post({
    form,
  });
  if (!res.ok) throw new Error('Failed to register');
  return await res.json();
}

type UseRegisterOptions = {
  mutationConfig?: MutationConfig<typeof registerFn>;
};

export function useRegister({ mutationConfig }: UseRegisterOptions = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: registerFn,
    onError: (...args) => {
      toast.error('Error registering', {
        description: 'Please try again',
      });
      onError?.(...args);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getUserQueryOptions().queryKey,
      });
      queryClient.setQueryData(['authorized-user'], () => args[0]);
      toast.success('User created successfully');
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type InferRequestType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/libs/api-client';
import { type MutationConfig } from '@/libs/react-query';
import { getUserQueryOptions } from '@/modules/auth/api/get-user';

const $post = client.api.auth.login.$post;

export async function loginFn(form: InferRequestType<typeof $post>['form']) {
  const res = await client.api.auth.login.$post({
    form,
  });
  return await res.json();
}

type UseLoginOptions = {
  mutationConfig?: MutationConfig<typeof loginFn>;
};

export function useLogin({ mutationConfig }: UseLoginOptions = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, onError, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: loginFn,
    onError: (...args) => {
      console.error(args[0].message);
      toast.error('Error logging in', {
        description: 'Please try again',
      });
      onError?.(...args);
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getUserQueryOptions().queryKey,
      });
      toast.success('Success logged in');
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}

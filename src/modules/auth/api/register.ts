import { type InferRequestType } from 'hono';

import { client } from '@/libs/api-client';

const $registerPost = client.api.auth.register.$post;

export async function registerFn(
  form: InferRequestType<typeof $registerPost>['form'],
) {
  const res = await $registerPost({
    form,
  });
  if (!res.ok) throw new Error('Failed to register');
  return await res.json();
}

// type UseRegisterOptions = {
//   mutationConfig?: MutationConfig<typeof registerFn>;
// };

// export function useRegister({ mutationConfig }: UseRegisterOptions = {}) {
//   const queryClient = useQueryClient();

//   const { onSuccess, onError, ...restConfig } = mutationConfig ?? {};

//   return useMutation({
//     mutationFn: registerFn,
//     onError: (...args) => {
//       toast.error('Error registering', {
//         description: 'Please try again',
//       });
//       onError?.(...args);
//     },
//     onSuccess: (...args) => {
//       queryClient.invalidateQueries({
//         queryKey: getUserQueryOptions().queryKey,
//       });
//       queryClient.setQueryData(['authorized-user'], () => args[0]);
//       toast.success('User created successfully');
//       onSuccess?.(...args);
//     },
//     ...restConfig,
//   });
// }

import { type InferRequestType } from 'hono';

import { client } from '@/libs/api-client';

export const $loginPost = client.api.auth.login.$post;

export async function loginFn(
  form: InferRequestType<typeof $loginPost>['form'],
) {
  const res = await $loginPost({
    form,
  });
  if (!res.ok) throw new Error('Failed to login');
  return await res.json();
}

// type UseLoginOptions = {
//   mutationConfig?: MutationConfig<typeof loginFn>;
// };

// export function useLogin({ mutationConfig }: UseLoginOptions = {}) {
//   const queryClient = useQueryClient();

//   const { onSuccess, onError, ...restConfig } = mutationConfig ?? {};

//   return useMutation({
//     mutationFn: loginFn,
//     onError: (...args) => {
//       console.error(args[0].message);
//       toast.error('Error logging in', {
//         description: 'Please try again',
//       });
//       onError?.(...args);
//     },
//     onSuccess: (...args) => {
//       queryClient.invalidateQueries({
//         queryKey: getUserQueryOptions().queryKey,
//       });
//       toast.success('Success logged in');
//       onSuccess?.(...args);
//     },
//     ...restConfig,
//   });
// }

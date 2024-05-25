import { client } from '@/libs/api-client';

export const $logoutPost = client.api.auth.logout.$post;

export async function logoutFn() {
  const res = await $logoutPost();
  if (!res.ok) throw new Error('Failed to logout');
  return await res.json();
}

// type UseLogoutOptions = {
//   mutationConfig?: MutationConfig<typeof logoutFn>;
// };

// export function useLogout({ mutationConfig }: UseLogoutOptions = {}) {
//   const queryClient = useQueryClient();

//   const { onSuccess, onError, ...restConfig } = mutationConfig ?? {};

//   return useMutation({
//     mutationFn: logoutFn,
//     onError: (...args) => {
//       console.error(args[0].message);
//       toast.error('Error logging out', {
//         description: 'Please try again',
//       });
//       onError?.(...args);
//     },
//     onSuccess: (...args) => {
//       queryClient.invalidateQueries({
//         queryKey: getUserQueryOptions().queryKey,
//       });
//       toast.success('User logged out successfully');
//       onSuccess?.(...args);
//     },
//     ...restConfig,
//   });
// }

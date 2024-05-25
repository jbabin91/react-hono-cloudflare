import { client } from '@/libs/api-client';

export async function userFn() {
  const res = await client.api.auth.me.$get();
  if (!res.ok && res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to fetch user');
  return await res.json();
}

// export function getUserQueryOptions() {
//   return queryOptions({
//     queryFn: userFn,
//     queryKey: ['authorized-user'],
//   });
// }

// type UseUserOptions = {
//   queryConfig?: QueryConfig<typeof getUserQueryOptions>;
// };

// export function useUser({ queryConfig }: UseUserOptions = {}) {
//   return useQuery({
//     ...getUserQueryOptions(),
//     ...queryConfig,
//   });
// }

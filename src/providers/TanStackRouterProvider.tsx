import { createRouter, RouterProvider } from '@tanstack/react-router';

import { DefaultCatchBoundary } from '@/components/errors/default-catch-boundary';
import { NotFound } from '@/components/errors/not-found';
import { queryClient } from '@/libs/react-query';
import { useAuth } from '@/modules/auth';
import { routeTree } from '@/routeTree.gen';

// Create a new router instance
const router = createRouter({
  context: {
    auth: undefined!,
    queryClient,
  },
  defaultErrorComponent: DefaultCatchBoundary,
  defaultNotFoundComponent: () => <NotFound />,
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  routeTree,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

export function TanStackRouterProvider() {
  const auth = useAuth();
  return <RouterProvider context={{ auth }} router={router} />;
}

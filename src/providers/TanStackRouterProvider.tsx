import { createRouter, RouterProvider } from '@tanstack/react-router';

import { DefaultCatchBoundary } from '@/components/errors/default-catch-boundary';
import { NotFound } from '@/components/errors/not-found';
import { routeTree } from '@/routeTree.gen';

// Create a new router instance
const router = createRouter({
  defaultErrorComponent: DefaultCatchBoundary,
  defaultNotFoundComponent: () => <NotFound />,
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
  return <RouterProvider router={router} />;
}

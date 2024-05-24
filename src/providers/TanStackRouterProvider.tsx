import { createRouter, RouterProvider } from '@tanstack/react-router';

import { routeTree } from '@/routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree });

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

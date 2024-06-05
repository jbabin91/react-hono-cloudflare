import { type QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';

import {
  TanStackQueryDevtools,
  TanStackRouterDevtools,
} from '@/components/utils';
import { type AuthContext } from '@/modules/auth';

export const Route = createRootRouteWithContext<{
  auth: AuthContext;
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
        <TanStackQueryDevtools />
      </Suspense>
    </>
  );
}

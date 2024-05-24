import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import {
  TanStackQueryDevtools,
  TanStackRouterDevtools,
} from '@/components/utils';

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="flex justify-between p-2">
        <nav className="flex gap-2 p-2">
          <Link className="[&.active]:font-bold" to="/">
            Home
          </Link>{' '}
          <Link className="[&.active]:font-bold" to="/about">
            About
          </Link>{' '}
          <Link className="[&.active]:font-bold" to="/todos">
            Todos
          </Link>
        </nav>
        <ModeToggle />
      </header>
      <hr />
      <main className="mx-auto my-0 flex max-w-screen-xl flex-col p-8">
        <Outlet />
      </main>
      <Suspense>
        <TanStackRouterDevtools />
        <TanStackQueryDevtools />
      </Suspense>
    </>
  ),
});

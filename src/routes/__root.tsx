import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import {
  TanStackQueryDevtools,
  TanStackRouterDevtools,
} from '@/components/utils';
import { useLogout, useUser } from '@/modules/auth';

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="flex justify-between p-2">
        <nav className="flex gap-2 p-2">
          <Link className="[&.active]:font-bold" to="/">
            Home
          </Link>
          <Link className="[&.active]:font-bold" to="/about">
            About
          </Link>
          <Link className="[&.active]:font-bold" to="/todos">
            Todos
          </Link>
        </nav>
        <div className="flex gap-2">
          <AuthButtons />
          <ModeToggle />
        </div>
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

function AuthButtons() {
  const user = useUser();
  const logout = useLogout();

  return (
    <>
      {user.data ? (
        <div className="flex gap-2 p-2">
          <p>{user.data.name}</p>
          <Link onClick={() => logout.mutate(undefined, {})}>Logout</Link>
        </div>
      ) : (
        <div className="flex gap-2 p-2">
          <Link className="[&.active]:font-bold" to="/register">
            Register
          </Link>
          <Link className="[&.active]:font-bold" to="/login">
            Login
          </Link>
        </div>
      )}
    </>
  );
}

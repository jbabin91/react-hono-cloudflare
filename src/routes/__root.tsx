import { type QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouter,
} from '@tanstack/react-router';
import { Suspense } from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import {
  TanStackQueryDevtools,
  TanStackRouterDevtools,
} from '@/components/utils';
import { type AuthContext, useUser } from '@/modules/auth';

export const Route = createRootRouteWithContext<{
  auth: AuthContext;
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated } = Route.useRouteContext({
    select: ({ auth }) => ({ isAuthenticated: auth.isAuthenticated }),
  });

  return (
    <>
      <header className="flex justify-between p-2">
        <nav className="flex gap-2 p-2">
          <Link className="[&.active]:font-bold" to="/">
            Home
          </Link>
          <Link className="[&.active]:font-bold" to="/about">
            About
          </Link>
          {isAuthenticated ? (
            <Link className="[&.active]:font-bold" to="/todos">
              Todos
            </Link>
          ) : null}
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
  );
}

function AuthButtons() {
  const router = useRouter();
  const user = useUser();
  const navigate = Route.useNavigate();
  const { auth } = Route.useRouteContext({
    select: ({ auth }) => ({ auth }),
  });
  const logout = auth.useLogout({
    onSettled: () => navigate({ to: '/login' }),
  });

  async function handleLogout() {
    logout.mutate({});
    await router.invalidate();
  }

  return (
    <>
      {user.data ? (
        <div className="flex gap-2 p-2">
          <p>{user.data.name}</p>
          <Link onClick={handleLogout}>Logout</Link>
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

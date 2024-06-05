import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from '@tanstack/react-router';

import { Icons } from '@/components/icons';
import { ModeToggle } from '@/components/mode-toggle';
import { useUser } from '@/modules/auth';

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        search: {
          redirect: location.pathname,
        },
        to: '/login',
      });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav>
          <Link
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
            to="/"
          >
            <Icons.Package2 className="size-6" />
            <span className="sr-only">React Hono Cloudflare</span>
          </Link>
        </nav>
        <AuthButtons />
        <ModeToggle />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Outlet />
      </main>
    </div>
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

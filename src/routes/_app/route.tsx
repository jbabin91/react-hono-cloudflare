import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

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
    <>
      <Outlet />
    </>
  );
}

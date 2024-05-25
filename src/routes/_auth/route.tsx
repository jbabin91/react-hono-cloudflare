import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: Auth,
});

function Auth() {
  return (
    <div className="flex flex-col items-center py-24">
      <Outlet />
    </div>
  );
}

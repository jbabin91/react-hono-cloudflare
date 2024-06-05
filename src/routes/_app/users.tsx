import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/users')({
  component: () => <div>Hello /_app/users!</div>,
});

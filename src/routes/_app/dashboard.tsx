import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/dashboard')({
  component: () => <div>Hello /_app/dashboard!</div>,
});

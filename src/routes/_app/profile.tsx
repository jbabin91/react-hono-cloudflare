import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/profile')({
  component: () => <div>Hello /_app/profile!</div>,
});

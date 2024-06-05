import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/discussions')({
  component: () => <div>Hello /_app/discussions!</div>,
});

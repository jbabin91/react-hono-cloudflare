import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/discussions/$discussionId')({
  component: () => <div>Hello /_app/discussions/$discussionId!</div>,
});

import { createFileRoute } from '@tanstack/react-router';

import { Head } from '@/components/seo';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <>
      <Head description="About page" title="About" />
      <div className="p-2">Hello from About!</div>
    </>
  );
}

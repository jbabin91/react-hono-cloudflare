import { createFileRoute } from '@tanstack/react-router';

import viteLogo from '/vite.svg';
import reactLogo from '@/assets/react.svg';
import { Icons } from '@/components/icons';
import { Head } from '@/components/seo';
import { Button } from '@/components/ui';
import { useAuth } from '@/modules/auth';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const navigate = Route.useNavigate();
  const auth = useAuth();

  function handleStart() {
    if (auth.user) {
      navigate({ to: '/dashboard' });
    } else {
      navigate({ to: '/login' });
    }
  }

  return (
    <>
      <Head description="A fullstack application using React and Hono deployed to Cloudflare pages" />
      <div className="flex h-screen items-center">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span className="block">React Hono Cloudflare</span>
          </h2>
          <div className="flex justify-center space-x-6">
            <a href="https://vitejs.dev" rel="noreferrer" target="_blank">
              <img alt="Vite logo" className="logo" src={viteLogo} />
            </a>
            <a href="https://react.dev" rel="noreferrer" target="_blank">
              <img alt="React logo" className="logo react" src={reactLogo} />
            </a>
          </div>
          <p>Showcasing best practices for building React applications</p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Button icon={<Icons.Home />} onClick={handleStart}>
                Get Started
              </Button>
            </div>
            <div className="ml-3 inline-flex">
              <a
                href="https://github.com/jbabin91/react-hono-cloudflare"
                rel="noreferrer"
                target="_blank"
              >
                <Button icon={<Icons.GitHub />} variant="outline">
                  Github Repo
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

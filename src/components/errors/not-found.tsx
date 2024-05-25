import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui';

export function NotFound({ children }: { children?: any }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      role="alert"
    >
      <div>
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <p className="flex flex-wrap items-center gap-2">
        <Button onClick={() => window.history.back()}>Go back</Button>
        <Button>
          <Link to="/">Start Over</Link>
        </Button>
      </p>
    </div>
  );
}

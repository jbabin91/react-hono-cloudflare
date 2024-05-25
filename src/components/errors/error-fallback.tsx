import { Button } from '@/components/ui';

export function ErrorFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4" role="alert">
        <h2 className="text-3xl font-semibold text-red-500">
          Oops, something went wrong :(
        </h2>
        <Button onClick={() => window.location.assign(window.location.origin)}>
          Refresh
        </Button>
      </div>
    </div>
  );
}

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { ErrorFallback } from '@/components/errors/error-fallback';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui';
import { TanStackQueryProvider } from '@/providers/TanStackQueryProvider';
import { TanStackRouterProvider } from '@/providers/TanStackRouterProvider';

export function Providers() {
  return (
    <Suspense>
      <ThemeProvider>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <HelmetProvider>
            <TanStackQueryProvider>
              <TanStackRouterProvider />
              <Toaster richColors />
            </TanStackQueryProvider>
          </HelmetProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </Suspense>
  );
}

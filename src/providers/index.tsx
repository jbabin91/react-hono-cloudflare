import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { ErrorFallback } from '@/components/errors/error-fallback';
import { FullPageSpinner } from '@/components/full-page-spinner';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui';
import { AuthLoader, AuthProvider } from '@/modules/auth/libs/auth';
import { TanStackQueryProvider } from '@/providers/TanStackQueryProvider';
import { TanStackRouterProvider } from '@/providers/TanStackRouterProvider';

export function Providers() {
  return (
    <Suspense>
      <ThemeProvider>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <HelmetProvider>
            <TanStackQueryProvider>
              <AuthLoader renderLoading={<FullPageSpinner />}>
                <AuthProvider>
                  <TanStackRouterProvider />
                  <Toaster richColors />
                </AuthProvider>
              </AuthLoader>
            </TanStackQueryProvider>
          </HelmetProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </Suspense>
  );
}

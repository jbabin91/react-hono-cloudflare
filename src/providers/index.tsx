import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui';
import { TanStackQueryProvider } from '@/providers/TanStackQueryProvider';
import { TanStackRouterProvider } from '@/providers/TanStackRouterProvider';

export function Providers() {
  return (
    <ThemeProvider>
      <TanStackQueryProvider>
        <TanStackRouterProvider />
        <Toaster richColors />
      </TanStackQueryProvider>
    </ThemeProvider>
  );
}

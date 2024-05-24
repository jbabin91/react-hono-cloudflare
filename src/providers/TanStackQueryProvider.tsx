import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { queryClient } from '@/libs/react-query';

export function TanStackQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tanstackQueryClient] = useState(() => queryClient);
  return (
    <QueryClientProvider client={tanstackQueryClient}>
      {children}
    </QueryClientProvider>
  );
}

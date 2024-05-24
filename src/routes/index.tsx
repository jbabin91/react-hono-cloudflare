import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

import viteLogo from '/vite.svg';
import reactLogo from '@/assets/react.svg';
import { Button } from '@/components/ui';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center">
      <div className="flex justify-center">
        <a href="https://vitejs.dev" rel="noreferrer" target="_blank">
          <img alt="Vite logo" className="logo" src={viteLogo} />
        </a>
        <a href="https://react.dev" rel="noreferrer" target="_blank">
          <img alt="React logo" className="logo react" src={reactLogo} />
        </a>
      </div>
      <h1 className="text-5xl font-semibold">Vite + React</h1>
      <div className="p-8">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <p className="mt-4">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-[#888]">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

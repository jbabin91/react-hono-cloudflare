import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import { viteWranglerSpa } from '@torchauth/vite-plugin-wrangler-spa';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  return {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          manualChunks: {
            'lucide-react': ['lucide-react'],
            radix: [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-aspect-ratio',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-collapsible',
              '@radix-ui/react-context-menu',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-hover-card',
              '@radix-ui/react-label',
              '@radix-ui/react-menubar',
              '@radix-ui/react-navigation-menu',
              '@radix-ui/react-popover',
              '@radix-ui/react-progress',
              '@radix-ui/react-radio-group',
              '@radix-ui/react-scroll-area',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slider',
              '@radix-ui/react-slot',
              '@radix-ui/react-switch',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toggle',
              '@radix-ui/react-toggle-group',
              '@radix-ui/react-tooltip',
            ],
            react: ['react', 'react-dom'],
            tanstack: [
              '@tanstack/react-router',
              '@tanstack/router-devtools',
              '@tanstack/react-query',
              '@tanstack/react-query-devtools',
            ],
          },
        },
      },
    },
    plugins: [
      react(),
      TanStackRouterVite(),
      tsconfigPaths(),
      viteWranglerSpa({
        external: ['postgres'],
        wranglerConfig: {
          port: 8787,
          vars: {
            DATABASE_URL: process.env.DATABASE_URL ?? '',
          },
        },
        wranglerConfigPath: './wrangler.toml',
      }),
    ],
  };
});

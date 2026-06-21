import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const rootDir = fileURLToPath(new URL('.', import.meta.url));

  return {
    base: '/',
    server: {
      port: 3000,
      host: '127.0.0.1',
      proxy: {
        '/api/tina/gql': {
          target: 'http://localhost:4001',
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api\/tina\/gql/, '/graphql'),
        },
      },
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(rootDir),
      },
    },
  };
});

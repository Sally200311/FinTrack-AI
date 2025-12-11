import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' allows loading of all env vars, not just VITE_ prefixed ones.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist',
    },
    define: {
      // Manually define process.env to ensure variables are available at runtime
      // JSON.stringify is required to treat values as string literals
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY || env.VITE_API_KEY),
        VITE_FIREBASE_API_KEY: JSON.stringify(env.VITE_FIREBASE_API_KEY),
        VITE_FIREBASE_AUTH_DOMAIN: JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
        VITE_FIREBASE_PROJECT_ID: JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
        VITE_FIREBASE_STORAGE_BUCKET: JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET),
        VITE_FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
        VITE_FIREBASE_APP_ID: JSON.stringify(env.VITE_FIREBASE_APP_ID),
      }
    }
  };
});
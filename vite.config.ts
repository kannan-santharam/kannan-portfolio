import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { apiChatDevPlugin } from './src/server/devChatMiddleware.ts';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      apiChatDevPlugin(env),
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ]
  };
});

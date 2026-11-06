import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH is set by the GitHub Pages workflow (e.g. "/RAAWI/"); defaults to "/" locally.
const CSP =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; " +
  "media-src 'self' blob: mediastream:; font-src 'self' data:; connect-src 'self' https:; worker-src 'self' blob:; base-uri 'self'; form-action 'none'";

export default defineConfig(({ command }) => ({
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    react(),
    {
      // Production-only CSP (Vite dev injects inline scripts). GitHub Pages cannot set headers, so a meta tag is used.
      name: 'nazar-csp',
      transformIndexHtml: (html: string) =>
        command === 'build' ? html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`) : html,
    },
  ],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
  test: { include: ['src/**/*.test.ts'], environment: 'node' },
}));

/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // Código compartido con las funciones del servidor (`/api`): vive fuera de `frontend/`.
      { find: /^@\/shared\//, replacement: fileURLToPath(new URL('../shared/', import.meta.url)) },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
  build: {
    rolldownOptions: {
      output: {
        // Librerías grandes en archivos propios: se cachean aparte y no cambian con cada deploy.
        codeSplitting: {
          groups: [
            {
              name: 'react',
              test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
            },
            {
              name: 'animation',
              test: /node_modules[\\/](motion|motion-dom|framer-motion|gsap|@gsap|lenis)[\\/]/,
            },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})

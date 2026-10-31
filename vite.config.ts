import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function src(folder: string): string {
  return fileURLToPath(new URL(`./src/${folder}`, import.meta.url))
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@domain': src('domain'),
      '@data': src('data'),
      '@infra': src('infra'),
      '@main': src('main'),
      '@app': src('app'),
      '@components': src('presentation/components'),
      '@flows': src('presentation/flows'),
      '@styles': src('presentation/styles'),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8788',
        changeOrigin: true,
      },
    },
  },
})

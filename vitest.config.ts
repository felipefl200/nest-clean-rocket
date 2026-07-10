import path from 'node:path'

import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  oxc: false,
  plugins: [
    swc.vite({
      tsconfigFile: 'tsconfig.spec.json',
    }),
  ],
  resolve: {
    alias: {
      '@/src': path.resolve(__dirname, './src'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/domain': path.resolve(__dirname, './src/domain'),
      '@/infra': path.resolve(__dirname, './src/infrastructure'),
      '@/prisma': path.resolve(__dirname, './prisma'),
      '@/test': path.resolve(__dirname, './test'),
    },
  },
  test: {
    globals: false,
    environment: 'node',
    setupFiles: ['reflect-metadata'],
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'json', 'html'],
    },
  },
})

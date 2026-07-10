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
    globals: true,
    environment: 'node',
    setupFiles: ['reflect-metadata', './test/setup-prisma.ts'],
    include: ['test/**/*.e2e-spec.ts', 'src/**/*.e2e-spec.ts'],
    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
  },
})

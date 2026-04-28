import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig, 
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'], 
      // SỬA TẠI ĐÂY: Thêm .js và .jsx để máy nhận diện được các file test bạn đã viết
      include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'], 
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'], 
        exclude: [
          'node_modules/**',
          '**/postcss.config.js',  
          '**/tailwind.config.js',
          'eslint.config.js',
          'vite.config.ts',
          'vitest.config.ts',
          'playwright.config.ts',
          'src/main.tsx',
          'src/vite-env.d.ts',
          '**/*.test.tsx',
          '**/*.test.ts',
          '**/*.test.jsx',
          '**/*.test.js',
        ],
      },
    },
  })
)
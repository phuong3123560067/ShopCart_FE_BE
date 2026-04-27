// import { defineConfig } from 'vite'
// import react, { reactCompilerPreset } from '@vitejs/plugin-react'
// import babel from '@rolldown/plugin-babel'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     babel({ presets: [reactCompilerPreset()] })
//   ],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
      react(),
    ],
    test: {
      globals: true, 
      environment: 'jsdom',
      setupFiles: './src/tests/setup.js',
      include: ['src/**/*.{test,spec}.{js,jsx}'],
    },
})

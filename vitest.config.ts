import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const fromRoot = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  // Cast: Next 16 installs rolldown-vite as `vite`, so @vitejs/plugin-react's Plugin type differs
  // from the one vitest/config expects. Runtime is unaffected.
  plugins: [react() as never],
  resolve: {
    // MUI imports react-transition-group via directory subpaths (no `exports` map), which Node ESM
    // can't resolve — pin them to the package's esm files.
    alias: [
      {
        find: /^react-transition-group\/Transition$/,
        replacement: fromRoot('./node_modules/react-transition-group/esm/Transition.js'),
      },
      {
        find: /^react-transition-group\/TransitionGroupContext$/,
        replacement: fromRoot('./node_modules/react-transition-group/esm/TransitionGroupContext.js'),
      },
      { find: '@', replacement: fromRoot('./src') },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    // Inline every package that reaches MUI so Vite transforms it and the react-transition-group
    // aliases above apply (externalized packages load via Node's ESM loader, which ignores them).
    server: { deps: { inline: [/@mui\//, /mui-tel-input/, /@mkdigitalsk\/design-system/] } },
  },
})

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      // Entry points only wire the tested modules to the browser; the integration tests cover them.
      exclude: [
        'src/background/index.ts',
        'src/content/index.ts',
        'src/popup/popup.ts',
        'src/options/options.ts',
      ],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});

import { defineConfig } from 'vitest/config';

// Loads the built extension into a real browser. Run `npm run build` first
// (`npm run test:integration` does both).
export default defineConfig({
  test: {
    include: ['tests/integration/**/*.test.ts'],
    environment: 'node',
    testTimeout: 30_000,
    hookTimeout: 30_000,
    fileParallelism: false,
  },
});

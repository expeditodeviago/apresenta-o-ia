import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 10000,
  workers: 1,
  use: {
    baseURL: 'http://localhost:4184',
    reducedMotion: 'reduce',
    headless: true,
    screenshot: 'off',
    video: 'off',
    trace: 'off',
  },
});

import fs from 'node:fs';
import { chromium, defineConfig } from '@playwright/test';

const hasBundledChromium = fs.existsSync(chromium.executablePath());

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: hasBundledChromium
        ? { browserName: 'chromium' }
        : { browserName: 'chromium', channel: 'chrome' },
    },
  ],
  webServer: {
    command: 'npx next start -p 3100 -H 127.0.0.1',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 1440, height: 1050 },
    browserName: "chromium",
    channel: process.env.PW_CHANNEL || undefined,
  },
  webServer: process.env.PW_EXTERNAL_SERVER
    ? undefined
    : {
        command: "npm run start -- --hostname 127.0.0.1",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 60000,
      },
});

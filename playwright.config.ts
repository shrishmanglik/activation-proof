import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3187";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3187",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: "desktop-chrome", testIgnore: /screenshot\.spec\.ts/, use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", testIgnore: /screenshot\.spec\.ts/, use: { ...devices["Pixel 5"] } },
    { name: "screenshot", testMatch: /screenshot\.spec\.ts/, use: { ...devices["Desktop Chrome"] } },
  ],
});

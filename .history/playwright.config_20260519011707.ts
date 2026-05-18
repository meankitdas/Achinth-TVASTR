/**
 * Playwright configuration for the Light_Theme Industrial Redesign integration suite.
 *
 * Pinned to a single Chromium project that mirrors the Desktop_Reference_Device profile
 * defined in requirements.md (Requirement 19 / Glossary): 1920x1080 viewport, devicePixelRatio
 * of 1, no network throttling, headless. Tests run against the production build served by
 * `pnpm preview` (Vite's preview server, default port 4173).
 *
 * Wired in via the `test:e2e` npm script (`playwright test`).
 *
 * @see .kiro/specs/light-theme-industrial-redesign/requirements.md  Requirement 19.3, 19.6
 * @see .kiro/specs/light-theme-industrial-redesign/design.md        §Testing Strategy > Integration tests (Playwright)
 */
import { defineConfig, devices } from "@playwright/test";

const PREVIEW_PORT = 4173;
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;

export default defineConfig({
  testDir: "src/__tests__/integration",
  testMatch: ["**/*.spec.ts", "**/*.spec.tsx"],

  // Generous but bounded timeouts — integration suites should be deterministic.
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // Run tests serially in CI to keep the Desktop_Reference_Device profile stable.
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,

  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],

  use: {
    baseURL: PREVIEW_URL,
    headless: true,
    // Desktop_Reference_Device: 1920x1080 @ devicePixelRatio 1, no network throttling.
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    // No `launchOptions.proxy` and no per-test `route` throttling: network is unthrottled.
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium-desktop-reference",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
      },
    },
  ],

  // Boot the production build via `pnpm preview` so integration runs hit the same
  // artifact that Lighthouse CI measures.
  webServer: {
    command: "pnpm preview",
    url: PREVIEW_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});

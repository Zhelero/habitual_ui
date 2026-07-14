import { defineConfig, devices } from "@playwright/test";

export default defineConfig({

    testDir: "./e2e",
    // Tests share one backend/DB instance (webServer below), so running
    // them concurrently causes intermittent, hard-to-reproduce failures
    // (race conditions on the shared server, not bugs in the tests
    // themselves). Force a single worker so every run is deterministic.
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: "html",
    globalSetup: "./e2e/global-setup.js",

    use: {
        baseURL: "http://localhost:5173",
        trace: "on-first-retry",
    },

    // CI runners are slower/shared, so give assertions more headroom than
    // the 5s default — habit creation and mark-done both involve a POST
    // followed by a full dashboard refetch, which can exceed 5s under load
    // even though it's fast locally.
    expect: {
        timeout: process.env.CI ? 10_000 : 5_000,
    },

    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],

    webServer: {
        command: "npm run dev",
        url: "http://localhost:5173",
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
    },
});
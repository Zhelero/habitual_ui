import { test as base, expect } from "@playwright/test";
import { API_BASE, TEST_PASSWORD, uniqueEmail } from "./helpers";

export const test = base.extend({
    // Creates a fresh user directly via the API — fast, and keeps every
    // test isolated from every other test's data even though we're hitting
    // a real, persistent database (no transaction rollback like in pytest).
    registeredUser: async ({ request }, use) => {
        const email = uniqueEmail();

        const response = await request.post(`${API_BASE}/auth/register/`, {
            data: { email, password: TEST_PASSWORD },
        });

        expect(response.ok()).toBeTruthy();

        await use({ email, password: TEST_PASSWORD });
    },

    // Logs in through the real login form (not an API shortcut), so every
    // test that uses this fixture also exercises the login flow itself.
    authedPage: async ({ page, registeredUser }, use) => {
        await page.goto("/");

        await page.getByPlaceholder("Email").fill(registeredUser.email);
        await page.getByPlaceholder("Password").fill(registeredUser.password);
        await page.getByTestId("auth-tab-login-button").click();

        await expect(
            page.getByRole("button", { name: "+ Add habit" })
        ).toBeVisible();

        await use(page);
    },
});

export { expect };
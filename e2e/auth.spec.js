import { test, expect } from "./fixtures";
import { uniqueEmail, TEST_PASSWORD } from "./helpers";

test.describe("Authentication", () => {
    test("a new user can register and is told to sign in", async ({ page }) => {
        await page.goto("/");

        await page.getByTestId("auth-tab-register").click();

        await page.getByPlaceholder("Email").fill(uniqueEmail());
        await page.getByPlaceholder("Password").fill(TEST_PASSWORD);
        await page.getByTestId("auth-tab-register-button").click();

        await expect(
            page.getByText("Account created. Please sign in.")
        ).toBeVisible();
    });

    test("a registered user can log in and reach the dashboard", async ({
                                                                            page,
                                                                            registeredUser,
                                                                        }) => {
        await page.goto("/");

        await page.getByPlaceholder("Email").fill(registeredUser.email);
        await page.getByPlaceholder("Password").fill(registeredUser.password);
        await page.getByTestId("auth-tab-login-button").click();

        await expect(page.getByRole("heading", { name: "Habitual" })).toBeVisible();
        await expect(page.getByText("Signed in as")).toContainText(registeredUser.email);
    });

    test("shows an error for invalid credentials", async ({ page, registeredUser }) => {
        await page.goto("/");

        await page.getByPlaceholder("Email").fill(registeredUser.email);
        await page.getByPlaceholder("Password").fill("totally-wrong-password");
        await page.getByTestId("auth-tab-login-button").click();

        await expect(page.locator("ul.list-disc li").first()).toBeVisible();
    });

    test("a logged in user can log out", async ({ authedPage }) => {
        await authedPage.getByRole("button", { name: "Logout" }).click();

        await expect(
            authedPage.getByTestId("auth-tab-login")
        ).toBeVisible();
    });
});
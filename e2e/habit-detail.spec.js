import { test, expect } from "./fixtures";
import {createHabitViaUI, markHabitDoneViaUI } from "./helpers.js";

test.describe("Habit detail page", () => {
    test("navigating from the dashboard shows stats and a back link", async ({
                                                                                 authedPage,
                                                                             }) => {
        await createHabitViaUI(authedPage, "Stretch");

        await authedPage.getByRole("heading", { name: "Stretch" }).getByRole("link").click();

        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);
        await expect(authedPage.getByRole("heading", { name: "Stretch" })).toBeVisible();

        await expect(authedPage.getByText("Current streak")).toBeVisible();
        await expect(authedPage.getByText("Best streak")).toBeVisible();
        await expect(authedPage.getByText("Last 7 days")).toBeVisible();
        await expect(authedPage.locator("p.text-slate-500", { hasText: "Last 30 days" })).toBeVisible();
        await expect(authedPage.getByText("Tracking since")).toBeVisible();

        await authedPage.getByRole("button", { name: "← Back to dashboard" }).click();
        await expect(authedPage).toHaveURL("/");
    });

    test("editing a habit's name from the detail page updates it everywhere", async ({
                                                                                         authedPage,
                                                                                     }) => {
        await createHabitViaUI(authedPage, "Old name");

        await authedPage.getByRole("heading", { name: "Old name" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await authedPage.getByRole("button", { name: "Edit" }).click();
        await authedPage.getByPlaceholder("Habit name").fill("New name");
        await authedPage.getByRole("button", { name: "Update" }).click();

        await expect(authedPage.getByRole("heading", { name: "New name" })).toBeVisible();

        await authedPage.getByRole("button", { name: "← Back to dashboard" }).click();
        await expect(authedPage.getByRole("heading", { name: "New name" })).toBeVisible();
    });

    test("marking a habit done from the detail page is reflected immediately", async ({
                                                                                          authedPage,
                                                                                      }) => {
        await createHabitViaUI(authedPage, "Journal");

        await authedPage.getByRole("heading", { name: "Journal" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await markHabitDoneViaUI(authedPage)
        await expect(authedPage.getByRole("button", { name: "Done ✓" })).toBeVisible();
    });

    test("marking a habit done with a note from the detail page completes the flow", async ({
                                                                                                authedPage
    }) => {
        await createHabitViaUI(authedPage, "Read");

        await authedPage.getByRole("heading", { name: "Read" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await markHabitDoneViaUI(authedPage, "Felt great today");
        await expect(authedPage.getByRole("button", { name: "Done ✓" })).toBeVisible();
    });

    test("archiving a habit from detail page affects dashboard", async ({
                                                                        authedPage,
                                                                    }) => {
        authedPage.on("dialog", (dialog) => dialog.accept());

        await createHabitViaUI(authedPage, "Stretch");

        await authedPage.getByRole("heading", { name: "Stretch" }).getByRole("link").click();

        const habitToggleArchive = authedPage.getByTestId("habit-detail-toggle-archive")

        await expect(habitToggleArchive).toHaveText("Archive");

        await habitToggleArchive.click();

        await expect(habitToggleArchive).toHaveText("Restore");

        await authedPage.getByRole("button", {name: "← Back to dashboard",}).click();

        await expect(authedPage.getByTestId("dashboard-total-habits-amount")).toHaveText("0");
        await expect(authedPage.getByText("No habits yet. Add your first one.")).toBeVisible();
    })

    test("API validation errors are shown when editing a habit fails", async ({
                                                                                  authedPage,
                                                                              }) => {
        await createHabitViaUI(authedPage, "Old name");

        await authedPage.getByRole("heading", { name: "Old name" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await authedPage.route("**/habits/*/", async (route) => {
            if (route.request().method() !== "PATCH") {
                    return route.continue();
            }

            await route.fulfill({
                status: 422,
                contentType: "application/json",
                body: JSON.stringify({
                    detail: [
                        {
                            loc: ["body", "name"],
                            msg: "Test validation error",
                        },
                    ],
                }),
            });
        });

        await authedPage.getByRole("button", { name: "Edit" }).click();
        await authedPage.getByPlaceholder("Habit name").fill("New name");
        await authedPage.getByRole("button", { name: "Update" }).click();

        await expect(
            authedPage.getByTestId("toast-error")
        ).toHaveText("name: Test validation error");

        // The form should stay open on error, so the user can fix the name
        // and retry instead of losing what they typed.
        await expect(
            authedPage.getByPlaceholder("Habit name")
        ).toHaveValue("New name");
    });

    test("validation errors are shown when marking a habit done fails from the detail page", async ({
                                                                                                        authedPage,
                                                                                                    }) => {
        await createHabitViaUI(authedPage, "Journal");

        await authedPage.getByRole("heading", { name: "Journal" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await authedPage.route("**/habits/*/done/", async (route) => {
            if (route.request().method() !== "POST") {
                return route.continue();
            }

            await route.fulfill({
                status: 422,
                contentType: "application/json",
                body: JSON.stringify({
                    detail: [
                        {
                            loc: ["body", "extra_field"],
                            msg: "Extra inputs are not permitted",
                        },
                    ],
                }),
            });
        });

        const note = "Draw a picture"
        await markHabitDoneViaUI(authedPage, note);

        await expect(
            authedPage.getByTestId("toast-error")
        ).toHaveText("extra_field: Extra inputs are not permitted");

        await expect(
            authedPage.getByPlaceholder("Add a note...")
        ).toHaveValue(note);
    });

});
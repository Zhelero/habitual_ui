import { test, expect } from "./fixtures";
import {createHabitViaUI, markHabitDoneViaUI} from "./helpers.js";

test.describe("Habits", () => {
    test("creating a habit shows it on the dashboard", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Read 20 pages");

        await expect(authedPage.getByTestId("dashboard-total-habits-amount")).toHaveText("1");
        await expect(authedPage.getByRole("heading", { name: "Read 20 pages" })).toBeVisible();
    });

    test("editing a habit updates its name", async ({ authedPage }) => {
        const name = "Buy a book";
        const newName = "Sell it"
        await createHabitViaUI(authedPage, name);

        await expect(authedPage.getByTestId("dashboard-total-habits-amount")).toHaveText("1");
        await expect(authedPage.getByRole("heading", { name })).toBeVisible();

        await authedPage.getByRole("button", {name: "Edit"}).click()
        await authedPage.getByPlaceholder("Habit name").fill(newName);
        await authedPage.getByRole("button", { name: "Update" }).click();

        await expect(authedPage.getByText(newName)).toBeVisible();
        await expect(authedPage.getByText(name)).not.toBeVisible();
    });

    test("marking a habit done toggles its state", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Drink water");

        await markHabitDoneViaUI(authedPage)

        await expect(authedPage.getByRole("button", { name: "Done ✓" })).toBeVisible();
        await expect(authedPage.getByTestId("dashboard-completed-today-amount")).toHaveText("1");
        await expect(authedPage.getByTestId("dashboard-best-streak-amount")).toHaveText("1 🔥");

        await authedPage.getByRole("button", { name: "Done ✓" }).click();

        await expect(authedPage.getByRole("button", { name: "Mark done" })).toBeVisible();
        await expect(authedPage.getByTestId("dashboard-completed-today-amount")).toHaveText("0");
        await expect(authedPage.getByTestId("dashboard-best-streak-amount")).toHaveText("0");
    });

    test("marking a habit done with a note completes the flow", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Journal");

        const note = "Felt great today"

        await markHabitDoneViaUI(authedPage, note);

        await expect(authedPage.getByRole("button", { name: "Done ✓" })).toBeVisible();
        await expect(authedPage.getByTestId("dashboard-completed-today-amount")).toHaveText("1");

        await authedPage.getByRole("heading", { name: "Journal" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await expect(authedPage.getByText(note)).toBeVisible();
    });

    test("archiving a habit moves it to the Archived tab, and it can be restored", async ({authedPage,}) => {
        authedPage.on("dialog", (dialog) => dialog.accept());

        await createHabitViaUI(authedPage, "Meditate");

        const archiveToggle = authedPage.getByTestId("habit-toggle-archive");

        await expect(archiveToggle).toHaveText("Archive");
        await archiveToggle.click();

        await expect(authedPage.getByText("No habits yet. Add your first one.")).toBeVisible();
        await expect(authedPage.getByTestId("dashboard-total-habits-amount")).toHaveText("0");

        await authedPage.getByRole("button", { name: "Archived", exact: true }).click();

        await expect(authedPage.getByRole("heading", { name: "Meditate" })).toBeVisible();
        await expect(authedPage.getByTestId("habit-badge-archived")).toBeVisible();
        await expect(archiveToggle).toHaveText("Restore");

        await archiveToggle.click();

        await expect(authedPage.getByText("No habits here yet.")).toBeVisible();

        await authedPage.getByRole("button", { name: "Active", exact: true }).click();

        await expect(authedPage.getByRole("heading", { name: "Meditate" })).toBeVisible();
        await expect(authedPage.getByTestId("dashboard-total-habits-amount")).toHaveText("1");
        await expect(archiveToggle).toHaveText("Archive");
    });

    test("archived habit cannot be marked done", async ({ authedPage }) => {
        authedPage.on("dialog", (dialog) => dialog.accept());

        await createHabitViaUI(authedPage, "Think about it");

        const archiveToggle = authedPage.getByTestId("habit-toggle-archive");

        await expect(archiveToggle).toHaveText("Archive");
        await archiveToggle.click();

        await expect(authedPage.getByText("No habits yet. Add your first one.")).toBeVisible();
        await expect(authedPage.getByTestId("dashboard-total-habits-amount")).toHaveText("0");

        await authedPage.getByRole("button", { name: "Archived", exact: true }).click();

        await expect(authedPage.getByRole("heading", { name: "Think about it" })).toBeVisible();
        await expect(authedPage.getByRole("button", { name: "Mark done" })).toBeDisabled();
    });

    test("creating a habit with duplicate name shows an error", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Some action");

        await authedPage.getByRole("button", { name: "+ Add habit" }).click();
        await authedPage.getByPlaceholder("Habit name").fill("Some action");
        await authedPage.getByRole("button", { name: "Create" }).click();

        await expect(authedPage.getByTestId("toast-error")).toHaveText("Habit already exists");
        await expect(authedPage.getByTestId("modal-backdrop")).toBeVisible();
        await expect(authedPage.getByTestId("dashboard-total-habits-amount")).toHaveText("1");
    });

    test("cannot create a habit with an empty and whitespaces only name", async ({ authedPage }) => {
        await authedPage.getByRole("button", { name: "+ Add habit" }).click();

        const createButton = authedPage.getByRole("button", { name: "Create" });
        const habitNameInput = authedPage.getByPlaceholder("Habit name");

        await expect(createButton).toBeDisabled();

        await habitNameInput.fill("      ");

        await expect(createButton).toBeDisabled();

        await habitNameInput.fill("Read a book");

        await expect(createButton).toBeEnabled();
    });

    test("API validation errors are shown to the user", async ({ authedPage }) => {

        await authedPage.route("**/habits/", async route => {
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

        await authedPage.getByRole("button", { name: "+ Add habit" }).click();
        await authedPage.getByPlaceholder("Habit name").fill("My habit");
        await authedPage.getByRole("button", { name: "Create" }).click();

        await expect(
            authedPage.getByTestId("toast-error")
        ).toHaveText("name: Test validation error");
    })

    test("validation errors are shown when marking a habit done fails", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Journal");

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

        const note = "Write some notes"

        await authedPage.getByRole("button", { name: "Mark done" }).click();
        await authedPage.getByPlaceholder("Add a note...").fill(note);
        await authedPage.getByRole("button", { name: "Save" }).click();

        await expect(
            authedPage.getByTestId("toast-error")
        ).toHaveText("extra_field: Extra inputs are not permitted");

        // The dialog should stay open on error, so the user can fix the note
        // and retry instead of losing what they typed.
        await expect(
            authedPage.getByPlaceholder("Add a note...")
        ).toHaveValue(note);
    });
});
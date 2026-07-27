import { test, expect } from "./fixtures";
import {createHabitViaUI, markHabitDoneViaUI} from "./helpers.js";

test.describe("Dashboard persistence", () => {
    test("selected theme is preserved after refresh", async ({ authedPage }) => {
        await authedPage.getByTestId("theme-toggle").click();

        await expect(authedPage.getByTestId("theme-toggle")).toHaveText("☀️");

        await authedPage.reload()

        await expect(authedPage.getByTestId("theme-toggle")).toHaveText("☀️");
    })

    test("habit completion state is preserved after refresh", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Sit down");

        await markHabitDoneViaUI(authedPage)

        await expect(authedPage.getByTestId("dashboard-completed-today-amount")).toHaveText("1");

        await authedPage.reload()

        await expect(authedPage.getByRole("button", { name: "Done ✓" })).toBeVisible();
        await expect(authedPage.getByTestId("dashboard-completed-today-amount")).toHaveText("1");
    })

    test("selected dashboard filter is preserved after refresh", async ({ authedPage }) => {
        authedPage.on("dialog", (dialog) => dialog.accept());

        await createHabitViaUI(authedPage, "Walk around");

        await authedPage.getByTestId("habit-toggle-archive").click();
        await authedPage.getByRole("button", { name: "Archived", exact: true }).click();

        await expect(authedPage.getByRole("heading", { name: "Walk around" })).toBeVisible();
        await expect(authedPage.getByTestId("habit-badge-archived")).toBeVisible();
        await expect(authedPage.getByTestId("dashboard-total-habits-amount")).toHaveText("0");

        await authedPage.reload()

        await expect(authedPage.getByTestId("habit-badge-archived")).toBeVisible();
        await expect(authedPage.getByTestId("dashboard-total-habits-amount")).toHaveText("0");
        await expect(authedPage.getByRole("heading", { name: "Walk around" })).toBeVisible();
    })
})
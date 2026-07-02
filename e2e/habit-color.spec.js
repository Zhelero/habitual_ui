import { test, expect } from "./fixtures"
import {createHabitViaUI} from "./helpers.js";

test.describe("Habit color picker", () => {
    test("selecting a color highlights it and clears the others", async ({ authedPage }) => {
        await authedPage.getByRole("button", { name: "+ Add habit" }).click();

        const emerald = authedPage.getByTestId("habit-color-option-emerald");
        const blue = authedPage.getByTestId("habit-color-option-blue");

        await expect(emerald).toHaveAttribute("data-selected", "false");

        await emerald.click();
        await expect(emerald).toHaveAttribute("data-selected", "true");

        await blue.click();
        await expect(blue).toHaveAttribute("data-selected", "true");
        await expect(emerald).toHaveAttribute("data-selected", "false");
    });

    test("creating a habit with a color shows the color dot on the dashboard", async ({ authedPage }) => {
        await authedPage.getByRole("button", { name: "+ Add habit" }).click();
        await authedPage.getByPlaceholder("Habit name").fill("Read 20 pages");
        await authedPage.getByTestId("habit-color-option-violet").click();
        await authedPage.getByRole("button", { name: "Create" }).click();

        await expect(authedPage.getByRole("heading", { name: "Read 20 pages"})).toBeVisible();

        const dot = authedPage.getByTestId("habit-color-dot");
        await expect(dot).toBeVisible();
        await expect(dot).toHaveAttribute("data-color", "violet");
    });

    test("creating a habit without a color shows no color dot", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Drink water");

        await expect(authedPage.getByTestId("habit-color-dot")).not.toBeVisible();
    });

    test("editing a habit's color from the detail page updates the dot everywhere", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Stretch");

        await authedPage.getByRole("heading", { name: "Stretch" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await expect(authedPage.getByTestId("habit-color-dot")).not.toBeVisible();

        await authedPage.getByRole("button", { name: "Edit" }).click();
        await authedPage.getByTestId("habit-color-option-amber").click();
        await authedPage.getByRole("button", { name: "Update" }).click();

        const detailDot = authedPage.getByTestId("habit-color-dot");
        await expect(detailDot).toBeVisible();
        await expect(detailDot).toHaveAttribute("data-color", "amber");

        await authedPage.getByRole("button", { name: "← Back to dashboard" }).click();

        const dashboardDot = authedPage.getByTestId("habit-color-dot");
        await expect(dashboardDot).toBeVisible();
        await expect(dashboardDot).toHaveAttribute("data-color", "amber");
    });

    test("selected color survives a page refresh", async ({ authedPage }) => {
        await authedPage.getByRole("button", { name: "+ Add habit"}).click();
        await authedPage.getByPlaceholder("Habit name").fill("Meditate");
        await authedPage.getByTestId("habit-color-option-slate").click();
        await authedPage.getByRole("button", { name: "Create" }).click();

        await expect(authedPage.getByTestId("habit-color-dot")).toHaveAttribute("data-color", "slate");

        await authedPage.reload();

        await expect(authedPage.getByTestId("habit-color-dot")).toHaveAttribute("data-color", "slate");
    })
})
import { test, expect } from "./fixtures";
import {createHabitViaUI, markHabitDoneViaUI } from "./helpers.js";

test.describe("Habit heatmap", () => {
    test("new habit shows every day as no activity", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Meditate");

        await authedPage.getByRole("heading", { name: "Meditate" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        const days = authedPage.getByTestId("heatmap-day");
        await expect(days).toHaveCount(30);

        for (const day of await days.all()) {
            await expect(day).toHaveAttribute("data-state", "none");
        }
    });

    test("marking a habit done without a note colors today as done", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Walk");

        await authedPage.getByRole("heading", { name: "Walk" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await markHabitDoneViaUI(authedPage);

        const days = authedPage.getByTestId("heatmap-day");
        const today = days.last();
        await expect(today).toHaveAttribute("data-state", "done");

        //Only today's cell should change - the rest of the 30-day window stays untouched
        for (const day of (await days.all()).slice(0, -1)) {
            await expect(day).toHaveAttribute("data-state", "none");
        }
    });

    test("marking a habit done with a note colors today as done+note and shows it in the tooltip", async ({
                                                                                                              authedPage
                                                                                                          }) => {
        await createHabitViaUI(authedPage, "Read");

        await authedPage.getByRole("heading", { name: "Read" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        const note = "Finished chapter 3";
        await markHabitDoneViaUI(authedPage, note);

        const today = authedPage.getByTestId("heatmap-day").last();
        await expect(today).toHaveAttribute("data-state", "done-note");
        await expect(today).toHaveAttribute("title", new RegExp(`— ${note}$`));
    });

    test("the legend explains all three states", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Stretch");

        await authedPage.getByRole("heading", { name: "Stretch" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await expect(authedPage.getByText("No activity")).toBeVisible();
        await expect(authedPage.getByText("Done", { exact: true })).toBeVisible();
        await expect(authedPage.getByText("Done + note")).toBeVisible();
    });

    test("undo a completion reverts today's cell back to no activity", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Walk");

        await authedPage.getByRole("heading", { name: "Walk" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await markHabitDoneViaUI(authedPage);

        const today = authedPage.getByTestId("heatmap-day").last();
        await expect(today).toHaveAttribute("data-state", "done");

        await authedPage.getByRole("button", { name: "Done ✓"}).click();
        await expect(today).toHaveAttribute("data-state", "none");
    })
});
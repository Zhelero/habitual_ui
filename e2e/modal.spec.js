import { test, expect } from "./fixtures";
import {createHabitViaUI} from "./helpers.js";

test.describe("Modal", () => {
   test("pressing Escape closes modal", async ({ authedPage }) => {
       await createHabitViaUI(authedPage, "Drink water");

       await authedPage.getByRole("button", { name: "Edit" }).click();

       await expect(authedPage.getByTestId("modal-backdrop")).toBeVisible();

       await authedPage.keyboard.press("Escape");

       await expect(authedPage.getByTestId("modal-backdrop")).not.toBeVisible();
   });

    test("clicking modal backdrop closes modal", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Drink water");

        await authedPage.getByRole("button", { name: "Edit" }).click();

        const backdrop = authedPage.getByTestId("modal-backdrop");

        await expect(backdrop).toBeVisible();

        await backdrop.click({ position: { x: 5, y: 5 } });

        await expect(backdrop).not.toBeVisible();
    });

    test("clicking inside modal does not close modal", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Drink water");

        await authedPage.getByRole("button", { name: "Edit" }).click();

        const backdrop = authedPage.getByTestId("modal-backdrop");

        await expect(backdrop).toBeVisible();

        await authedPage.getByPlaceholder("Habit name").click();

        await expect(backdrop).toBeVisible();
    });

});
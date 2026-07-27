import { test, expect } from "./fixtures";
import {createHabitViaUI, markHabitDoneViaUI} from "./helpers.js";

test.describe("Habit dialog", () => {
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

    test("cancel closes new habit dialog", async ({ authedPage }) => {
        await authedPage.getByRole("button", { name: "+ Add habit" }).click();
        await authedPage.getByPlaceholder("Habit name").fill("Sail away");

        await expect(authedPage.getByTestId("modal-backdrop")).toBeVisible();

        await authedPage.getByRole("button", { name: "Cancel" }).click();

        await expect(authedPage.getByTestId("modal-backdrop")).not.toBeVisible();
    });

    test("cancel closes habit edit modal", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Sleep");

        await authedPage.getByRole("heading", { name: "Sleep" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await authedPage.getByRole("button", { name: "Edit" }).click();

        await expect(authedPage.getByTestId("modal-backdrop")).toBeVisible();

        await authedPage.getByRole("button", { name: "Cancel" }).click();

        await expect(authedPage.getByTestId("modal-backdrop")).not.toBeVisible();
    });
});

test.describe("Completion note dialog", () => {
    test("clicking backdrop while marking a habit done discards the note", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Write");

        await authedPage.getByRole("button", { name: "Mark done" }).click();
        await authedPage.getByPlaceholder("Add a note...").fill("Draft I don't want to save");

        await authedPage.getByTestId("modal-backdrop").click({ position: { x: 5, y: 5 } });

        await expect(authedPage.getByTestId("modal-backdrop")).not.toBeVisible();
        await expect(authedPage.getByRole("button", { name: "Mark done" })).toBeVisible();
    });

    test("character counter updates when marking a habit done with a note", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Write");

        await authedPage.getByRole("heading", { name: "Write" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await authedPage.getByRole("button", { name: "Mark done" }).click();

        await expect(authedPage.getByTestId("completion-note-char-count")).toHaveText("0 / 500");

        const note = "Wrote a page";
        await authedPage.getByPlaceholder("Add a note...").fill(note);
        await expect(authedPage.getByTestId("completion-note-char-count")).toHaveText(`${note.length} / 500`);

        await authedPage.getByRole("button", { name: "Save" }).click();
    });

    test("character counter caps at 500 when marking a habit done from dashboard page", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Write");

        await authedPage.getByRole("button", { name: "Mark done" }).click();

        const textarea = authedPage.getByPlaceholder("Add a note...");
        await textarea.pressSequentially("a".repeat(500));
        await expect(authedPage.getByTestId("completion-note-char-count")).toHaveText("500 / 500");

        await textarea.pressSequentially("a");
        await expect(textarea).toHaveValue("a".repeat(500));
        await expect(authedPage.getByTestId("completion-note-char-count")).toHaveText("500 / 500");
    });

    test("character counter caps at 500 when marking a habit done from the detail page", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Write more");

        await authedPage.getByRole("heading", { name: "Write more" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await authedPage.getByRole("button", { name: "Mark done" }).click();

        const textarea = authedPage.getByPlaceholder("Add a note...");
        await textarea.pressSequentially("a".repeat(500));
        await expect(authedPage.getByTestId("completion-note-char-count")).toHaveText("500 / 500");

        await textarea.pressSequentially("a");
        await expect(textarea).toHaveValue("a".repeat(500));
        await expect(authedPage.getByTestId("completion-note-char-count")).toHaveText("500 / 500");
    });
})

test.describe("Edit note dialog", () => {
    test("saved note persists after reload", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Read");
        await authedPage.getByRole("heading", { name: "Read" }).getByRole("link").click();

        await markHabitDoneViaUI(authedPage, "Finished chapter 5");
        await authedPage.getByTestId("notes-list-edit-today").click();
        await authedPage.getByRole("textbox").fill("Finished chapter 6");
        await authedPage.getByRole("button", { name: "Save" }).click();

        await authedPage.reload();

        await expect(authedPage.getByText("Finished chapter 6")).toBeVisible();
    });

    test("pressing Escape closes edit note dialog without saving changes", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Read");

        await authedPage.getByRole("heading", { name: "Read" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        const note = "Finished chapter 5";
        await markHabitDoneViaUI(authedPage, note);

        await authedPage.getByTestId("notes-list-edit-today").click();
        await expect(authedPage.getByRole("heading", { name: "Edit today's note" })).toBeVisible();

        await authedPage.getByRole("textbox").fill("Something I don't want to save");
        await authedPage.keyboard.press("Escape");

        await expect(authedPage.getByRole("heading", { name: "Edit today's note" })).not.toBeVisible();
        await expect(authedPage.getByText(note)).toBeVisible();
    });

    test("cancel of note update does not modify note", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Read");

        await authedPage.getByRole("heading", { name: "Read" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        const note = "Finished chapter 5";

        await markHabitDoneViaUI(authedPage, note);

        await authedPage.getByTestId("notes-list-edit-today").click();

        await expect(authedPage.getByRole("heading", { name: "Edit today's note" })).toBeVisible();
        await expect(authedPage.getByTestId("edit-note-char-count")).toHaveText(`${note.length} / 500`);

        await authedPage.getByRole("button", { name: "Cancel" }).click();

        await expect(authedPage.getByRole("heading", { name: "Edit today's note" })).not.toBeVisible();
        await expect(authedPage.getByText(note)).toBeVisible();
    });

    test("character counter caps at 500 when editing habit note from the detail page", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Read");

        await authedPage.getByRole("heading", { name: "Read" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await markHabitDoneViaUI(authedPage);
        await authedPage.getByTestId("notes-list-edit-today").click();

        const textbox = authedPage.getByRole("textbox");
        await textbox.pressSequentially("a".repeat(500));
        await expect(authedPage.getByTestId("edit-note-char-count")).toHaveText("500 / 500");

        await textbox.pressSequentially("a");
        await expect(textbox).toHaveValue("a".repeat(500));
        await expect(authedPage.getByTestId("edit-note-char-count")).toHaveText("500 / 500");
    });
})
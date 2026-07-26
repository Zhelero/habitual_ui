import { test, expect } from "./fixtures";
import {createHabitViaUI, markHabitDoneViaUI } from "./helpers.js";

test.describe("Notes list", () => {
    test("new habit shows empty notes state", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Watch a movie");

        await authedPage.getByRole("heading", { name: "Watch a movie" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await expect(authedPage.getByRole("heading", { name: "Notes" })).toBeVisible();
        await expect(authedPage.getByText("No notes yet — add one next time you mark this habit done.")).toBeVisible();

        await expect(authedPage.getByText("No note yet.")).not.toBeVisible();
    });

    test("marking a habit done without a note adds note with placeholder to list", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Jump");

        await authedPage.getByRole("heading", { name: "Jump" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await markHabitDoneViaUI(authedPage);

        const noteItem = authedPage.getByTestId("notes-list-item");

        const expectedDate = new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        await expect(authedPage.getByRole("heading", { name: "Notes" })).toBeVisible();
        await expect(noteItem).toContainText(expectedDate);
        await expect(authedPage.getByText("No note yet.")).toBeVisible();
    });

    test("empty today's note can be opened for editing", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Jump");

        await authedPage.getByRole("heading", { name: "Jump" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        await markHabitDoneViaUI(authedPage);

        await expect(authedPage.getByTestId("notes-list-edit-today")).toBeVisible();
        await authedPage.getByTestId("notes-list-edit-today").click();

        await expect(authedPage.getByRole("heading", { name: "Edit today's note" })).toBeVisible();

        await expect(authedPage.locator("textarea")).toHaveValue("");
        await expect(authedPage.locator("textarea")).toHaveAttribute("placeholder", "Add a note...");
    });

    test("marking a habit done with a note adds note to list", async ({
                                                                          authedPage
                                                                      }) => {
        await createHabitViaUI(authedPage, "Run around");

        await authedPage.getByRole("heading", { name: "Run around" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        const note = "Run 1 km";
        await markHabitDoneViaUI(authedPage, note);

        const noteItem = authedPage.getByTestId("notes-list-item");

        await expect(noteItem).toContainText(note);

        const expectedDate = new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

        await expect(noteItem).toContainText(expectedDate);

        await expect(authedPage.getByRole("heading", { name: "Notes" })).toBeVisible();
        await expect(authedPage.getByText("Run 1 km")).toBeVisible();
    });

    test("editing today's note updates it in the notes list", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Read");

        await authedPage.getByRole("heading", { name: "Read" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        const oldNote = "Finished chapter 3";
        const newNote = "Finished chapter 4";

        await markHabitDoneViaUI(authedPage, oldNote);

        await authedPage.getByTestId("notes-list-edit-today").click();

        await expect(authedPage.getByRole("heading", { name: "Edit today's note" })).toBeVisible();

        const textbox = authedPage.getByRole("textbox");
        await expect(textbox).toHaveValue(oldNote);

        await textbox.fill(newNote);
        await expect(authedPage.getByTestId("edit-note-char-count")).toHaveText(`${newNote.length} / 500`);

        await authedPage.getByRole("button", { name: "Save" }).click();

        await expect(authedPage.getByText(newNote)).toBeVisible();
        await expect(authedPage.getByText(oldNote)).not.toBeVisible();
        await expect(authedPage.getByRole("heading", { name: "Edit today's note" })).not.toBeVisible();
    });

    test("editing today's note updates it from placeholder to new text", async ({ authedPage }) => {
        await createHabitViaUI(authedPage, "Read");

        await authedPage.getByRole("heading", { name: "Read" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        const newNote = "Opened that book";

        await markHabitDoneViaUI(authedPage);

        await authedPage.getByTestId("notes-list-edit-today").click();

        await expect(authedPage.getByRole("heading", { name: "Edit today's note" })).toBeVisible();

        const textbox = authedPage.getByRole("textbox");
        await expect(textbox).toHaveValue("");

        await textbox.fill(newNote);
        await expect(authedPage.getByTestId("edit-note-char-count")).toHaveText(`${newNote.length} / 500`);

        await authedPage.getByRole("button", { name: "Save" }).click();

        await expect(authedPage.getByText(newNote)).toBeVisible();
        await expect(authedPage.getByText("No note yet.")).not.toBeVisible();
        await expect(authedPage.getByRole("heading", { name: "Edit today's note" })).not.toBeVisible();
    });

    test("undo a habit done with a note removes note from list", async ({
                                                                            authedPage
                                                                        }) => {
        await createHabitViaUI(authedPage, "Go away");

        await authedPage.getByRole("heading", { name: "Go away" }).getByRole("link").click();
        await expect(authedPage).toHaveURL(/\/habits\/\d+$/);

        const note = "Went far away";
        await markHabitDoneViaUI(authedPage, note);

        await expect(authedPage.getByText("Went far away")).toBeVisible();

        await authedPage.getByRole("button", { name: "Done ✓"}).click();
        await expect(authedPage.getByText(note)).not.toBeVisible();
        await expect(authedPage.getByText("No notes yet — add one next time you mark this habit done.")).toBeVisible();
    });
});
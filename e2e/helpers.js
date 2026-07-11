import { expect } from "@playwright/test";

export const API_BASE = "http://localhost:8000";
export const TEST_PASSWORD = "playwright-test-password-123";

export function uniqueEmail() {
    const stamp = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    return `e2e-${stamp}-${rand}@example.com`;
}

// Creates a habit through the real UI form. Shared across spec files so
// every test that just needs "some habit to exist" goes through the same
// flow, instead of each file re-implementing it slightly differently.
export async function createHabitViaUI(page, name) {
    await page.getByRole("button", { name: "+ Add habit" }).click();
    await page.getByPlaceholder("Habit name").fill(name);
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByRole("heading", { name })).toBeVisible();
}

// Clicks "Mark done" and completes the note dialog that appears after it.
// Pass a note string to save it, or omit it to click "Skip note".
export async function markHabitDoneViaUI(page, note) {
    await page.getByRole("button", { name: "Mark done" }).click();
    if (note) {
        await page.getByPlaceholder("Add a note...").fill(note);
        await page.getByRole("button", { name: "Save" }).click();
    } else {
        await page.getByRole("button", { name: "Skip note" }).click();
    }
}
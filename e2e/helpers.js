export const API_BASE = "http://localhost:8000";
export const TEST_PASSWORD = "playwright-test-password-123";

export function uniqueEmail() {
    const stamp = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    return `e2e-${stamp}-${rand}@example.com`;
}
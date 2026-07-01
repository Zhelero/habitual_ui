const API_BASE = "http://localhost:8000";

export default async function globalSetup() {
    try {
        const response = await fetch(`${API_BASE}/health`);

        if (!response.ok) {
            throw new Error(`Backend responded with status ${response.status}`);
        }
    } catch (err) {
        throw new Error(
            `\nHabitual API is not reachable at ${API_BASE}.\n` +
            `Start it first from the API repo with:\n\n` +
            `    docker compose --profile app up -d\n\n` +
            `then re-run the tests.\n\n(${err.message})`
        );
    }
}
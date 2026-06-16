export const API_BASE = "http://localhost:8000";

export async function api(path, options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: token
                ? `Bearer ${token}`
                : undefined,
            ...options.headers,
        },
    });

    if (response.status === 401) {
        localStorage.removeItem("token");

        window.location.reload();

        throw new Error("Session expired");
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}
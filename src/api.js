export const API_BASE = "http://localhost:8000";

let isRefreshing = false;

export async function api(path, options = {}) {
    let token = localStorage.getItem("token");

    let response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: token
                ? `Bearer ${token}`
                : undefined,
            ...options.headers,
        },
    });

    if (response.status === 401 && !isRefreshing) {
        isRefreshing = true;

        try {
            const refreshToken =
                localStorage.getItem("refreshToken");

            const refreshResponse = await fetch(
                `${API_BASE}/auth/refresh/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        refresh_token: refreshToken,
                    }),
                }
            );

            if (!refreshResponse.ok) {
                throw new Error("Refresh failed");
            }

            const refreshData =
                await refreshResponse.json();

            localStorage.setItem(
                "token",
                refreshData.access_token
            );

            localStorage.setItem(
                "refreshToken",
                refreshData.refresh_token
            );

            token = refreshData.access_token;

            response = await fetch(
                `${API_BASE}${path}`,
                {
                    ...options,
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                        ...options.headers,
                    },
                }
            );
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");

            window.location.reload();

            throw new Error("Session expired");
        } finally {
            isRefreshing = false;
        }
    }

    if (!response.ok) {
        const error =
            await response.json().catch(() => ({}));

        throw new Error(
            error.detail || `HTTP ${response.status}`
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}
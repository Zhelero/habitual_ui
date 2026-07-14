export function getApiErrorMessage(
    error,
    status
) {
    if (!status) {
        return 'Network error. Please try again.';
    }

    if (!error) {
        return `HTTP ${status}`;
    }

    if (typeof error?.detail === 'string') {
        return error.detail;
    }

    if (Array.isArray(error?.detail)) {
        return error.detail
            .map((e) => (e.loc?.length ? `${e.loc[e.loc.length - 1]}: ${e.msg}` : e.msg))
            .join('\n');
    }

    switch (status) {
        case 400:
            return "Invalid request";

        case 401:
            return "You need to sign in.";

        case 403:
            return "Access denied.";

        case 404:
            return "Resource not found.";

        case 409:
            return "Operation cannot be completed.";

        case 429:
            return "Too many requests. Please wait a moment and try again.";

        case 500:
            return "Internal server error.";

        default:
            return "An unexpected error occurred.";
    }
}
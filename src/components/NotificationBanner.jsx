import { useEffect, useRef } from "react";

export default function NotificationBanner({
                                               type,
                                               message,
                                               onClose,
                                               testId,
                                               duration = 5000,
                                           }) {
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        if (type !== "success") return;
        if (!message) return;

        const timer = setTimeout(onCloseRef.current(), duration);

        return () => clearTimeout(timer);
    }, [type, message, duration]);

    if (!message) return null;

    const styles =
        type === "error"
            ? {
                wrapper:
                    "border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800",
                text: "text-red-600",
                button: "text-red-400 hover:text-red-600",
            }
            : {
                wrapper:
                    "border-emerald-300 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800",
                text: "text-emerald-700",
                button: "text-emerald-500 hover:text-emerald-700",
            };

    return (
        <div
            className={`mb-6 rounded-xl border px-4 py-3 ${styles.wrapper}`}
        >
            <div className="flex items-center justify-between">
                <p
                    data-testid={testId}
                    className={`text-sm ${styles.text}`}
                >
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className={styles.button}
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
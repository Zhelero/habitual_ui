import { useEffect } from "react";

export default function Modal({ onClose, children, className = "max-w-md" }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={handleBackdropClick}
            data-testid="modal-backdrop"
        >
            <div className={`w-full ${className} rounded-3xl bg-white p-6 shadow-2xl shadow-black/30 dark:bg-slate-800 dark:shadow-black/60`}>
                {children}
            </div>
        </div>
    );
}
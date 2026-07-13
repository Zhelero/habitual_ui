import {useEffect, useRef} from "react";

export default function Toast({
                                  type,
                                  message,
                                  onClose,
                                  testId,
                              }) {
    const onCloseRef = useRef(onClose);

    const isSuccess = type === 'success';

    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        if (!isSuccess) return;

        const timer = setTimeout(() => onCloseRef.current(), 3000);
        return () => clearTimeout(timer);
    }, [message, isSuccess]);

    if (!message) return null;

    return (
        <div className={`
                flex
                items-center
                justify-between
                gap-4

                w-80
                rounded-xl
                px-4
                py-3

                shadow-lg

                animate-toast-in
                
                
                ${
                    isSuccess
                        ? "bg-emerald-500 text-white"
                        : "bg-red-500 text-white"
                }
            `}
        >
            <span data-testid={testId}>{message}</span>

            <button
                onClick={onClose}
                className="opacity-70 hover:opacity-100"
            >
                ✕
            </button>
        </div>
    );
}
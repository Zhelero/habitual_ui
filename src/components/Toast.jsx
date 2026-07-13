export default function Toast({
                                  type,
                                  message,
                                  onClose,
                                  testId,
                              }) {
    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <div className={`
                flex
                items-center
                justify-between
                gap-4

                rounded-xl
                px-10
                py-3

                shadow-lg

                transition-all
                
                
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
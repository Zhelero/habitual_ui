export default function ThemeToggle({
    darkMode,
    setDarkMode,
}) {
    return (
        <button
            type="button"
            data-testid="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="
                        rounded-2xl
                        bg-slate-200
                        px-4 py-2
                        text-sm
                        text-slate-700
                        hover:bg-slate-300

                        dark:bg-slate-700
                        dark:text-slate-200
                        dark:hover:bg-slate-600
                    "
        >
            {darkMode ? "☀️" : "🌙"}
        </button>
    );
}
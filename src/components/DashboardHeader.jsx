import ThemeToggle from "./ThemeToggle.jsx";

export default function DashboardHeader({
    user,
    darkMode,
    setDarkMode,
    onAddHabit,
    onLogout,
}) {
    return (
        <header className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-400">
                    Habitual
                </h1>

                <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Track habits. Keep your streak going.
                </p>

                <p className="text-sm text-slate-400 dark:text-slate-500">
                    Signed in as <span className="font-medium">{user?.email}</span>
                </p>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onAddHabit}
                    className="
                                rounded-2xl
                                bg-slate-900
                                px-4
                                py-2
                                text-sm
                                text-white
                                shadow-sm
                                hover:bg-slate-800

                                dark:bg-slate-800
                                dark:text-slate-200"
                >
                    + Add habit
                </button>

                <button
                    onClick={onLogout}
                    className="
                                    rounded-2xl
                                    bg-slate-200
                                    px-4
                                    py-2
                                    text-sm
                                    text-slate-700
                                    hover:bg-slate-300

                                    dark:text-slate-200
                                    dark:bg-slate-600
                                "
                >
                    Logout
                </button>
            </div>

            <ThemeToggle
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />
        </header>
    );
}
export default function DashboardStats({ dashboard }) {
    if (!dashboard) return null;

    return (
        <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total habits
                </p>
                <p
                    data-testid="dashboard-total-habits-amount"
                    className="mt-2 text-2xl font-semibold"
                >
                    {dashboard.total_habits}
                </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Completed today
                </p>
                <p
                    data-testid="dashboard-completed-today-amount"
                    className="mt-2 text-2xl font-semibold"
                >
                    {dashboard.completed_today}
                </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Best streak
                </p>
                <p
                    data-testid="dashboard-best-streak-amount"
                    className="mt-2 text-2xl font-semibold"
                >
                    {dashboard.best_streak}
                    {dashboard.best_streak > 0 && " 🔥"}
                </p>
            </div>
        </div>
    );
}
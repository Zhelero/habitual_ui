import Heatmap from "./Heatmap";

export default function HabitCard({
    habit,
    stats,
    done,
    heatmap,
    isLoading,
    onDone,
    onEdit,
    onArchive,
}) {
    return (
        <div
            key={habit.id}
            className="
                flex items-center justify-between
                rounded-3xl
                bg-white
                p-5
                shadow-sm

                dark:bg-slate-800
            "
        >
            <div>
                <h2 className="text-base font-medium text-slate-900 dark:text-slate-100">{habit.name}</h2>

                {habit.description && (
                    <p className="mt-0.5 text-sm text-slate-400">{habit.description}</p>
                )}

                <div className="mt-1 flex items-center justify-between">
                    {stats &&
                        <span className="text-sm text-slate-500">
                            {stats.current_streak} day streak
                        </span>
                    }

                    {habit.is_archived && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                            Archived
                        </span>
                    )}
                </div>

                <Heatmap data={heatmap} />
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onDone}
                    disabled={isLoading || habit.is_archived}
                    className={`rounded-2xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                        done
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    }`}
                >
                    {isLoading ? "..." : done ? "Done ✓" : "Mark done"}
                </button>

                <button
                    onClick={onEdit}
                    className="rounded-2xl px-3 py-2 text-sm text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition"
                >
                    Edit
                </button>

                <button
                    onClick={onArchive}
                    disabled={isLoading}
                    className="rounded-2xl px-3 py-2 text-sm text-slate-400 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-50"
                >
                    {habit.is_archived ? "Restore" : "Archive"}
                </button>
            </div>
        </div>
    );
}


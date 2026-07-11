import { habitColorClass } from "../utils/habitColors";
import {Link} from "react-router-dom";

function WeekStrip({ days }) {
    const cells = days ?? Array(7).fill(null);

    return (
        <div className="flex w-48 items-center gap-1">
            {cells.map((day, i) => (
                <div key={day?.date ?? i} className="flex w-6 flex-col items-center" title={day?.date}>
                    <span className="text-[10px] text-slate-400">
                        {day
                            ? new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)
                            : ""}
                    </span>
                    <span
                        className={
                            day?.done
                                ? "text-xs text-emerald-500"
                                : "text-xs text-slate-300 dark:text-slate-600"
                        }
                    >
                        {day?.done ? "✓" : day ? "✗" : ""}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default function HabitCard({
                                      habit,
                                      stats,
                                      done,
                                      isLoading,
                                      onDone,
                                      onUndo,
                                      onEdit,
                                      onArchive,
                                  }) {
    return (
        <div
            className="
                flex items-center justify-between
                rounded-3xl
                bg-white
                p-5
                shadow-sm

                dark:bg-slate-800
            "
        >
            <div className="w-[300px] flex-shrink-0">
                <h2 className="flex items-center gap-2 text-base font-medium ">
                    {habitColorClass(habit.color) && (
                        <span
                            data-testid="habit-color-dot"
                            data-color={habit.color}
                            className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${habitColorClass(habit.color)}`}
                        />
                    )}
                    <Link to={`/habits/${habit.id}`} className="min-w-0 flex-1 truncate text-slate-900 hover:underline dark:text-slate-100">
                        {habit.name}
                    </Link>
                </h2>

                {habit.description && (
                    <p className="mt-0.5 text-sm text-slate-400 truncate">{habit.description}</p>
                )}

                <div className="mt-1 flex items-center gap-2">
                    {stats &&
                        <span className="text-sm text-slate-500">
                            {stats.current_streak} day streak
                        </span>
                    }

                    {habit.is_archived && (
                        <span data-testid="habit-badge-archived" className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                            Archived
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <WeekStrip days={stats?.last_7_days} />

                <button
                    onClick={done? onUndo : onDone}
                    data-testid="habit-button-done"
                    disabled={isLoading || habit.is_archived}
                    className={`rounded-2xl w-28 text-center py-2 text-sm font-medium transition disabled:opacity-50 ${
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
                    data-testid="habit-toggle-archive"
                    disabled={isLoading}
                    className="rounded-2xl px-3 py-2 text-sm text-slate-400 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-50"
                >
                    {habit.is_archived ? "Restore" : "Archive"}
                </button>
            </div>
        </div>
    );
}
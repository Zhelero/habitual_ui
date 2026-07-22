function dayState(day) {
    if (!day.done) return "none";
    return day.note ? "done-note" : "done";
}

const STATE_CLASS = {
    none: "bg-slate-200 dark:bg-slate-700",
    done: "bg-emerald-300 dark:bg-emerald-700/70",
    "done-note": "bg-emerald-600 dark:bg-emerald-400",
};

const LEGEND = [
    {state: "none", label: "No activity" },
    {state: "done", label: "Done" },
    {state: "done-note", label: "Done + note" },
]

export default function Heatmap({ data }) {
    if (!data) return null;

    return (
        <div className="mt-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    Last 30 days
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                    {LEGEND.map(({ state, label }) => (
                        <span key={state} className="flex items-center gap-1">
                            <span
                                className={`h-2.5 w-2.5 rounded-sm ${STATE_CLASS[state]}`}
                            />
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-10 gap-1 w-fit">
                {data.map((day) => {
                    const state = dayState(day);
                    return (
                        <div
                            key={day.date}
                            title={day.note ? `${day.date} - ${day.note}` : day.date}
                            data-testid="heatmap-day"
                            data-state={state}
                            className={`rounded-sm ${STATE_CLASS[state]}`}
                            style={{
                                width: 12,
                                height: 12,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
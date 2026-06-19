export default function Heatmap({ data }) {
    if (!data) return null;

    return (
        <div className="mt-3">
            <p className="mb-2 text-xs text-slate-400 dark:text-slate-500">
                Last 30 days
            </p>

            <div className="grid grid-cols-10 gap-1 w-fit">
                {data.map((day) => (
                    <div
                        key={day.date}
                        title={day.date}
                        className={`rounded-sm ${
                            day.done
                                ? "bg-emerald-500"
                                : "bg-slate-200"
                        }`}
                        style={{
                            width: 12,
                            height: 12,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
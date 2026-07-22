function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function NotesList({ data, selectedDate, onSelect }) {
    if (!data) return null;

    // Newest first — that's what you want to scan when you open the page.
    const notes = data.filter((day) => day.note).slice().reverse();

    return (
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <h2 className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                Notes
            </h2>

            {notes.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500">
                    No notes yet — add one next time you mark this habit done.
                </p>
            ) : (
                <ul
                    data-testid="notes-list"
                    className="max-h-64 space-y-2 overflow-y-auto pr-1"
                >
                    {notes.map((day) => (
                        <li
                            key={day.date}
                            data-testid="notes-list-item"
                            data-date={day.date}
                            onClick={() => onSelect?.(day.date)}
                            className={`rounded-xl p-3 text-sm transition ${
                                onSelect ? "cursor-pointer" : ""
                            } ${
                                selectedDate === day.date
                                    ? "bg-emerald-50 dark:bg-emerald-900/30"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-700/40"
                            }`}
                        >
                            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                {formatDate(day.date)}
                            </p>
                            <p className="mt-1 whitespace-pre-wrap break-words text-slate-700 dark:text-slate-200">
                                {day.note}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
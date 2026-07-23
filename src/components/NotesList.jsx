function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function NotesList({ data, onEditToday }) {
    if (!data) return null;

    const todayISO = new Date().toISOString().slice(0, 10);

    // Today's row is shown whenever the habit is done today, note or not —
    // that's the only day the PATCH endpoint on the backend allows editing.
    const todayEntry = data.find((day) => day.date === todayISO && day.done);

    // Past days only show up here once they actually have a note; they're
    // read-only, so an empty row would just be noise.
    const pastNotes = data
        .filter((day) => day.date !== todayISO && day.note)
        .slice()
        .reverse();

    const hasAnything = Boolean(todayEntry) || pastNotes.length > 0;

    return (
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-800">
            <h2 className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                Notes
            </h2>

            {!hasAnything ? (
                <p className="text-sm text-slate-400 dark:text-slate-500">
                    No notes yet — add one next time you mark this habit done.
                </p>
            ) : (
                <ul
                    data-testid="notes-list"
                    className="max-h-64 space-y-2 overflow-y-auto pr-1"
                >
                    {todayEntry && (
                        <li
                            data-testid="notes-list-item"
                            data-today="true"
                            data-date={todayEntry.date}
                            className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-700/40"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                        {formatDate(todayEntry.date)} · Today
                                    </p>
                                    <p
                                        className={`mt-1 whitespace-pre-wrap break-words ${
                                            todayEntry.note
                                                ? "text-slate-700 dark:text-slate-200"
                                                : "italic text-slate-400 dark:text-slate-500"
                                        }`}
                                    >
                                        {todayEntry.note || "No note yet."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={onEditToday}
                                    data-testid="notes-list-edit-today"
                                    className="
                                        shrink-0
                                        rounded-lg
                                        px-2
                                        py-1
                                        text-xs
                                        text-slate-500
                                        hover:bg-slate-200
                                        hover:text-slate-700
                                        dark:text-slate-400
                                        dark:hover:bg-slate-600
                                    "
                                >
                                    Edit
                                </button>
                            </div>
                        </li>
                    )}

                    {pastNotes.map((day) => (
                        <li
                            key={day.date}
                            data-testid="notes-list-item"
                            data-date={day.date}
                            className="rounded-xl p-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/40"
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
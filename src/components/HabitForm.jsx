export default function HabitForm({
    editingHabit,
    newHabitName,
    setNewHabitName,
    newHabitDesc,
    setNewHabitDesc,
    submitting,
    onSubmit,
    onCancel,
}) {
    return (
        <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
            <h2 className="mb-4 text-base font-medium text-slate-900 dark:text-slate-100">
                {editingHabit
                    ? `Editing "${editingHabit.name}"`
                    : "New habit"
                }
            </h2>
            <input
                autoFocus
                type="text"
                placeholder="Habit name"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="
                                        mb-3 w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        px-4
                                        py-2
                                        text-sm
                                        outline-none
                                        focus:border-slate-400

                                        dark:border-slate-700
                                        dark:bg-slate-900
                                        dark:text-slate-100
                                    "
                maxLength={100}
            />
            <input
                type="text"
                placeholder="Description (optional)"
                value={newHabitDesc}
                onChange={(e) => setNewHabitDesc(e.target.value)}
                className="
                                        mb-4 w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        px-4
                                        py-2
                                        text-sm
                                        outline-none
                                        focus:border-slate-400

                                        dark:border-slate-700
                                        dark:bg-slate-900
                                        dark:text-slate-100
                                    "
                maxLength={255}
            />
            <div className="flex gap-3">
                <button
                    onClick={onSubmit}
                    disabled={submitting || !newHabitName.trim()}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50"
                >
                    {submitting
                        ? "Saving..."
                        : editingHabit
                            ? "Update"
                            : "Create"
                    }
                </button>
                <button
                    onClick={onCancel}
                    className="
                                            rounded-xl
                                            bg-slate-100
                                            px-4
                                            py-2
                                            text-sm
                                            text-slate-700
                                            hover:bg-slate-200

                                            dark:bg-slate-700
                                                dark:text-slate-200
                                                dark:hover:bg-slate-600
                                        "
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}
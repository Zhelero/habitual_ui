import { HABIT_COLORS } from "../utils/habitColors";

export default function HabitForm({
    editingHabit,
    newHabitName,
    setNewHabitName,
    newHabitDesc,
    setNewHabitDesc,
    newHabitColor,
    setNewHabitColor,
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
            
            <div className="mb-4 flex items-center gap-2">
                {HABIT_COLORS.map((c) => (
                    <button
                        key={c.value}
                        type="button"
                        onClick={() => setNewHabitColor(c.value)}
                        aria-label={c.value}
                        data-testid={`habit-color-option-${c.value}`}
                        data-selected={newHabitColor === c.value}
                        className={`h-6 w-6 rounded-full flex-shrink-0 ${c.swatch} transition ${
                            newHabitColor === c.value
                                ? "ring-2 ring-offset-2 ring-slate-900 dark:ring-offset-slate-800 dark:ring-slate-100"
                                : ""
                        }`}
                    />
                ))}

                {newHabitColor && (
                    <button
                        type="button"
                        onClick={() => setNewHabitColor(null)}
                        data-testid="habit-color-clear"
                        className="text-xs text-slate-400 hover:text-slate-600"
                    >
                        Clear
                    </button>
                )}
            </div>

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
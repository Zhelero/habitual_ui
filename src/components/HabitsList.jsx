import HabitCard from "./HabitCard.jsx";

export default function HabitsList({
                                      habits,
                                      archiveFilter,
                                      habitStats,
                                      actionLoading,
                                      isDoneToday,
                                      onDone,
                                      onUndo,
                                      onEdit,
                                      onArchive
                                  }) {
    if (habits.length === 0) {
        return (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm dark:bg-slate-800">
                <p className="text-slate-500">
                    {archiveFilter === "archived"
                        ? "No habits here yet."
                        : "No habits yet. Add your first one."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {habits.map((habit) => (
                <HabitCard
                    key={habit.id}
                    habit={habit}
                    stats={habitStats[habit.id]}
                    done={isDoneToday(habit.id)}
                    isLoading={actionLoading[habit.id]}
                    onDone={() => onDone(habit)}
                    onUndo={() => onUndo(habit)}
                    onEdit={() => onEdit(habit)}
                    onArchive={() => onArchive(habit)}
                />
            ))}
        </div>
    );
}
export function sortHabits(habits, habitStats, sortBy, isDoneToday) {
    return [...habits].sort((a, b) => {
        switch (sortBy) {
            case "pending": {
                const aDone = isDoneToday(a.id);
                const bDone = isDoneToday(b.id);

                if (aDone === bDone) return 0;

                return aDone ? 1 : -1;
            }

            case "completed": {
                const aDone = isDoneToday(a.id);
                const bDone = isDoneToday(b.id);

                if (aDone === bDone) return 0;

                return aDone ? -1 : 1;
            }

            case "streak":
                return (
                    (habitStats[b.id]?.current_streak ?? 0) -
                    (habitStats[a.id]?.current_streak ?? 0)
                );

            case "alphabet":
                return a.name.localeCompare(b.name);

            default:
                return 0;
        }
    });
}
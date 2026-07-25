import HabitForm from "./HabitForm";

export default function HabitDialog({
                                        open,
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
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-800">
                <HabitForm
                    editingHabit={editingHabit}
                    newHabitName={newHabitName}
                    setNewHabitName={setNewHabitName}
                    newHabitDesc={newHabitDesc}
                    setNewHabitDesc={setNewHabitDesc}
                    newHabitColor={newHabitColor}
                    setNewHabitColor={setNewHabitColor}
                    submitting={submitting}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    embedded
                />
            </div>
        </div>
    );
}
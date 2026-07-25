import HabitForm from "./HabitForm";
import Modal from "./Modal.jsx";

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
        <Modal onClose={onCancel}>
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
        </Modal>
    );
}
import {api} from "../api.js";
import {useState} from "react";



export function useHabitActions({ fetchAll, setActionLoading, setActionError }) {
    const [noteDialogHabit, setNoteDialogHabit] = useState(null);

    const closeDialog = () => setNoteDialogHabit(null);

    const handleMarkDone = async (habit) => {
        setActionError("");
        setNoteDialogHabit(habit);

    };

    const handleMarkUndo = async (habit) => {
        setActionError("");

        setActionLoading((prev) => ({
            ...prev,
            [habit.id]: true
        }));

        try {
            await api(`/habits/${habit.id}/done/`, {
                method: "DELETE",
            });

            await fetchAll();
        } catch (e) {
            setActionError(e.message);
        } finally {
            setActionLoading((prev) => ({
                ...prev,
                [habit.id]: false,
            }));
        }
    };

    const submitCompletion = async (note) => {
        setActionError("");

        setActionLoading((prev) => ({
            ...prev,
            [noteDialogHabit.id]: true,
        }));

        try {
            await api(`/habits/${noteDialogHabit.id}/done/`, {
                method: "POST",
                body: JSON.stringify({ note }),
            });

            setNoteDialogHabit(null);
            await fetchAll();
        } catch (e) {
            setActionError(e.message);
        } finally {
            setActionLoading((prev) => ({
                ...prev,
                [noteDialogHabit.id]: false,
            }));
        }
    };
    return {
        noteDialogHabit,

        handleMarkDone,
        handleMarkUndo,
        submitCompletion,
        closeDialog,
    }
}

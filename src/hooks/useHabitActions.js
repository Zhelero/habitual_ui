import {api} from "../api.js";
import {useState} from "react";


export function useHabitActions({ fetchAll, setActionError, setSuccessMessage }) {
    const [noteDialogHabit, setNoteDialogHabit] = useState(null);
    const [noteEditHabit, setNoteEditHabit] = useState(null);
    const [actionLoading, setActionLoading] = useState({});

    const closeDialog = () => setNoteDialogHabit(null);

    const openNoteEdit = (habit) => {
        setActionError("");
        setNoteEditHabit(habit);
    };

    const closeNoteEdit = () => setNoteEditHabit(null);

    const submitNoteEdit = async (note) => {
        setActionError("");

        if (!noteEditHabit) return;

        const habitId = noteEditHabit.id;

        setActionLoading((prev) => ({
            ...prev,
            [habitId]: true,
        }));

        try {
            await api(`/habits/${habitId}/done/`, {
                method: "PATCH",
                body: JSON.stringify({ note }),
            });

            setNoteEditHabit(null);
            await fetchAll();
        } catch (e) {
            setActionError(e.message);
        } finally {
            setActionLoading((prev) => ({
                ...prev,
                [habitId]: false,
            }));
        }
    };

    const handleMarkDone = (habit) => {
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

        if (!noteDialogHabit) return;

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

    const archiveHabit = async (habitId) => {
        setActionError("");

        if (!confirm("Archive this habit?")) return;
        setActionLoading((prev) => ({ ...prev, [habitId]: true }));
        try {
            await api(`/habits/${habitId}/archive/`, { method: "PATCH" });
            await fetchAll();
            setSuccessMessage("Habit archived");
        } catch (e) {
            setActionError(e.message);
        } finally {
            setActionLoading((prev) => ({ ...prev, [habitId]: false }));
        }
    };

    const restoreHabit = async (habitId) => {
        setActionError("");

        if (!confirm("Restore this habit?")) return;
        setActionLoading((prev) => ({ ...prev, [habitId]: true }));
        try {
            await api(`/habits/${habitId}/restore/`, { method: "PATCH" });
            await fetchAll();
            setSuccessMessage("Habit restored");
        } catch (e) {
            setActionError(e.message);
        } finally {
            setActionLoading((prev) => ({ ...prev, [habitId]: false }));
        }
    };

    const toggleArchive = async (habit) => {
        if (habit.is_archived) {
            await restoreHabit(habit.id);
        } else {
            await archiveHabit(habit.id);
        }
    };


    return {
        handleMarkDone,
        handleMarkUndo,
        submitCompletion,

        toggleArchive,

        actionLoading,
        noteDialogHabit,
        closeDialog,

        noteEditHabit,
        openNoteEdit,
        closeNoteEdit,
        submitNoteEdit,
    }
}
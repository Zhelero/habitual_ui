import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "./api";

import { useAuth } from "./hooks/useAuth.js";
import { useHabits } from "./hooks/useHabits";
import { useHabitActions } from "./hooks/useHabitActions.js";
import { sortHabits } from "./utils/sortHabits.js";
import HabitForm from "./components/HabitForm.jsx";
import HabitsList from "./components/HabitsList.jsx";
import ErrorScreen from "./components/ErrorScreen.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import DashboardHeader from "./components/DashboardHeader.jsx";
import DashboardStats from "./components/DashboardStats.jsx";
import DashboardToolbar from "./components/DashboardToolbar.jsx";
import NotificationBanner from "./components/NotificationBanner.jsx";
import CompletionNoteDialog from "./components/CompletionNoteDialog.jsx";


export default function HabitualDashboard({ darkMode, setDarkMode }) {
    const { logout } = useAuth();

    const [searchParams, setSearchParams] = useSearchParams();

    const archiveFilter = searchParams.get("filter") || "active";
    const sortBy = searchParams.get("sort") || "pending";

    const setArchiveFilter = (value) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("filter", value);
            return next;
        });
    };

    const setSortBy = (value) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("sort", value);
            return next;
        });
    };

    const [addingHabit, setAddingHabit] = useState(false);
    const [newHabitName, setNewHabitName] = useState("");
    const [newHabitDesc, setNewHabitDesc] = useState("");
    const [newHabitColor, setNewHabitColor] = useState(null);
    const [editingHabit, setEditingHabit] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    const {
        habits,
        dashboard,
        user,

        habitStats,

        loading,
        refreshing,
        error,

        fetchAll,
    } = useHabits(archiveFilter);

    const {
        handleMarkDone,
        handleMarkUndo,
        submitCompletion,

        toggleArchive,

        actionLoading,
        noteDialogHabit,
        closeDialog,

    } = useHabitActions({ fetchAll, setActionError, setSuccessMessage });

    const resetHabitForm = (shouldOpen = false) => {
        setNewHabitName("");
        setNewHabitDesc("");
        setNewHabitColor(null);
        setEditingHabit(null);
        setAddingHabit(shouldOpen);
    }

    const handleAddHabit = async () => {
        setActionError("");

        if (!newHabitName.trim()) return;
        setSubmitting(true);
        try {
            if (editingHabit) {
                await api(`/habits/${editingHabit.id}/`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        name: newHabitName.trim(),
                        description: newHabitDesc.trim() || null,
                        color: newHabitColor,
                    }),
                });
                setSuccessMessage("Habit updated");
            } else {
                await api("/habits/", {
                    method: "POST",
                    body: JSON.stringify({
                        name: newHabitName.trim(),
                        description: newHabitDesc.trim() || null,
                        color: newHabitColor,
                    }),
                });
                setSuccessMessage("Habit created");
            }
            resetHabitForm();
            await fetchAll();
        } catch (e) {
            setActionError(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditHabit = (habit) => {
        setActionError("");
        setEditingHabit(habit);

        setNewHabitName(habit.name);
        setNewHabitDesc(habit.description || "");
        setNewHabitColor(habit.color);

        setAddingHabit(true);
    };

    const openAddHabitForm = () => {
        resetHabitForm(true);
    };

    const isDoneToday = (habitId) => {
        const today = new Date().toISOString().slice(0, 10);
        return habitStats[habitId]?.last_7_days?.some(
            (d) => d.date === today && d.done
        );
    };

    const sortedHabits = sortHabits(
        habits,
        habitStats,
        sortBy,
        isDoneToday
    );

    const handleLogout = async () => {
        setActionError("");
        setSuccessMessage("")

        try {
            await api("/auth/logout/", {
                method: "POST",
            });
        } catch (e) {
            console.error(e);
        } finally {
            setSearchParams({});
            logout();
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <ErrorScreen
                message={`Error: ${error}`}
                hint="Make sure your API is running and TOKEN is set correctly."
                actionLabel="Retry"
                onAction={fetchAll}
            />
        );
    }

    return (
        <div
            className="
                min-h-screen
                bg-slate-50
                p-8
                dark:bg-slate-900
                dark:text-slate-100
            "
        >
            <div className="mx-auto max-w-3xl">
                <DashboardHeader
                    user={user}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    onAddHabit={openAddHabitForm}
                    onLogout={handleLogout}
                />

                {refreshing && (
                    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-700" />
                    </div>
                )}

                <NotificationBanner
                    type="error"
                    message={actionError}
                    testId="action-error-message"
                    onClose={() => setActionError("")}
                />

                <NotificationBanner
                    type="success"
                    message={successMessage}
                    testId="action-success-message"
                    onClose={() => setSuccessMessage("")}
                />

                <DashboardStats dashboard={dashboard} />

                <DashboardToolbar
                    archiveFilter={archiveFilter}
                    setArchiveFilter={setArchiveFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    refreshing={refreshing}
                />

                {/* Add habit form */}
                {addingHabit && (
                    <HabitForm
                        editingHabit={editingHabit}
                        newHabitName={newHabitName}
                        setNewHabitName={setNewHabitName}
                        newHabitDesc={newHabitDesc}
                        setNewHabitDesc={setNewHabitDesc}
                        newHabitColor={newHabitColor}
                        setNewHabitColor={setNewHabitColor}
                        onSubmit={handleAddHabit}
                        onCancel={() => resetHabitForm()}
                        submitting={submitting}
                    />
                )}

                <HabitsList
                    habits={sortedHabits}
                    archiveFilter={archiveFilter}
                    habitStats={habitStats}
                    actionLoading={actionLoading}
                    isDoneToday={isDoneToday}
                    onDone={handleMarkDone}
                    onUndo={handleMarkUndo}
                    onEdit={handleEditHabit}
                    onArchive={toggleArchive}
                />

                <CompletionNoteDialog
                    key={noteDialogHabit?.id ?? "closed"}
                    habit={noteDialogHabit}
                    onCancel={closeDialog}
                    onSubmit={submitCompletion}
                />
            </div>
        </div>
    );
}
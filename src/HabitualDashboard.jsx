import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "./api";

import { useAuth } from "./hooks/useAuth.js";
import { useHabits } from "./hooks/useHabits";
import { useHabitActions } from "./hooks/useHabitActions.js";
import { sortHabits } from "./utils/sortHabits.js";
import HabitCard from "./components/HabitCard.jsx";
import HabitForm from "./components/HabitForm.jsx";
import DashboardHeader from "./components/DashboardHeader.jsx";
import NotificationBanner from "./components/NotificationBanner.jsx";
import CompletionNoteDialog from "./components/CompletionNoteDialog.jsx";
import DashboardStats from "./components/DashboardStats.jsx";


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
            setNewHabitName("");
            setNewHabitDesc("");
            setNewHabitColor(null);
            setAddingHabit(false);
            setEditingHabit(null);
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
        setEditingHabit(null);
        setNewHabitName("");
        setNewHabitDesc("");
        setNewHabitColor(null);
        setAddingHabit(true);
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
        return (
            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50

                    dark:bg-slate-900
                    dark:text-slate-100
                "
            >
                <p className="text-slate-500">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="rounded-2xl bg-white p-8 shadow-sm text-center dark:bg-slate-800">
                    <p className="text-red-500 font-medium">Error: {error}</p>
                    <p className="mt-2 text-sm text-slate-500">
                        Make sure your API is running and TOKEN is set correctly.
                    </p>
                    <button
                        onClick={fetchAll}
                        className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                    >
                        Retry
                    </button>
                </div>
            </div>
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

                {/* Filter + Sorting */}
                <div className="mb-6 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
                        {[
                            { value: "active", label: "Active" },
                            { value: "archived", label: "Archived" },
                            { value: "all", label: "All" },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setArchiveFilter(option.value)}
                                disabled={refreshing}
                                className={`
                                    rounded-lg
                                    px-3
                                    py-1.5
                                    text-sm
                                    font-medium
                                    transition

                                    ${
                                        archiveFilter === option.value
                                            ? "bg-slate-900 text-white dark:bg-slate-600"
                                            : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                                    }
                                `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>


                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="sort"
                            className="text-sm text-slate-500"
                        >
                            Sort:
                        </label>

                        <select
                            id="sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-2
                                text-sm
                                text-slate-700
                                outline-none
                                focus:border-slate-400

                                dark:bg-slate-800
                                dark:text-slate-200
                            "
                        >
                            <option value="pending">
                                Pending first
                            </option>

                            <option value="completed">
                                Completed first
                            </option>

                            <option value="streak">
                                By streak
                            </option>

                            <option value="alphabet">
                                Alphabetical
                            </option>
                        </select>
                    </div>
                </div>

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
                        onCancel={() => {
                            setAddingHabit(false);
                            setNewHabitName("");
                            setNewHabitDesc("");
                            setNewHabitColor(null);
                            setEditingHabit(null);
                        }}
                        submitting={submitting}
                    />
                )}

                {/* Habits list */}
                {habits.length === 0 ? (
                    <div className="rounded-3xl bg-white p-10 text-center shadow-sm dark:bg-slate-800">
                        <p className="text-slate-500">
                            {archiveFilter === "archived"
                                ? "No habits here yet."
                                : "No habits yet. Add your first one."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedHabits.map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                stats={habitStats[habit.id]}
                                done={isDoneToday(habit.id)}
                                isLoading={actionLoading[habit.id]}
                                onDone={() => handleMarkDone(habit)}
                                onUndo={() => handleMarkUndo(habit)}
                                onEdit={() => handleEditHabit(habit)}
                                onArchive={() => toggleArchive(habit)}
                            />
                        ))}
                    </div>
                )}

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
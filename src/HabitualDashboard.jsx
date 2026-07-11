import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "./api";
import { useAuth } from "./hooks/useAuth.js";
import { useHabits } from "./hooks/useHabits";
import { useHabitActions } from "./hooks/useHabitActions.jsx";
import { sortHabits } from "./utils/sortHabits.js";
import HabitCard from "./components/HabitCard.jsx";
import HabitForm from "./components/HabitForm.jsx";
import CompletionNoteDialog from "./components/CompletionNoteDialog.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";


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
    const [actionLoading, setActionLoading] = useState({});
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

    useEffect(() => {
        if (!successMessage) return;

        const timer = setTimeout(() => {
            setSuccessMessage("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [successMessage]);

    const {
        noteDialogHabit,

        handleMarkDone,
        handleMarkUndo,
        submitCompletion,
        closeDialog,
    } = useHabitActions({ fetchAll, setActionLoading, setActionError });

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

    const handleArchiveHabit = async (habitId) => {
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

    const handleRestoreHabit = async (habitId) => {
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

    const handleArchiveToggle = async (habit) => {
        if (habit.is_archived) {
            await handleRestoreHabit(habit.id);
        } else {
            await handleArchiveHabit(habit.id);
        }
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
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-400">
                            Habitual
                        </h1>

                        <p className="mt-1 text-slate-500 dark:text-slate-400">
                            Track habits. Keep your streak going.
                        </p>

                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            Signed in as <span className="font-medium">{user?.email}</span>
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEditingHabit(null);
                                setNewHabitName("");
                                setNewHabitDesc("");
                                setNewHabitColor(null);
                                setAddingHabit(true);
                            }}
                            className="
                            rounded-2xl
                            bg-slate-900
                            px-4
                            py-2
                            text-sm
                            text-white
                            shadow-sm
                            hover:bg-slate-800

                            dark:bg-slate-800
                            dark:text-slate-200"
                        >
                            + Add habit
                        </button>

                        <button
                            onClick={handleLogout}
                            className="
                                rounded-2xl
                                bg-slate-200
                                px-4
                                py-2
                                text-sm
                                text-slate-700
                                hover:bg-slate-300

                                dark:text-slate-200
                                dark:bg-slate-600
                            "
                        >
                            Logout
                        </button>
                    </div>

                    <div className="flex">
                        <ThemeToggle
                            darkMode={darkMode}
                            setDarkMode={setDarkMode}
                        />
                    </div>
                </header>

                {refreshing && (
                    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-700" />
                    </div>
                )}

                {/* Error */}
                {actionError && (
                    <div className="
                        mb-6
                        rounded-xl
                        border
                        border-red-300
                        bg-red-50
                        px-4
                        py-3
                        dark:bg-red-950
                        dark:border-red-800
                    ">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-red-600" data-testid="dashboard-error-message">
                                {actionError}
                            </p>

                            <button
                                onClick={() => setActionError("")}
                                className="text-red-400 hover:text-red-600"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Success message */}
                {successMessage && (
                    <div className="
                        mb-6
                        rounded-xl
                        border
                        border-emerald-300
                        bg-emerald-50
                        px-4
                        py-3
                        dark:bg-emerald-950
                        dark:border-emerald-800
                    ">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-emerald-700" data-testid="dashboard-success-message">
                                {successMessage}
                            </p>

                            <button
                                onClick={() => setSuccessMessage("")}
                                className="text-emerald-500 hover:text-emerald-700"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Dashboard stats */}
                {dashboard && (
                    <div className="mb-6 grid grid-cols-3 gap-4">
                        <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total habits</p>
                            <p data-testid="dashboard-total-habits-amount" className="mt-2 text-2xl font-semibold">{dashboard.total_habits}</p>
                        </div>
                        <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Completed today</p>
                            <p data-testid="dashboard-completed-today-amount" className="mt-2 text-2xl font-semibold">{dashboard.completed_today}</p>
                        </div>
                        <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Best streak</p>
                            <p data-testid="dashboard-best-streak-amount" className="mt-2 text-2xl font-semibold">
                                {dashboard.best_streak}
                                {dashboard.best_streak > 0 && " 🔥"}
                            </p>
                        </div>
                    </div>
                )}

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
                                onArchive={() => handleArchiveToggle(habit)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CompletionNoteDialog
                key={noteDialogHabit?.id ?? "closed"}
                habit={noteDialogHabit}
                onCancel={closeDialog}
                onSubmit={submitCompletion}
            />
        </div>
    );
}
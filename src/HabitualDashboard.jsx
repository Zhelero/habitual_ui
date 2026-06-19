import { useState, useEffect } from "react";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";
import { useHabits } from "./hooks/useHabits";
import { sortHabits } from "./utils/sortHabits.js";
import HabitCard from "./components/HabitCard.jsx";
import HabitForm from "./components/HabitForm.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";

export default function HabitualDashboard() {
    const { logout } = useAuth();

    const [addingHabit, setAddingHabit] = useState(false);
    const [newHabitName, setNewHabitName] = useState("");
    const [newHabitDesc, setNewHabitDesc] = useState("");
    const [editingHabit, setEditingHabit] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState({});
    const [actionError, setActionError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [sortBy, setSortBy] = useState("pending");
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    const {
        habits,
        dashboard,
        user,

        habitStats,
        heatmaps,

        loading,
        error,

        fetchAll,
    } = useHabits();

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem(
            "theme",
            darkMode ? "dark" : "light"
        );
    }, [darkMode]);

    const handleMarkDone = async (habit) => {
        setActionError("");

        const isDone = habitStats[habit.id]?.last_7_days?.find(
            (d) => d.date === new Date().toISOString().slice(0, 10) && d.done
        );

        setActionLoading((prev) => ({ ...prev, [habit.id]: true }));
        try {
            if (isDone) {
                await api(`/habits/${habit.id}/done/`, { method: "DELETE" });
            } else {
                await api(`/habits/${habit.id}/done/`, { method: "POST" });
            }
            await fetchAll();
        } catch (e) {
            setActionError(e.message);
        } finally {
            setActionLoading((prev) => ({ ...prev, [habit.id]: false }));
        }
    };

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
                    }),
                });
                setSuccessMessage("Habit updated");
            } else {
                await api("/habits/", {
                    method: "POST",
                    body: JSON.stringify({
                        name: newHabitName.trim(),
                        description: newHabitDesc.trim() || null,
                    }),
                });
                setSuccessMessage("Habit created");
            }
            setNewHabitName("");
            setNewHabitDesc("");
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

        setAddingHabit(true);
    };

    const handleDeleteHabit = async (habitId) => {
        setActionError("");

        if (!confirm("Delete this habit?")) return;
        setActionLoading((prev) => ({ ...prev, [habitId]: true }));
        try {
            await api(`/habits/${habitId}/`, { method: "DELETE" });
            await fetchAll();
            setSuccessMessage("Habit deleted");
        } catch (e) {
            setActionError(e.message);
        } finally {
            setActionLoading((prev) => ({ ...prev, [habitId]: false }));
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

        try {
            await api("/auth/logout/", {
                method: "POST",
            });
        } catch (e) {
            console.error(e);
        } finally {
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
                            <p className="text-sm text-red-600">{actionError}</p>

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
                            <p className="text-sm text-emerald-700">
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
                            <p className="mt-2 text-2xl font-semibold">{dashboard.total_habits}</p>
                        </div>
                        <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Completed today</p>
                            <p className="mt-2 text-2xl font-semibold">{dashboard.completed_today}</p>
                        </div>
                        <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Best streak</p>
                            <p className="mt-2 text-2xl font-semibold">{dashboard.best_streak} 🔥</p>
                        </div>
                    </div>
                )}

                {/* Sorting */}
                <div className="mb-6 flex items-center justify-end gap-2">
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

                {/* Add habit form */}
                {addingHabit && (
                    <HabitForm
                        editingHabit={editingHabit}
                        name={newHabitName}
                        description={newHabitDesc}
                        onNameChange={setNewHabitName}
                        onDescriptionChange={setNewHabitDesc}
                        onSubmit={handleAddHabit}
                        onCancel={() => {
                            setAddingHabit(false);
                            setNewHabitName("");
                            setNewHabitDesc("");
                            setEditingHabit(null);
                        }}
                        submitting={submitting}
                    />
                )}

                {/* Habits list */}
                {habits.length === 0 ? (
                    <div className="rounded-3xl bg-white p-10 text-center shadow-sm dark:bg-slate-800">
                        <p className="text-slate-500">No habits yet. Add your first one.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedHabits.map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                stats={habitStats[habit.id]}
                                heatmap={heatmaps[habit.id]}
                                done={isDoneToday(habit.id)}
                                isLoading={actionLoading[habit.id]}
                                onDone={() => handleMarkDone(habit)}
                                onEdit={() => handleEditHabit(habit)}
                                onDelete={() => handleDeleteHabit(habit.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
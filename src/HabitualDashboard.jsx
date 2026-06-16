import { useState, useEffect } from "react";
import { api } from "./api";
import { useAuth } from "./context/AuthContext";
import { useHabits } from "./hooks/useHabits";

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

    const renderHeatmap = (habitId) => {
        const data = heatmaps[habitId];

        if (!data) return null;

        return (
            <div className="mt-3">
                <p className="mb-2 text-xs text-slate-400">
                    Last 30 days
                 </p>

                <div className="grid grid-cols-10 gap-1 w-fit">
                    {data.map((day) => (
                        <div
                            key={day.date}
                            title={day.date}
                            className={`rounded-sm ${
                            day.done
                                ? "bg-emerald-500"
                                : "bg-slate-200"
                            }`}
                            style={{
                                width: 12,
                                height: 12,
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    };

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
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-slate-500">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
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
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900">
                            Habitual
                        </h1>

                        <p className="mt-1 text-slate-500">
                            Track habits. Keep your streak going.
                        </p>

                        <p className="text-sm text-slate-400">
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
                            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white shadow-sm hover:bg-slate-800"
                        >
                            + Add habit
                        </button>

                        <button
                            onClick={handleLogout}
                            className="rounded-2xl bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Error */}
                {actionError && (
                    <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3">
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
                    <div className="mb-6 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3">
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
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Total habits</p>
                            <p className="mt-2 text-2xl font-semibold">{dashboard.total_habits}</p>
                        </div>
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Completed today</p>
                            <p className="mt-2 text-2xl font-semibold">{dashboard.completed_today}</p>
                        </div>
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Best streak</p>
                            <p className="mt-2 text-2xl font-semibold">{dashboard.best_streak} 🔥</p>
                        </div>
                    </div>
                )}

                {/* Add habit form */}
                {addingHabit && (
                    <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-base font-medium text-slate-900">
                            {editingHabit
                                ? `Editing "${editingHabit.name}"`
                                : "New habit"
                            }
                        </h2>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Habit name"
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            className="
                                mb-3 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400
                            "
                            maxLength={100}
                        />
                        <input
                            type="text"
                            placeholder="Description (optional)"
                            value={newHabitDesc}
                            onChange={(e) => setNewHabitDesc(e.target.value)}
                            className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                            maxLength={255}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddHabit}
                                disabled={submitting || !newHabitName.trim()}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                                {submitting
                                    ? "Saving..."
                                    : editingHabit
                                    ? "Update"
                                    : "Create"
                                }
                            </button>
                            <button
                                onClick={() => {
                                    setAddingHabit(false);
                                    setNewHabitName("");
                                    setNewHabitDesc("");
                                    setEditingHabit(null)
                                }}
                                className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Habits list */}
                {habits.length === 0 ? (
                    <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                        <p className="text-slate-500">No habits yet. Add your first one.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {habits.map((habit) => {
                            const stats = habitStats[habit.id];
                            const done = isDoneToday(habit.id);
                            const isLoading = actionLoading[habit.id];

                            return (
                                <div
                                    key={habit.id}
                                        className="flex items-center justify-between rounded-3xl bg-white p-5 shadow-sm"
                                >
                                    <div>
                                        <h2 className="text-base font-medium text-slate-900">{habit.name}</h2>
                                        {habit.description && (
                                            <p className="mt-0.5 text-sm text-slate-400">{habit.description}</p>
                                        )}
                                        {stats && (
                                            <p className="mt-1 text-sm text-slate-500">
                                                {stats.current_streak} day streak
                                            </p>

                                        )}

                                        {renderHeatmap(habit.id)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleMarkDone(habit)}
                                            className={`rounded-2xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                                                done
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                            }`}
                                        >
                                            {isLoading ? "..." : done ? "Done ✓" : "Mark done"}
                                        </button>

                                        <button
                                            onClick={() => handleEditHabit(habit)}
                                            className="rounded-2xl px-3 py-2 text-sm text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDeleteHabit(habit.id)}
                                            disabled={isLoading}
                                            className="rounded-2xl px-3 py-2 text-sm text-slate-400 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "./api";
import { useHabit } from "./hooks/useHabit";
import { habitColorClass } from "./utils/habitColors";
import Heatmap from "./components/Heatmap";
import HabitForm from "./components/HabitForm";

function StatCard({ label, value }) {
    return (
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-xl font-semibold">{value}</p>
        </div>
    );
}

export default function HabitDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { habit, stats, heatmap, loading, refreshing, error, refetch } = useHabit(id);

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState("");

    const startEdit = () => {
        setActionError("");
        setName(habit.name);
        setDescription(habit.description || "");
        setColor(habit.color);
        setEditing(true);
    };

    const handleSave = async () => {
        if (!name.trim()) return;

        setSubmitting(true);
        setActionError("");
        try {
            await api(`/habits/${id}/`, {
                method: "PATCH",
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim() || null,
                    color: color,
                }),
            });
            setEditing(false);
            await refetch();
        } catch (e) {
            setActionError(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleArchiveToggle = async () => {
        const isArchived = habit.is_archived;

        if (!confirm(isArchived ? "Restore this habit?" : "Archive this habit?")) {
            return;
        }

        setActionLoading(true);
        setActionError("");
        try {
            await api(`/habits/${id}/${isArchived ? "restore" : "archive"}/`, {
                method: "PATCH",
            });
            await refetch();
        } catch (e) {
            setActionError(e.message);
        } finally {
            setActionLoading(false);
        }
    };

    const today = new Date().toISOString().slice(0, 10);
    const isDoneToday = stats?.last_7_days?.some(
        (d) => d.date === today && d.done
    );

    const handleMarkDone = async () => {
        setActionLoading(true);
        setActionError("");
        try {
            if (isDoneToday) {
                await api(`/habits/${id}/done/`, { method: "DELETE" });
            } else {
                await api(`/habits/${id}/done/`, { method: "POST" });
            }
            await refetch();
        } catch (e) {
            setActionError(e.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <p className="text-slate-500">Loading...</p>
            </div>
        );
    }

    if (error || !habit) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="rounded-2xl bg-white p-8 shadow-sm text-center dark:bg-slate-800">
                    <p className="text-red-500 font-medium">{error || "Habit not found"}</p>
                    <Link
                        to="/"
                        className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
                    >
                        Back to dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8 dark:bg-slate-900 dark:text-slate-100">
            <div className="mx-auto max-w-2xl">
                <button
                    onClick={() => navigate("/")}
                    className="mb-6 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                    ← Back to dashboard
                </button>

                {refreshing && (
                    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-700" />
                    </div>
                )}

                {actionError && (
                    <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 dark:bg-red-950 dark:border-red-800">
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

                <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-800">
                    {editing ? (
                        <HabitForm
                            editingHabit={habit}
                            newHabitName={name}
                            setNewHabitName={setName}
                            newHabitDesc={description}
                            setNewHabitDesc={setDescription}
                            newHabitColor={color}
                            setNewHabitColor={setColor}
                            onSubmit={handleSave}
                            onCancel={() => setEditing(false)}
                            submitting={submitting}
                        />
                    ) : (
                        <>
                            <div className="flex items-center justify-between gap-2">
                                <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                    {habitColorClass(habit.color) && (
                                        <span className={`h-3 w-3 rounded-full shrink-0 gap-2 ${habitColorClass(habit.color)}`} />
                                    )}
                                    {habit.name}
                                </h1>

                                {habit.is_archived && (
                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-700">
                                        Archived
                                    </span>
                                )}
                            </div>

                            {habit.description && (
                                <p className="mt-2 text-slate-500 dark:text-slate-400">
                                    {habit.description}
                                </p>
                            )}

                            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                                Tracking since{" "}
                                {new Date(habit.created_at).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <button
                                    onClick={handleMarkDone}
                                    disabled={actionLoading || habit.is_archived}
                                    className={`rounded-2xl w-28 text-center py-2 text-sm font-medium transition disabled:opacity-50 ${
                                        isDoneToday
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                    }`}
                                >
                                    {actionLoading ? "..." : isDoneToday ? "Done ✓" : "Mark done"}
                                </button>

                                <button
                                    onClick={startEdit}
                                    className="rounded-2xl px-4 py-2 text-sm text-slate-500 hover:bg-blue-50 hover:text-blue-500 transition"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={handleArchiveToggle}
                                    data-testid="habit-detail-toggle-archive"
                                    disabled={actionLoading}
                                    className="rounded-2xl px-4 py-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-50"
                                >
                                    {habit.is_archived ? "Restore" : "Archive"}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {stats && (
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <StatCard label="Current streak" value={`${stats.current_streak} 🔥`} />
                        <StatCard label="Best streak" value={`${stats.best_streak} 🔥`} />
                        <StatCard label="Last 7 days" value={`${(stats.completion_last_7_days ?? 0).toFixed(1)}%`} />
                        <StatCard label="Last 30 days" value={`${(stats.completion_last_30_days ?? 0).toFixed(1)}%`} />
                    </div>
                )}

                <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-800">
                    <h2 className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                        Activity
                    </h2>
                    <Heatmap data={heatmap} />
                </div>
            </div>
        </div>
    );
}
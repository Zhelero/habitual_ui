import { useState, useCallback, useEffect } from "react";
import { api } from "../api";

export function useHabits() {
    const [habits, setHabits] = useState([]);
    const [dashboard, setDashboard] = useState(null);
    const [user, setUser] = useState(null);

    const [habitStats, setHabitStats] = useState({});
    const [heatmaps, setHeatmaps] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchStats = async (habitsList) => {
        const results = await Promise.allSettled(
            habitsList.map((h) =>
                api(`/habits/${h.id}/stats/`).then((stats) => ({
                    id: h.id,
                    stats,
                }))
            )
        );

        const map = {};

        results.forEach((r) => {
            if (r.status === "fulfilled") {
                map[r.value.id] = r.value.stats;
            }
        });

        setHabitStats(map);
    };

    const fetchHeatmaps = async (habitsList) => {
        const results = await Promise.allSettled(
            habitsList.map((h) =>
                api(`/habits/${h.id}/heatmap/`).then((heatmap) => ({
                    id: h.id,
                    heatmap,
                }))
            )
        );

        const map = {};

        results.forEach((r) => {
            if (r.status === "fulfilled") {
                map[r.value.id] = r.value.heatmap;
            }
        });

        setHeatmaps(map);
    };

    const fetchAll = useCallback(async () => {
        try {
            setError(null);

            const [habitsData, dashboardData, userData] = await Promise.all([
                api("/habits/?limit=100"),
                api("/dashboard/"),
                api("/auth/me"),
            ]);

            setHabits(habitsData.items);
            setDashboard(dashboardData);
            setUser(userData);

            await Promise.all([
                fetchStats(habitsData.items),
                fetchHeatmaps(habitsData.items),
            ]);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);



    return {
        habits,
        dashboard,
        user,

        habitStats,
        heatmaps,

        loading,
        error,

        fetchAll,
    };
}
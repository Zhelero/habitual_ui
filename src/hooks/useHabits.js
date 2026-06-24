import { useState, useCallback, useEffect } from "react";
import { api } from "../api";

export function useHabits(archiveFilter = "active") {
    const [habits, setHabits] = useState([]);
    const [dashboard, setDashboard] = useState(null);
    const [user, setUser] = useState(null);

    const [habitStats, setHabitStats] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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

    const fetchAll = useCallback(async () => {
        if (!initialized) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }

        try {

            setError(null);

            const [habitsData, dashboardData, userData] = await Promise.all([
                api(`/habits/?limit=100&filter=${archiveFilter}`),
                api("/dashboard/"),
                api("/auth/me"),
            ]);

            setHabits(habitsData.items);
            setDashboard(dashboardData);
            setUser(userData);

            await fetchStats(habitsData.items);

        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setInitialized(true);

        }
    }, [archiveFilter, initialized]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);



    return {
        habits,
        dashboard,
        user,

        habitStats,

        loading,
        refreshing,
        error,

        fetchAll,
    };
}
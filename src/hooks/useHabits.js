import { useState, useCallback, useEffect, useRef } from "react";
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

    // Guards against a stale response overwriting newer state — e.g. if
    // archiveFilter changes again (or the component unmounts) before a
    // previous fetch resolves.
    const requestIdRef = useRef(0);

    const fetchStats = async (habitsList, requestId) => {
        const results = await Promise.allSettled(
            habitsList.map((h) =>
                api(`/habits/${h.id}/stats/`).then((stats) => ({
                    id: h.id,
                    stats,
                }))
            )
        );

        if (requestId !== requestIdRef.current) return;

        const map = {};

        results.forEach((r) => {
            if (r.status === "fulfilled") {
                map[r.value.id] = r.value.stats;
            }
        });

        setHabitStats(map);
    };

    const fetchAll = useCallback(async () => {
        const requestId = ++requestIdRef.current;

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

            if (requestId !== requestIdRef.current) return;

            setHabits(habitsData.items);
            setDashboard(dashboardData);
            setUser(userData);

            await fetchStats(habitsData.items, requestId);

        } catch (e) {
            if (requestId !== requestIdRef.current) return;
            setError(e.message);
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
                setRefreshing(false);
                setInitialized(true);
            }
        }
    }, [archiveFilter, initialized]);

    useEffect(() => {
        // Fetching on mount/filter change is an intentional, guarded exception:
        // requestIdRef above discards stale responses, so this is safe despite
        // the lint rule's generic caution about setState-in-effect.
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
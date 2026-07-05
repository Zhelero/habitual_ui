import { useState, useCallback, useEffect, useRef } from "react";
import { api } from "../api";

export function useHabit(habitId) {
    const [habit, setHabit] = useState(null);
    const [stats, setStats] = useState(null);
    const [heatmap, setHeatmap] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Guards against a stale response overwriting newer state — e.g. if
    // habitId changes again (or the component unmounts) before a previous
    // fetch resolves.
    const requestIdRef = useRef(0);

    const fetchHabit = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        if (!initialized) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }
        setError(null);

        try {
            const [habitData, statsData, heatmapData] = await Promise.all([
                api(`/habits/${habitId}/`),
                api(`/habits/${habitId}/stats/`),
                api(`/habits/${habitId}/heatmap/`),
            ]);

            if (requestId !== requestIdRef.current) return;

            setHabit(habitData);
            setStats(statsData);
            setHeatmap(heatmapData);
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
    }, [habitId, initialized]);

    useEffect(() => {
        // Fetching on mount/param change is an intentional, guarded exception:
        // requestIdRef above discards stale responses, so this is safe despite
        // the lint rule's generic caution about setState-in-effect.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchHabit();
    }, [fetchHabit]);

    return {
        habit,
        stats,
        heatmap,

        loading,
        refreshing,
        error,

        refetch: fetchHabit,
    };
}
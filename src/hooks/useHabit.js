import { useState, useCallback, useEffect } from "react";
import { api } from "../api";

export function useHabit(habitId) {
    const [habit, setHabit] = useState(null);
    const [stats, setStats] = useState(null);
    const [heatmap, setHeatmap] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHabit = useCallback(async () => {
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

            setHabit(habitData);
            setStats(statsData);
            setHeatmap(heatmapData);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setInitialized(true);
        }
    }, [habitId, initialized]);

    useEffect(() => {
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
import { useState, useCallback, useEffect } from "react";
import { api } from "../api";

export function useHabit(habitId) {
    const [habit, setHabit] = useState(null);
    const [stats, setStats] = useState(null);
    const [heatmap, setHeatmap] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHabit = useCallback(async () => {
        setLoading(true);
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
        }
    }, [habitId]);

    useEffect(() => {
        fetchHabit();
    }, [fetchHabit]);

    return {
        habit,
        stats,
        heatmap,

        loading,
        error,

        refetch: fetchHabit,
    };
}
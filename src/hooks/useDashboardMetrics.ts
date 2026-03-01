import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getDashboardMetrics, type DashboardMetrics } from "../api/admin.dashboard.api";

// ─── useDashboardMetrics ─────────────────────────────────────────────────────

/**
 * Custom hook to fetch and manage admin dashboard metrics.
 * Provides auto-refresh and stale-time optimization.
 */
export const useDashboardMetrics = () => {
    const { data, isLoading, isError, refetch } = useQuery<
        DashboardMetrics,
        AxiosError
    >({
        queryKey: ["dashboard-metrics"],
        queryFn: getDashboardMetrics,
        staleTime: 30000, // 30 seconds
        refetchInterval: 60000, // 1 minute
    });

    return { data, isLoading, isError, refetch };
};

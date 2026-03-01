import { useQuery } from "@tanstack/react-query";
import { getSeatAvailability } from "../api/employee.api";

/**
 * Hook to fetch seat availability for a given date.
 * - Enabled only when a date string is provided.
 * - keepPreviousData: true → no flash between date changes.
 * - staleTime: 0             → always re-fetch on mount / focus.
 * - refetchOnWindowFocus: true
 * - refetchInterval: 30000   → auto-refresh every 30 seconds.
 */
export const useSeatAvailability = (date: string) => {
    return useQuery({
        queryKey: ["seat-availability", date],
        queryFn: () => getSeatAvailability(date),
        enabled: !!date,
        placeholderData: (prev) => prev,
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 30_000,
    });
};

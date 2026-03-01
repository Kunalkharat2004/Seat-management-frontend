import { useQuery } from "@tanstack/react-query";
import { getSeatAvailability } from "../api/employee.api";

/**
 * Hook to fetch seat availability for a given date.
 * Enabled only when a date is provided.
 */
export const useSeatAvailability = (date: string) => {
    return useQuery({
        queryKey: ["seat-availability", date],
        queryFn: () => getSeatAvailability(date),
        enabled: !!date,
    });
};

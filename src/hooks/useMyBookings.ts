import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMyBookings, type PaginatedMyBookings } from "../api/employee.api";

interface UseMyBookingsParams {
    page: number;
    page_size: number;
    status?: string;
    date?: string;
}

/**
 * Hook for fetching current user's bookings with server-side pagination and filters.
 */
export const useMyBookings = ({ page, page_size, status, date }: UseMyBookingsParams) => {
    return useQuery<PaginatedMyBookings>({
        queryKey: ["my-bookings", page, page_size, status, date],
        queryFn: () => getMyBookings({ page, page_size, status, date }),
        placeholderData: keepPreviousData,
    });
};

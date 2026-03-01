import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getSeats, type PaginatedSeatResponse } from "../api/admin.seat.api";

interface UseSeatsParams {
    page: number;
    page_size: number;
    search?: string;
}

/**
 * Hook for fetching paginated seats with server-side filtering.
 * Uses TanStack Query for caching and state management.
 */
export const useSeats = ({ page, page_size, search }: UseSeatsParams) => {
    const { data, isLoading, isFetching, isError, refetch } = useQuery<
        PaginatedSeatResponse,
        AxiosError
    >({
        queryKey: ["seats", page, page_size, search],
        queryFn: () => getSeats({ page, page_size, search }),
        // In TanStack Query v5, keepPreviousData: true is achieved via placeholderData
        placeholderData: (previousData) => previousData,
    });

    return {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    };
};

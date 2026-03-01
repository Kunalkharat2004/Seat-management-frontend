import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "../api/employee.api";

/**
 * Hook to create a new seat booking.
 * Invalidates seat availability and booking-related queries on success.
 */
export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["seat-availability"] });
            queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
            queryClient.invalidateQueries({ queryKey: ["today-booking"] });
        },
    });
};

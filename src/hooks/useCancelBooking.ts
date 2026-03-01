import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBooking } from "../api/employee.api";

/**
 * Hook to cancel an existing booking.
 * Invalidates seat availability and booking-related queries on success.
 */
export const useCancelBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["seat-availability"] });
            queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
            queryClient.invalidateQueries({ queryKey: ["today-booking"] });
        },
    });
};

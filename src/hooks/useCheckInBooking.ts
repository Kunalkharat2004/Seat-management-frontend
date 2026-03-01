import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkInBooking } from "../api/employee.api";

/**
 * Hook to check in to an existing booking.
 * Invalidates seat availability and booking-related queries on success.
 */
export const useCheckInBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: checkInBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["seat-availability"] });
            queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
            queryClient.invalidateQueries({ queryKey: ["today-booking"] });
        },
    });
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    Skeleton,
    Snackbar,
    Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useSeatAvailability } from "../../hooks/useSeatAvailability";
import { useCreateBooking } from "../../hooks/useCreateBooking";
import { useMyBookings } from "../../hooks/useMyBookings";
import { useCancelBooking } from "../../hooks/useCancelBooking";
import { useCheckInBooking } from "../../hooks/useCheckInBooking";
import SeatGrid from "../../components/employee/SeatGrid";

// ─── Seat Skeleton ────────────────────────────────────────────────────────────

const SeatSkeleton = () => (
    <Grid size={{ xs: 6, sm: 4, md: 3 }}>
        <Skeleton variant="rounded" height={120} />
    </Grid>
);


// ─── BookSeatPage ─────────────────────────────────────────────────────────────

const BookSeatPage = () => {
    const navigate = useNavigate();
    const today = dayjs();

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(today);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

    const [snackbar, setSnackbar]         = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    // Format date for API
    const dateQueryStr = selectedDate ? selectedDate.format("YYYY-MM-DD") : "";

    // ── Queries ─────────────────────────────────────────────────────────────
    const {
        data: seats,
        isLoading,
        isFetching,
        isError,
    } = useSeatAvailability(dateQueryStr);

    const { data: myBookingsData } = useMyBookings({
        page: 1,
        page_size: 100,
        date: dateQueryStr,
    });

    // ── Mutations ───────────────────────────────────────────────────────────
    const bookMutation = useCreateBooking();
    const cancelMutation = useCancelBooking();
    const checkInMutation = useCheckInBooking();

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleBook = (seatId: string) => {
        if (!dateQueryStr) return;
        bookMutation.mutate(
            { seat_id: seatId, booking_date: dateQueryStr },
            {
                onSuccess: () => {
                    setSnackbar({ open: true, message: "Seat booked successfully! 🎉", severity: "success" });
                },
                onError: (err: unknown) => {
                    const typedErr = err as { response?: { status?: number; data?: { detail?: string } } };
                    const status = typedErr.response?.status;
                    let msg = typedErr.response?.data?.detail ?? "Failed to book seat. Please try again.";
                    
                    if (status === 409) {
                        msg = "Seat already booked by another user.";
                    }
                    
                    setSnackbar({ open: true, message: msg, severity: "error" });
                },
            },
        );
    };

    const handleCancelClick = (bookingId: string) => {
        setBookingToCancel(bookingId);
        setCancelDialogOpen(true);
    };

    const confirmCancel = () => {
        if (!bookingToCancel) return;
        cancelMutation.mutate(bookingToCancel, {
            onSuccess: () => {
                setSnackbar({ open: true, message: "Booking cancelled successfully", severity: "success" });
                setCancelDialogOpen(false);
                setBookingToCancel(null);
            },
            onError: (err: unknown) => {
                const typedErr = err as { response?: { data?: { detail?: string } } };
                const msg = typedErr.response?.data?.detail || "Failed to cancel booking";
                setSnackbar({ open: true, message: msg, severity: "error" });
                setCancelDialogOpen(false);
                setBookingToCancel(null);
            }
        });
    };

    const handleCheckInClick = (bookingId: string) => {
        checkInMutation.mutate(bookingId, {
            onSuccess: () => {
                setSnackbar({ open: true, message: "Checked in successfully", severity: "success" });
            },
            onError: (err: unknown) => {
                const typedErr = err as { response?: { data?: { detail?: string } } };
                const msg = typedErr.response?.data?.detail || "Failed to check-in";
                setSnackbar({ open: true, message: msg, severity: "error" });
            }
        });
    };

    const closeSnackbar = () => setSnackbar((p) => ({ ...p, open: false }));

    // Derive mapped mappedSeats with generic "mine" identification
    const mappedSeats = (seats || []).map((seat) => {
        const myBooking = myBookingsData?.items?.find((b) => b.seat_id === seat.seat_id);

        let finalStatus = seat.status === "confirmed" ? "booked" : seat.status;
        let finalBookingId = undefined;

        if (myBooking) {
            if (myBooking.status === "confirmed") finalStatus = "mine";
            else if (myBooking.status === "checked_in") finalStatus = "checked_in";
            // expired logic usually handled server-side, mapped to original status
            finalBookingId = myBooking.id;
        }

        const seatIsPendingAction = 
            bookMutation.isPending || 
            (cancelMutation.isPending && bookingToCancel === finalBookingId) || 
            checkInMutation.isPending;

        return {
            seatId: seat.seat_id,
            seatNumber: seat.seat_number,
            status: finalStatus as "available" | "booked" | "mine" | "checked_in" | "expired",
            bookingId: finalBookingId,
            isPendingAction: seatIsPendingAction,
        };
    });

    const isToday = dateQueryStr === today.format("YYYY-MM-DD");
    const anyMutationPending = bookMutation.isPending || cancelMutation.isPending || checkInMutation.isPending;

    const availableCount = seats?.filter((s) => s.status === "available").length || 0;
    const bookedCount = (seats?.length || 0) - availableCount;

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <Box>
            {/* ── Header ────────────────────────────────────────────────── */}
            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                <Button
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/employee/dashboard")}
                    sx={{ textTransform: "none", color: "text.secondary", pl: 0 }}
                >
                    Dashboard
                </Button>
            </Box>

            <Box mb={4}>
                <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
                    Book a Seat
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Select a date and choose an available seat to reserve.
                </Typography>
            </Box>

            {/* ── Date Picker ───────────────────────────────────────────── */}
            <Card
                elevation={0}
                sx={{ mb: 4, borderRadius: 3, border: "1px solid", borderColor: "divider", maxWidth: 420 }}
            >
                <CardContent>
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
                        SELECT DATE
                    </Typography>
                    <DatePicker
                        label="Booking Date"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        minDate={today}
                        maxDate={today.endOf("month")}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                variant: "outlined",
                                size: "medium",
                                sx: {
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    },
                                },
                            },
                        }}
                    />
                    <Typography variant="caption" color="text.disabled" mt={1} display="block">
                        Only dates within the current month can be booked.
                    </Typography>
                </CardContent>
            </Card>

            {/* ── Seat Grid ─────────────────────────────────────────────── */}
            <Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box>
                        <Typography variant="h6" fontWeight={700} display="flex" alignItems="center">
                            Seat Map
                            {isFetching && !isLoading && (
                                <CircularProgress size={14} sx={{ ml: 1.5 }} />
                            )}
                        </Typography>
                        {!isLoading && !isError && seats && (
                            <Typography variant="body2" color="text.secondary" fontWeight={500} mt={0.5}>
                                {availableCount} Available • {bookedCount} Booked
                            </Typography>
                        )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" textAlign="right">
                        Auto-refreshes every 30 seconds
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Loading skeleton */}
                {isLoading && (
                    <Grid container spacing={2}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SeatSkeleton key={i} />
                        ))}
                    </Grid>
                )}

                {/* Error state */}
                {isError && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                        Failed to load seat availability. Please try refreshing the page.
                    </Alert>
                )}

                {/* Empty state */}
                {!isLoading && !isError && seats?.length === 0 && (
                    <Box className="flex flex-col items-center py-12 gap-2">
                        <EventSeatIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                            No seats configured
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                            Please contact an administrator to add seats to the system.
                        </Typography>
                    </Box>
                )}

                {/* Seat cards */}
                {!isLoading && !isError && seats && seats.length > 0 && (
                    <>
                        {/* Seat Grid */}
                        <SeatGrid
                            seats={mappedSeats}
                            onSeatClick={handleBook}
                            onCancel={handleCancelClick}
                            onCheckIn={isToday ? handleCheckInClick : undefined}
                            isPendingAction={anyMutationPending}
                        />

                        {/* Legend */}
                        <Box display="flex" gap={2} mt={4} flexWrap="wrap" justifyContent="center">
                            <Box display="flex" alignItems="center" gap={0.75}>
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <Typography variant="caption" color="text.secondary">Available</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.75}>
                                <div className="w-3 h-3 rounded-full bg-gray-200" />
                                <Typography variant="caption" color="text.secondary">Booked</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.75}>
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <Typography variant="caption" color="text.secondary">Your Booking</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.75}>
                                <div className="w-3 h-3 rounded-full bg-blue-800" />
                                <Typography variant="caption" color="text.secondary">Checked-in</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.75}>
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <Typography variant="caption" color="text.secondary">Expired</Typography>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>

            {/* ── Snackbar ──────────────────────────────────────────────── */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={closeSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* ── Cancel Dialog ─────────────────────────────────────────── */}
            <Dialog open={cancelDialogOpen} onClose={() => !cancelMutation.isPending && setCancelDialogOpen(false)}>
                <DialogTitle>Cancel Booking?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel this booking? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)} disabled={cancelMutation.isPending} color="inherit">
                        No, Keep It
                    </Button>
                    <Button onClick={confirmCancel} color="error" variant="contained" disableElevation disabled={cancelMutation.isPending}>
                        {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BookSeatPage;

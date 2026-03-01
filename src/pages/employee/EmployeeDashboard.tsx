import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Alert,
} from "@mui/material";
import ChairIcon from "@mui/icons-material/Chair";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { useAuthStore } from "../../store/auth.store";
import { useMyBookings } from "../../hooks/useMyBookings";
import { useCancelBooking } from "../../hooks/useCancelBooking";
import { useCheckInBooking } from "../../hooks/useCheckInBooking";
import type { MyBooking } from "../../api/employee.api";


// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns today's date as "YYYY-MM-DD" in LOCAL time.
 * Using toISOString() would give UTC date, which is wrong for IST (UTC+5:30)
 * where midnight local time is still the previous UTC day.
 */
const getLocalDateISO = (): string => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, "0");
    const dd   = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const todayISO = getLocalDateISO();

const formatDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

/**
 * Business rule:
 * Cancel is allowed if:
 *   1. status === 'confirmed'
 *   2. booking_date is today
 *   3. current time is before 10:30 AM
 */
const computeCanCancel = (booking: MyBooking): boolean => {
    const now = new Date();
    const bookingDate = new Date(booking.booking_date + "T00:00:00");
    const isToday = bookingDate.toDateString() === now.toDateString();

    const cutoff = new Date();
    cutoff.setHours(10, 30, 0, 0);

    return booking.status === "confirmed" && isToday && now < cutoff;
};

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
    label: string;
    value: number | undefined;
    icon: React.ReactNode;
    accent?: boolean;
}

const StatCard = ({ label, value, icon, accent = false }: StatCardProps) => (
    <Paper
        elevation={0}
        sx={{
            p: 2.5,
            borderRadius: 2,
            border: "1px solid",
            borderColor: accent ? "primary.main" : "divider",
            bgcolor: accent ? "primary.main" : "background.paper",
            color: accent ? "primary.contrastText" : "text.primary",
        }}
    >
        <Stack direction="row" spacing={2} alignItems="center">
            <Box
                sx={{
                    p: 1.25,
                    borderRadius: 1.5,
                    bgcolor: accent ? "rgba(255,255,255,0.15)" : "primary.50",
                    color: accent ? "white" : "primary.main",
                    display: "flex",
                }}
            >
                {icon}
            </Box>
            <Box>
                {value === undefined ? (
                    <CircularProgress size={18} color={accent ? "inherit" : "primary"} />
                ) : (
                    <Typography variant="h5" fontWeight={700} lineHeight={1.1}>
                        {value}
                    </Typography>
                )}
                <Typography
                    variant="caption"
                    sx={{
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                        opacity: accent ? 0.85 : 0.7,
                        fontWeight: 600,
                    }}
                >
                    {label}
                </Typography>
            </Box>
        </Stack>
    </Paper>
);

// ─── Component ────────────────────────────────────────────────────────────────

const EmployeeDashboard = () => {
    const user = useAuthStore((s) => s.user);
    const navigate = useNavigate();

    // ── Dialog + Snackbar state ───────────────────────────────────────────────
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    const showSnackbar = (message: string, severity: "success" | "error") =>
        setSnackbar({ open: true, message, severity });
    const closeSnackbar = () =>
        setSnackbar((prev) => ({ ...prev, open: false }));

    // ── Mutations ─────────────────────────────────────────────────────────────
    const cancelMutation = useCancelBooking();
    const checkInMutation = useCheckInBooking();

    // ── Queries ───────────────────────────────────────────────────────────────
    // 1. Today's booking
    const { data: todayData, isLoading: loadingToday } = useMyBookings({
        page: 1,
        page_size: 1,
        date: todayISO,
    });

    // 2. Upcoming confirmed bookings
    const { data: upcomingData, isLoading: loadingUpcoming } = useMyBookings({
        page: 1,
        page_size: 5,
        status: "confirmed",
    });

    // 3. Stats — leverage `total` from filtered queries
    const { data: confirmedStats } = useMyBookings({ page: 1, page_size: 1, status: "confirmed" });
    const { data: attendedStats }  = useMyBookings({ page: 1, page_size: 1, status: "checked_in" });

    const todayBooking = todayData?.items[0];
    const canCancel   = todayBooking ? computeCanCancel(todayBooking) : false;

    const upcomingBookings = upcomingData?.items.filter(
        (b) => b.booking_date !== todayISO
    );

    const firstName = user?.name?.split(" ")[0] ?? "there";
    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleConfirmCancel = () => {
        if (!todayBooking) return;
        cancelMutation.mutate(todayBooking.id, {
            onSuccess: () => {
                setCancelDialogOpen(false);
                showSnackbar("Booking cancelled successfully.", "success");
            },
            onError: () => {
                setCancelDialogOpen(false);
                showSnackbar("Failed to cancel booking. Please try again.", "error");
            },
        });
    };

    const handleCheckIn = () => {
        if (!todayBooking) return;
        checkInMutation.mutate(todayBooking.id, {
            onSuccess: () => showSnackbar("Checked in successfully! Enjoy your workspace.", "success"),
            onError: () => showSnackbar("Check-in failed. Please try again.", "error"),
        });
    };

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <Box>
            {/* ── 1. Greeting ─────────────────────────────────────────────── */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
                    {greeting}, {firstName} 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {formatDate(todayISO)} · Here's your workspace summary for today.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* ── 2. Today's Booking Card ─────────────────────────────── */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <CardHeader
                            avatar={<EventAvailableIcon color="primary" />}
                            title="Today's Seat"
                            subheader={formatDate(todayISO)}
                            titleTypographyProps={{ fontWeight: 600 }}
                        />
                        <Divider />
                        <CardContent>
                            {loadingToday ? (
                                <Box className="flex justify-center py-8">
                                    <CircularProgress size={28} />
                                </Box>
                            ) : todayBooking ? (
                                <Stack spacing={2.5} alignItems="center" py={2}>
                                    {/* Seat icon circle */}
                                    <Box
                                        sx={{
                                            width: 96,
                                            height: 96,
                                            borderRadius: "50%",
                                            bgcolor: "primary.50",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "2px solid",
                                            borderColor: "primary.main",
                                        }}
                                    >
                                        <ChairIcon sx={{ fontSize: 44, color: "primary.main" }} />
                                    </Box>

                                    {/* Seat number + date */}
                                    <Box textAlign="center">
                                        <Typography variant="h2" fontWeight={800} color="primary.main" lineHeight={1}>
                                            {todayBooking.seat_number}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Reserved for {formatDate(todayBooking.booking_date)}
                                        </Typography>
                                    </Box>

                                    {/* Status chip */}
                                    <Chip
                                        label={todayBooking.status.replace("_", " ").toUpperCase()}
                                        color={todayBooking.status === "checked_in" ? "success" : "primary"}
                                        sx={{ fontWeight: 700, px: 1.5 }}
                                    />

                                    {/* Action buttons — only for confirmed status */}
                                    {todayBooking.status === "confirmed" && (
                                        <Stack direction="row" spacing={1} width="100%" sx={{ mt: 1 }}>
                                            {/* Check-in (always visible for confirmed) */}
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="success"
                                                disableElevation
                                                startIcon={
                                                    checkInMutation.isPending
                                                        ? <CircularProgress size={16} color="inherit" />
                                                        : <HowToRegIcon />
                                                }
                                                disabled={checkInMutation.isPending}
                                                onClick={handleCheckIn}
                                                sx={{ textTransform: "none", fontWeight: 600 }}
                                            >
                                                Check-in
                                            </Button>

                                            {/* Cancel — only before 10:30 AM business cutoff */}
                                            {canCancel && (
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<CancelIcon />}
                                                    onClick={() => setCancelDialogOpen(true)}
                                                    sx={{ textTransform: "none", fontWeight: 600 }}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </Stack>
                                    )}

                                    {/* Hint when cancel window is closed */}
                                    {todayBooking.status === "confirmed" && !canCancel && (
                                        <Typography variant="caption" color="text.disabled" textAlign="center">
                                            Cancellations are only allowed before 10:30 AM.
                                        </Typography>
                                    )}
                                </Stack>
                            ) : (
                                /* ── No booking state ── */
                                <Box className="flex flex-col items-center py-8 gap-3">
                                    <ChairIcon sx={{ fontSize: 40, color: "text.disabled" }} />
                                    <Typography variant="body1" color="text.secondary" textAlign="center" fontWeight={500}>
                                        No booking for today
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        disableElevation
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={() => navigate("/employee/book-seat")}
                                        sx={{ textTransform: "none", mt: 1 }}
                                    >
                                        Book a Seat
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* ── Right Column ──────────────────────────────────────────── */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={3} height="100%">
                        {/* ── 3. Quick Stats ─────────────────────────────────── */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <StatCard
                                    label="Confirmed Bookings"
                                    value={confirmedStats?.total}
                                    icon={<ConfirmationNumberOutlinedIcon fontSize="small" />}
                                    accent
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <StatCard
                                    label="Sessions Attended"
                                    value={attendedStats?.total}
                                    icon={<CheckCircleOutlineIcon fontSize="small" />}
                                />
                            </Grid>
                        </Grid>

                        {/* ── 4. Upcoming Bookings List ─────────────────────── */}
                        <Card
                            elevation={0}
                            sx={{
                                flex: 1,
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            <CardHeader
                                avatar={<UpcomingIcon color="secondary" />}
                                title="Upcoming Reservations"
                                titleTypographyProps={{ fontWeight: 600 }}
                                action={
                                    <Button
                                        size="small"
                                        onClick={() => navigate("/employee/bookings")}
                                        sx={{ textTransform: "none", mr: 1 }}
                                    >
                                        View all
                                    </Button>
                                }
                            />
                            <Divider />
                            <CardContent sx={{ p: 0 }}>
                                {loadingUpcoming ? (
                                    <Box className="flex justify-center p-6">
                                        <CircularProgress size={24} />
                                    </Box>
                                ) : upcomingBookings && upcomingBookings.length > 0 ? (
                                    <List disablePadding>
                                        {upcomingBookings.map((b, idx) => (
                                            <React.Fragment key={b.id}>
                                                <ListItem sx={{ px: 3, py: 1.5 }}>
                                                    <ListItemText
                                                        primary={`Seat ${b.seat_number}`}
                                                        secondary={formatDate(b.booking_date)}
                                                        primaryTypographyProps={{ fontWeight: 600 }}
                                                        secondaryTypographyProps={{ fontSize: 12 }}
                                                    />
                                                    <Chip
                                                        size="small"
                                                        label="CONFIRMED"
                                                        variant="outlined"
                                                        color="primary"
                                                    />
                                                </ListItem>
                                                {idx < upcomingBookings.length - 1 && (
                                                    <Divider component="li" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                ) : (
                                    <Box className="flex flex-col items-center py-8 gap-1">
                                        <UpcomingIcon sx={{ fontSize: 36, color: "text.disabled" }} />
                                        <Typography variant="body2" color="text.secondary">
                                            No upcoming reservations.
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                {/* ── 5. Quick Action Buttons ──────────────────────────────── */}
                <Grid size={{ xs: 12 }}>
                    <Divider sx={{ mb: 3 }} />
                    <Typography variant="overline" color="text.secondary" fontWeight={700} display="block" mb={1.5}>
                        Quick Actions
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button
                            id="book-seat-btn"
                            variant="contained"
                            disableElevation
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => navigate("/employee/book-seat")}
                            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                        >
                            Book a Seat
                        </Button>
                        <Button
                            id="my-bookings-btn"
                            variant="outlined"
                            startIcon={<FormatListBulletedIcon />}
                            onClick={() => navigate("/employee/bookings")}
                            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                        >
                            My Bookings
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            {/* ── Cancel Confirmation Dialog ────────────────────────────────── */}
            <Dialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WarningAmberIcon color="warning" />
                    Cancel Booking?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel your reservation for{" "}
                        <strong>Seat {todayBooking?.seat_number}</strong> today? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setCancelDialogOpen(false)}
                        sx={{ textTransform: "none" }}
                        disabled={cancelMutation.isPending}
                    >
                        Keep Booking
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        disableElevation
                        onClick={handleConfirmCancel}
                        disabled={cancelMutation.isPending}
                        startIcon={
                            cancelMutation.isPending
                                ? <CircularProgress size={16} color="inherit" />
                                : <CancelIcon />
                        }
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                        {cancelMutation.isPending ? "Cancelling…" : "Yes, Cancel"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Snackbar ─────────────────────────────────────────────────── */}
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
        </Box>
    );
};

export default EmployeeDashboard;

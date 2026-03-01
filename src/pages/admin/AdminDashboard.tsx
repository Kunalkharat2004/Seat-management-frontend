import {
    Box,
    Card,
    CardContent,
    Typography,
    Skeleton,
    Alert,
    Grid,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useDashboardMetrics } from "../../hooks/useDashboardMetrics";

// ─── Component ───────────────────────────────────────────────────────────────

interface MetricCardProps {
    label: string;
    value?: number;
    icon: React.ReactNode;
    color: string;
    loading: boolean;
}

const MetricCard = ({ label, value, icon, color, loading }: MetricCardProps) => (
    <Card
        elevation={0}
        sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            height: "100%",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                transform: "translateY(-2px)",
            },
        }}
    >
        <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: `${color}10`,
                        color: color,
                    }}
                >
                    {icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {label}
                    </Typography>
                    {loading ? (
                        <Skeleton width="40%" height={40} sx={{ mt: 0.5 }} />
                    ) : (
                        <Typography variant="h4" fontWeight={700}>
                            {value?.toLocaleString() ?? 0}
                        </Typography>
                    )}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
    const { data, isLoading, isError } = useDashboardMetrics();

    return (
        <Box sx={{ p: 1 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 4 }}>
                Admin Dashboard
            </Typography>

            {isError && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                    Failed to load dashboard metrics. Please check your connection and try again.
                </Alert>
            )}

            {/* Row 1: Employee Metrics */}
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                Employee Overview
            </Typography>
            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <MetricCard
                        label="Total Employees"
                        value={data?.total_employees}
                        icon={<PeopleIcon />}
                        color="#2563eb"
                        loading={isLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <MetricCard
                        label="Active Employees"
                        value={data?.active_employees}
                        icon={<PersonOutlineIcon />}
                        color="#059669"
                        loading={isLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <MetricCard
                        label="Inactive Employees"
                        value={data?.inactive_employees}
                        icon={<PersonOffIcon />}
                        color="#dc2626"
                        loading={isLoading}
                    />
                </Grid>
            </Grid>

            {/* Row 2: Space & Booking Metrics */}
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                Space & Bookings Today
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <MetricCard
                        label="Total Seats"
                        value={data?.total_seats}
                        icon={<EventSeatIcon />}
                        color="#4b5563"
                        loading={isLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <MetricCard
                        label="Today's Bookings"
                        value={data?.today_bookings}
                        icon={<BookmarkAddedIcon />}
                        color="#7c3aed"
                        loading={isLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <MetricCard
                        label="Today's Checked-in"
                        value={data?.today_checked_in}
                        icon={<HowToRegIcon />}
                        color="#0891b2"
                        loading={isLoading}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <MetricCard
                        label="Today's Confirmed"
                        value={data?.today_confirmed}
                        icon={<CheckCircleOutlineIcon />}
                        color="#ea580c"
                        loading={isLoading}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;

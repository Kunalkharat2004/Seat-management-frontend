import {
    Box,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

// ─── Summary Card Data ───────────────────────────────────────────────────────

const summaryCards = [
    {
        label: "Total Employees",
        value: 128,
        icon: <PeopleIcon sx={{ fontSize: 36 }} />,
        color: "#1976d2",
    },
    {
        label: "Total Seats",
        value: 64,
        icon: <EventSeatIcon sx={{ fontSize: 36 }} />,
        color: "#2e7d32",
    },
    {
        label: "Today's Bookings",
        value: 42,
        icon: <BookOnlineIcon sx={{ fontSize: 36 }} />,
        color: "#ed6c02",
    },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

const AdminDashboard = () => {
    return (
        <Box>
            <Typography variant="h5" fontWeight={600} className="mb-6">
                Admin Dashboard
            </Typography>

            {/* Summary cards — 1 col mobile, 3 cols desktop */}
            <Box className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {summaryCards.map(({ label, value, icon, color }) => (
                    <Card
                        key={label}
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            transition: "box-shadow 0.2s ease",
                            "&:hover": {
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            },
                        }}
                    >
                        <CardContent className="flex items-center gap-4 p-5">
                            {/* Icon */}
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: `${color}14`,
                                    color: color,
                                }}
                            >
                                {icon}
                            </Box>

                            {/* Text */}
                            <Box>
                                <Typography variant="h4" fontWeight={700}>
                                    {value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {label}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default AdminDashboard;

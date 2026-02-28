import { Typography, Box, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuthStore } from "../../store/auth.store";
import { useLogout } from "../../hooks/useAuth";

const EmployeeDashboard = () => {
    const user = useAuthStore((s) => s.user);
    const logout = useLogout();

    return (
        <Box className="flex min-h-screen flex-col items-center justify-center gap-4">
            <Typography variant="h4" fontWeight={600}>
                Employee Dashboard
            </Typography>

            <Typography variant="body1" color="text.secondary">
                Welcome, {user?.name ?? "Employee"}
            </Typography>

            <Button
                id="logout-btn"
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{ textTransform: "none" }}
            >
                Logout
            </Button>
        </Box>
    );
};

export default EmployeeDashboard;

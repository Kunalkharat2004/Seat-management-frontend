import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Divider,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import LogoutIcon from "@mui/icons-material/Logout";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { useAuthStore } from "../store/auth.store";
import { useLogout } from "../hooks/useAuth";

// ─── Constants ───────────────────────────────────────────────────────────────

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/employee/dashboard" },
    { label: "My Bookings", icon: <BookOnlineIcon />, path: "/employee/bookings" },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

const EmployeeLayout = () => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
    const [mobileOpen, setMobileOpen] = useState(false);

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const logout = useLogout();

    const handleNavClick = (path: string) => {
        navigate(path);
        if (!isDesktop) setMobileOpen(false);
    };

    const todayStr = new Date().toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    // ── Sidebar content ────────────────────────────────────────────────────────

    const drawerContent = (
        <Box className="flex h-full flex-col">
            {/* Brand */}
            <Toolbar
                sx={{
                    gap: 1.5,
                    borderBottom: 1,
                    borderColor: "divider"
                }}
            >
                <BookOnlineIcon sx={{ fontSize: 28 }} />
                <Typography variant="subtitle1" fontWeight={700} noWrap>
                    WorkSpace
                </Typography>
            </Toolbar>

            {/* Nav items */}
            <List className="flex-1 py-4">
                {NAV_ITEMS.map(({ label, icon, path }) => (
                    <ListItemButton
                        key={path}
                        selected={pathname === path}
                        onClick={() => handleNavClick(path)}
                        sx={{
                            mx: 2,
                            borderRadius: 1.5,
                            mb: 1,
                            py: 1.25,
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                "&:hover": { bgcolor: "primary.dark" },
                                "& .MuiListItemIcon-root": { color: "inherit" },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                        <ListItemText
                            primary={label}
                            primaryTypographyProps={{ fontWeight: pathname === path ? 600 : 500 }}
                        />
                    </ListItemButton>
                ))}
            </List>

            {/* User Profile Info (Bottom Sidebar) */}
            <Box sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ px: 1, mb: 1, display: "block" }}>
                    ACCOUNT
                </Typography>
                <List disablePadding>
                    <ListItemButton
                        onClick={logout}
                        sx={{ borderRadius: 1.5, color: "error.main" }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500 }} />
                    </ListItemButton>
                </List>
            </Box>
        </Box>
    );

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        <Box className="flex min-h-screen">
            {/* ── Sidebar ──────────────────────────────────────────────── */}
            <Box
                component="nav"
                sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
            >
                {isDesktop ? (
                    <Drawer
                        variant="permanent"
                        open
                        sx={{
                            "& .MuiDrawer-paper": {
                                width: DRAWER_WIDTH,
                                boxSizing: "border-box",
                                borderRight: "1px solid",
                                borderColor: "divider",
                            },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                ) : (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={() => setMobileOpen(false)}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            "& .MuiDrawer-paper": {
                                width: DRAWER_WIDTH,
                                boxSizing: "border-box",
                            },
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                )}
            </Box>

            {/* ── Main area ────────────────────────────────────────────── */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    bgcolor: "grey.50",
                }}
            >
                {/* Topbar */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: "background.paper",
                        color: "text.primary",
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {/* Hamburger (mobile only) */}
                            {!isDesktop && (
                                <IconButton
                                    edge="start"
                                    onClick={() => setMobileOpen(true)}
                                    sx={{ mr: 2 }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            )}

                            {/* Date Display */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                                <CalendarMonthIcon sx={{ fontSize: 20 }} />
                                <Typography variant="body2" fontWeight={500}>
                                    {todayStr}
                                </Typography>
                            </Box>
                        </Box>

                        {/* User info */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box sx={{ textAlign: "right" }}>
                                <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>
                                    {user?.name ?? "Employee"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user?.employee_id ?? "User"}
                                </Typography>
                            </Box>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Page content */}
                <Box className="flex-1 p-6">
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default EmployeeLayout;

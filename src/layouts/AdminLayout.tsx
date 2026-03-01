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
import PeopleIcon from "@mui/icons-material/People";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuthStore } from "../store/auth.store";
import { useLogout } from "../hooks/useAuth";

// ─── Constants ───────────────────────────────────────────────────────────────

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { label: "Employees", icon: <PeopleIcon />, path: "/admin/employees" },
    { label: "Seats", icon: <EventSeatIcon />, path: "/admin/seats" },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

const AdminLayout = () => {
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

    // ── Sidebar content ────────────────────────────────────────────────────────

    const drawerContent = (
        <Box className="flex h-full flex-col">
            {/* Brand */}
            <Toolbar
                sx={{
                    gap: 1.5,
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <DashboardIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={700} noWrap>
                    DWM Admin
                </Typography>
            </Toolbar>

            {/* Nav items */}
            <List className="flex-1 py-2">
                {NAV_ITEMS.map(({ label, icon, path }) => (
                    <ListItemButton
                        key={path}
                        selected={pathname === path}
                        onClick={() => handleNavClick(path)}
                        sx={{
                            mx: 1,
                            borderRadius: 2,
                            mb: 0.5,
                            "&.Mui-selected": {
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                "&:hover": { bgcolor: "primary.dark" },
                                "& .MuiListItemIcon-root": { color: "inherit" },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                        <ListItemText primary={label} />
                    </ListItemButton>
                ))}
            </List>

            {/* Logout */}
            <Divider />
            <List>
                <ListItemButton
                    onClick={logout}
                    sx={{ mx: 1, borderRadius: 2, color: "error.main" }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </List>
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
                    <Toolbar>
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

                        {/* Title */}
                        <Typography variant="h6" fontWeight={600} noWrap sx={{ flexGrow: 1 }}>
                            Digital Workspace Management
                        </Typography>

                        {/* Admin name */}
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {user?.name ?? "Admin"}
                        </Typography>
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

export default AdminLayout;

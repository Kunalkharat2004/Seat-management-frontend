import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Paper,
    Stack,
    Chip,
    CardActionArea,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CampaignIcon from "@mui/icons-material/Campaign";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import GroupsIcon from "@mui/icons-material/Groups";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import heroIllustration from "../assets/hero_illustration.png";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NewsItem {
    id: number;
    title: string;
    description: string;
    date: string;
    icon: React.ReactNode;
    tag: string;
}

interface AppItem {
    id: number;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    path?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const NEWS_ITEMS: NewsItem[] = [
    {
        id: 1,
        title: "Company Townhall — Q1 2026",
        description:
            "Join us for the quarterly townhall to review milestones, upcoming roadmap, and key achievements across all departments.",
        date: "14 Mar 2026",
        icon: <CampaignIcon />,
        tag: "Announcement",
    },
    {
        id: 2,
        title: "New Training Programs Available",
        description:
            "Explore the latest learning paths on cloud engineering, DevOps best practices, and leadership development.",
        date: "10 Mar 2026",
        icon: <NewReleasesIcon />,
        tag: "Learning",
    },
    {
        id: 3,
        title: "Department Restructuring Update",
        description:
            "Key updates regarding the reorganization of engineering teams to align with our 2026 strategic vision.",
        date: "07 Mar 2026",
        icon: <GroupsIcon />,
        tag: "Update",
    },
    {
        id: 4,
        title: "Annual Sports Day — Save the Date!",
        description:
            "Mark your calendars for the annual corporate sports day event. Registration opens next week.",
        date: "01 Mar 2026",
        icon: <CelebrationIcon />,
        tag: "Event",
    },
];

const APP_ITEMS: AppItem[] = [
    {
        id: 1,
        name: "Seat Management",
        description: "Reserve office seats in advance.",
        icon: <EventSeatIcon sx={{ fontSize: 32 }} />,
        color: "#1976d2",
        path: "/employee/dashboard",
    },
    {
        id: 2,
        name: "Employee Training",
        description: "Access training programs and learning resources.",
        icon: <SchoolIcon sx={{ fontSize: 32 }} />,
        color: "#2e7d32",
    },
    {
        id: 3,
        name: "Employee Management",
        description: "Manage employee profiles and details.",
        icon: <PeopleIcon sx={{ fontSize: 32 }} />,
        color: "#ed6c02",
    },
    {
        id: 4,
        name: "Leave Management",
        description: "Apply and track employee leaves.",
        icon: <EventNoteIcon sx={{ fontSize: 32 }} />,
        color: "#9c27b0",
    },
];

const TAG_COLORS: Record<string, "primary" | "success" | "info" | "secondary"> = {
    Announcement: "primary",
    Learning: "success",
    Update: "info",
    Event: "secondary",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const HeroSection: React.FC = () => (
    <Box
        sx={{
            background: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            minHeight: { xs: 320, md: 380 },
            display: "flex",
            alignItems: "center",
        }}
    >
        {/* Subtle grid overlay */}
        <Box
            sx={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                    "linear-gradient(rgba(25,118,210,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(25,118,210,0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                pointerEvents: "none",
            }}
        />

        <Box
            className="flex flex-col md:flex-row items-center"
            sx={{
                width: "100%",
                maxWidth: 1200,
                mx: "auto",
                px: { xs: 3, md: 6 },
                py: { xs: 4, md: 5 },
                position: "relative",
                zIndex: 1,
                gap: { xs: 4, md: 0 },
            }}
        >
            {/* Left side — Logo + Tagline */}
            <Box sx={{ flex: 1 }}>
                {/* Logo / Brand */}
                <Box className="flex items-center gap-3" sx={{ mb: 3 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            border: "2px solid rgba(25,118,210,0.6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(25,118,210,0.1)",
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            fontWeight={800}
                            sx={{ color: "#fff", letterSpacing: 1 }}
                        >
                            BTI
                        </Typography>
                    </Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ letterSpacing: 0.5 }}
                    >
                        Department Portal
                    </Typography>
                </Box>

                {/* Code-style tagline */}
                <Box
                    component="pre"
                    sx={{
                        fontFamily: "'Roboto Mono', 'Consolas', monospace",
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        lineHeight: 1.8,
                        color: "rgba(255,255,255,0.85)",
                        m: 0,
                        p: 0,
                        background: "none",
                        border: "none",
                    }}
                >
                    <Box component="span" sx={{ color: "#58a6ff" }}>
                        {"<engine>"}
                    </Box>
                    {"\n"}
                    {"  status = "}
                    <Box component="span" sx={{ color: "#fff", fontWeight: 700 }}>
                        {'"Built in Code"'}
                    </Box>
                    {";"}
                    {"\n"}
                    {"  motion = "}
                    <Box component="span" sx={{ color: "#fff", fontWeight: 700 }}>
                        {'"Driven in Style"'}
                    </Box>
                    {";"}
                    {"\n"}
                    <Box component="span" sx={{ color: "#58a6ff" }}>
                        {"</engine>"}
                    </Box>
                </Box>
            </Box>

            {/* Right side — Illustration */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    component="img"
                    src={heroIllustration}
                    alt="Technology and innovation illustration"
                    sx={{
                        maxWidth: { xs: 280, md: 420 },
                        width: "100%",
                        height: "auto",
                        borderRadius: 2,
                        opacity: 0.9,
                    }}
                />
            </Box>
        </Box>
    </Box>
);

const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => (
    <Card
        elevation={0}
        sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            transition: "box-shadow 0.2s ease",
            "&:hover": {
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            },
        }}
    >
        <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                    sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: "primary.50",
                        color: "primary.main",
                        display: "flex",
                        flexShrink: 0,
                        mt: 0.25,
                    }}
                >
                    {item.icon}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 0.5 }}
                    >
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            noWrap
                            sx={{ flex: 1 }}
                        >
                            {item.title}
                        </Typography>
                        <Chip
                            label={item.tag}
                            size="small"
                            color={TAG_COLORS[item.tag] ?? "default"}
                            variant="outlined"
                            sx={{ fontSize: 11, height: 22 }}
                        />
                    </Stack>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 1,
                            lineHeight: 1.5,
                        }}
                    >
                        {item.description}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CalendarMonthIcon
                            sx={{ fontSize: 14, color: "text.disabled" }}
                        />
                        <Typography variant="caption" color="text.disabled">
                            {item.date}
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
        </CardContent>
    </Card>
);

const ApplicationCard: React.FC<{ item: AppItem; onNavigate?: (path: string) => void }> = ({ item, onNavigate }) => (
    <Card
        elevation={0}
        sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            transition: "all 0.2s ease",
            "&:hover": {
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transform: "translateY(-2px)",
            },
        }}
    >
        <CardActionArea
            sx={{ p: 2.5 }}
            onClick={() => item.path && onNavigate?.(item.path)}
        >
            <Stack direction="row" spacing={2} alignItems="center">
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: `${item.color}14`,
                        color: item.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {item.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                        {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.4}>
                        {item.description}
                    </Typography>
                </Box>
            </Stack>
        </CardActionArea>
    </Card>
);

// ─── Page Component ──────────────────────────────────────────────────────────

const DepartmentPortalPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: "#f5f6f8", minHeight: "100vh" }}>
            {/* ── Hero Section ────────────────────────────────────────────── */}
            <HeroSection />

            {/* ── Main Content ────────────────────────────────────────────── */}
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    px: { xs: 2, md: 4 },
                    py: { xs: 3, md: 5 },
                }}
            >
                <Grid container spacing={4}>
                    {/* ── News Section (Left) ─────────────────────────────── */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "background.paper",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    px: 3,
                                    py: 2,
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color="text.primary"
                                >
                                    Latest News
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Stay updated with company announcements
                                </Typography>
                            </Box>
                            <Stack spacing={0} sx={{ p: 2 }}>
                                {NEWS_ITEMS.map((item, idx) => (
                                    <React.Fragment key={item.id}>
                                        <NewsCard item={item} />
                                        {idx < NEWS_ITEMS.length - 1 && (
                                            <Box sx={{ height: 12 }} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* ── Applications Section (Right) ────────────────────── */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "background.paper",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    px: 3,
                                    py: 2,
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color="text.primary"
                                >
                                    Applications For You!
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Quick access to internal tools
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Grid container spacing={1.5}>
                                    {APP_ITEMS.map((item) => (
                                        <Grid
                                            key={item.id}
                                            size={{ xs: 12, sm: 6 }}
                                        >
                                            <ApplicationCard item={item} onNavigate={navigate} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default DepartmentPortalPage;

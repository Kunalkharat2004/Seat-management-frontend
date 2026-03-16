import React from "react";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CampaignIcon from "@mui/icons-material/Campaign";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import GroupsIcon from "@mui/icons-material/Groups";
import CelebrationIcon from "@mui/icons-material/Celebration";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NewsItem {
    id: number;
    title: string;
    description: string;
    date: string;
    icon: React.ReactNode;
    tag: string;
}

export interface AppItem {
    id: number;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    path?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

export const NEWS_ITEMS: NewsItem[] = [
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

export const APP_ITEMS: AppItem[] = [
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

export const TAG_COLORS: Record<string, "primary" | "success" | "info" | "secondary"> = {
    Announcement: "primary",
    Learning: "success",
    Update: "info",
    Event: "secondary",
};

import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import CodeIcon from "@mui/icons-material/Code";
import VerifiedIcon from "@mui/icons-material/Verified";

// ─── Platform Data ───────────────────────────────────────────────────────────

interface Platform {
    title: string;
    description: string;
    icon: React.ReactNode;
    accent: string;
}

const PLATFORMS: Platform[] = [
    {
        title: "Archcraft",
        description:
            "Central platform for software requirements engineering, architecture design, detailed design, and API management — ensuring consistency and reusability across all projects.",
        icon: <ArchitectureIcon sx={{ fontSize: 30 }} />,
        accent: "#1976d2",
    },
    {
        title: "Codecraft",
        description:
            "Corporate E/E development platform with CI infrastructure and shared tooling for internal teams and external partners to build, test, and integrate software efficiently.",
        icon: <CodeIcon sx={{ fontSize: 30 }} />,
        accent: "#2e7d32",
    },
    {
        title: "ValidationCraft",
        description:
            "Flexible validation marketplace harmonizing test libraries and reporting with reusable, versioned tooling — a single point of responsibility for all validation needs.",
        icon: <VerifiedIcon sx={{ fontSize: 30 }} />,
        accent: "#ed6c02",
    },
];

// ─── Component ───────────────────────────────────────────────────────────────

const AboutSection: React.FC = () => (
    <Box
        sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, md: 1 },
            pt: { xs: 3, md: 4 },
        }}
    >
        {/* ── About Banner ────────────────────────────────────────────── */}
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }}
        >
            {/* Top section — dark accent bar with title */}
            <Box
                sx={{
                    // background: "linear-gradient(135deg, #0d1117 0%, #1a2332 100%)",
                    // color: "#fff",
                    px: { xs: 3, md: 5 },
                    py: { xs: 3, md: 4 },
                }}
            >
                <Typography
                    variant="overline"
                    sx={{
                        color: "#58a6ff",
                        fontWeight: 700,
                        letterSpacing: 2,
                        fontSize: "0.7rem",
                        display: "block",
                        mb: 0.5,
                    }}
                >
                    About Us
                </Typography>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 1.5 }}>
                    Software Factory
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        // color: "rgba(255,255,255,0.75)",
                        lineHeight: 1.8,
                        maxWidth: 860,
                    }}
                >
                    Software Factory is the Software Engineering Center of Excellence
                    for BMW Group. We standardize and improve processes, methods, and
                    tools across BMW departments to support modern, high-quality
                    software development worldwide. We provide professionally managed
                    tools that are reliable, stable, and high-performing — and guide
                    projects to smoothly onboard to our systems today, and offboard
                    when needed, in line with our 2030 target vision.
                </Typography>
            </Box>

            {/* Bottom section — Platform cards in a row */}
            <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2.5, md: 3.5 } }}>
                <Typography
                    variant="overline"
                    fontWeight={700}
                    color="text.secondary"
                    sx={{ letterSpacing: 1.5, display: "block", mb: 2 }}
                >
                    Our Platforms
                </Typography>

                <Grid container spacing={2.5}>
                    {PLATFORMS.map((platform) => (
                        <Grid key={platform.title} size={{ xs: 12, md: 4 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    height: "100%",
                                    p: 3,
                                    borderRadius: 2.5,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        borderColor: platform.accent,
                                        boxShadow: `0 4px 20px ${platform.accent}18`,
                                        transform: "translateY(-2px)",
                                    },
                                }}
                            >
                                {/* Icon */}
                                <Box
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 2,
                                        bgcolor: `${platform.accent}12`,
                                        color: platform.accent,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 2,
                                    }}
                                >
                                    {platform.icon}
                                </Box>

                                {/* Title */}
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                    color="text.primary"
                                    sx={{ mb: 1 }}
                                >
                                    {platform.title}
                                </Typography>

                                {/* Description */}
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.7 }}
                                >
                                    {platform.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Paper>
    </Box>
);

export default AboutSection;

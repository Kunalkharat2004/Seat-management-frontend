import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Paper, Stack } from "@mui/material";

import HeroSection from "../components/portal/HeroSection";
import NewsCard from "../components/portal/NewsCard";
import ApplicationCard from "../components/portal/ApplicationCard";
import { NEWS_ITEMS, APP_ITEMS } from "../components/portal/portalData";

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

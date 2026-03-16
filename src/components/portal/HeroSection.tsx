import React from "react";
import { Box, Typography, AppBar, Toolbar, Button, Stack } from "@mui/material";

import heroImage from "../../assets/image.png";
import department_logo from "../../assets/SF_logo.png";

// ─── Navigation Links ────────────────────────────────────────────────────────

const NAV_LINKS = ["Home", "Who are we?", "HR Policies & SPOCs"] as const;

// ─── Hero Section ────────────────────────────────────────────────────────────

const HeroSection: React.FC = () => (
    <Box>
        {/* ── Navbar ──────────────────────────────────────────────────── */}
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: "background.paper",
                color: "text.primary",
                borderBottom: "1px solid",
                borderColor: "divider",
            }}
        >
            <Toolbar
                sx={{
                    maxWidth: 1200,
                    width: "100%",
                    mx: "auto",
                    px: { xs: 2, md: 4 },
                    justifyContent: "space-between",
                }}
            >
                {/* Left — Department Logo */}
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                        component="img"
                        src={department_logo}
                        alt="Department Logo"
                        sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "10%",
                        }}
                    />
                    <Typography variant="h6" fontWeight={700} noWrap>
                        Software Factory
                    </Typography>
                </Stack>

                {/* Right — Navigation Links */}
                <Stack direction="row" spacing={0.5}>
                    {NAV_LINKS.map((label, idx) => (
                        <Button
                            key={label}
                            size="small"
                            sx={{
                                textTransform: "none",
                                fontWeight: idx === 0 ? 700 : 500,
                                color: idx === 0 ? "text.primary" : "text.secondary",
                                fontSize: "0.875rem",
                                px: 1.5,
                                "&:hover": {
                                    bgcolor: "action.hover",
                                },
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </Stack>
            </Toolbar>
        </AppBar>

        {/* ── Hero Image Banner ───────────────────────────────────────── */}
        <Box
            sx={{
                bgcolor: "#f5f6f8",
                px: { xs: 2, md: 4 },
                pt: { xs: 2, md: 3 },
            }}
        >
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                }}
            >
                <Box
                    component="img"
                    src={heroImage}
                    alt="Department Portal Hero Banner"
                    sx={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        borderRadius: 2,
                    }}
                />
            </Box>
        </Box>
    </Box>
);

export default HeroSection;

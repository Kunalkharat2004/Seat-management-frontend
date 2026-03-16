import React from "react";
import { Box, Typography } from "@mui/material";

import heroIllustration from "../../assets/hero_illustration.png";

// ─── Hero Section ────────────────────────────────────────────────────────────

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

export default HeroSection;

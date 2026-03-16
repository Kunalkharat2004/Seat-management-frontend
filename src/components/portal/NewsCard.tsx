import React from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Stack,
    Chip,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import type { NewsItem } from "./portalData";
import { TAG_COLORS } from "./portalData";

// ─── News Card ───────────────────────────────────────────────────────────────

interface NewsCardProps {
    item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => (
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

export default NewsCard;

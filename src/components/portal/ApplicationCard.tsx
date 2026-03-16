import React from "react";
import {
    Box,
    Typography,
    Card,
    CardActionArea,
    Stack,
} from "@mui/material";

import type { AppItem } from "./portalData";

// ─── Application Card ────────────────────────────────────────────────────────

interface ApplicationCardProps {
    item: AppItem;
    onNavigate?: (path: string) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ item, onNavigate }) => (
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

export default ApplicationCard;

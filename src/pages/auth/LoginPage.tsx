import { type FormEvent, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { AxiosError } from "axios";

import { useLoginMutation } from "../../hooks/useAuth";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getErrorMessage = (error: Error | null): string => {
    if (!error) return "";

    if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
            return "Invalid credentials. Please try again.";
        }
        if (error.response?.data?.detail) {
            return error.response.data.detail;
        }
    }

    return "Something went wrong. Please try again later.";
};

// ─── Component ───────────────────────────────────────────────────────────────

const LoginPage = () => {
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");

    const loginMutation = useLoginMutation();

    // ── Submit handler ──────────────────────────────────────────────────────────
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loginMutation.mutate({ employee_id: employeeId, password });
    };

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        <Box className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card
                elevation={3}
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    borderRadius: 3,
                }}
            >
                <CardContent className="flex flex-col items-center gap-6 p-8">
                    {/* ── Header ─────────────────────────────────────────────────── */}
                    <Box
                        sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <LockOutlinedIcon />
                    </Box>

                    <Typography variant="h5" component="h1" fontWeight={600}>
                        Sign In
                    </Typography>

                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Digital Workspace Management
                    </Typography>

                    {/* ── Error alert ────────────────────────────────────────────── */}
                    {loginMutation.isError && (
                        <Alert severity="error" sx={{ width: "100%" }}>
                            {getErrorMessage(loginMutation.error)}
                        </Alert>
                    )}

                    {/* ── Form ──────────────────────────────────────────────────── */}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        className="flex w-full flex-col gap-5"
                        noValidate
                    >
                        <TextField
                            id="employee-id"
                            label="Employee ID"
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            required
                            fullWidth
                            autoFocus
                            autoComplete="username"
                            disabled={loginMutation.isPending}
                        />

                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            autoComplete="current-password"
                            disabled={loginMutation.isPending}
                        />

                        <Button
                            id="login-submit"
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={loginMutation.isPending || !employeeId || !password}
                            sx={{
                                py: 1.5,
                                fontWeight: 600,
                                textTransform: "none",
                                fontSize: "1rem",
                            }}
                        >
                            {loginMutation.isPending ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;

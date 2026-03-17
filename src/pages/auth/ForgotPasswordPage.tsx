import { type FormEvent, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

import { useForgotPasswordMutation } from "../../hooks/useAuth";

// ─── Constants ───────────────────────────────────────────────────────────────

const GENERIC_SUCCESS_MESSAGE =
    "If the account exists, a reset link has been sent.";

// ─── Component ───────────────────────────────────────────────────────────────

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const mutation = useForgotPasswordMutation();

    // ── Submit handler ───────────────────────────────────────────────────────
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate(
            { email },
            {
                onSettled: () => {
                    // Always show success — no error details that reveal account existence
                    setSubmitted(true);
                },
            },
        );
    };

    // ── Render ────────────────────────────────────────────────────────────────

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
                    {/* ── Icon ─────────────────────────────────────────────────── */}
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
                        <LockResetOutlinedIcon />
                    </Box>

                    <Typography variant="h5" component="h1" fontWeight={600}>
                        Forgot Password
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                    >
                        Enter your email address and we&apos;ll send you a link
                        to reset your password.
                    </Typography>

                    {/* ── Success message ──────────────────────────────────────── */}
                    {submitted && (
                        <Alert severity="success" sx={{ width: "100%" }}>
                            {GENERIC_SUCCESS_MESSAGE}
                        </Alert>
                    )}

                    {/* ── Form ─────────────────────────────────────────────────── */}
                    {!submitted && (
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            className="flex w-full flex-col gap-5"
                            noValidate
                        >
                            <TextField
                                id="forgot-password-email"
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                                autoFocus
                                autoComplete="email"
                                disabled={mutation.isPending}
                            />

                            <Button
                                id="forgot-password-submit"
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={mutation.isPending || !email}
                                sx={{
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                }}
                            >
                                {mutation.isPending ? (
                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </Box>
                    )}

                    {/* ── Back to login link ───────────────────────────────────── */}
                    <Link
                        component={RouterLink}
                        to="/login"
                        variant="body2"
                        underline="hover"
                    >
                        Back to Sign In
                    </Link>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ForgotPasswordPage;

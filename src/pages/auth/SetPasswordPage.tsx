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
    Snackbar,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useSetPasswordMutation } from "../../hooks/useAuth";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getErrorMessage = (error: Error | null): string => {
    if (!error) return "";

    if (error instanceof AxiosError) {
        const detail = error.response?.data?.detail;
        if (detail && typeof detail === "string") {
            if (detail.toLowerCase().includes("expired")) {
                return "Token expired. Please contact admin.";
            }
            return detail;
        }
    }

    return "Something went wrong. Please try again later.";
};

// ─── Component ───────────────────────────────────────────────────────────────

const SetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const setPasswordMutation = useSetPasswordMutation();
    const loading = setPasswordMutation.isPending;
    const error = setPasswordMutation.error;

    // ── Validation ─────────────────────────────────────────────────────────────
    const isPasswordTooShort = password.length > 0 && password.length < 8;
    const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    const isSubmitDisabled =
        !password ||
        password.length < 8 ||
        password !== confirmPassword ||
        loading;

    // ── Submit handler ──────────────────────────────────────────────────────────
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) return;

        setPasswordMutation.mutate(
            { token, new_password: password },
            {
                onSuccess: () => {
                    setSuccess(true);
                    setSnackbarOpen(true);
                    setPassword("");
                    setConfirmPassword("");
                    setTimeout(() => {
                        navigate("/login", { replace: true });
                    }, 1500);
                },
            }
        );
    };

    // ── Render Error if no token ───────────────────────────────────────────────
    if (!token) {
        return (
            <Box className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <Alert severity="error" variant="filled" sx={{ width: "100%", maxWidth: 420 }}>
                    Invalid or missing token.
                </Alert>
            </Box>
        );
    }

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
                    <Box className="flex flex-col items-center gap-2">
                        <Typography variant="h5" component="h1" fontWeight={600} textAlign="center">
                            Set Your Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            Create a secure password to activate your account
                        </Typography>
                    </Box>

                    {/* ── Feedback Alerts ────────────────────────────────────────── */}
                    {success && (
                        <Alert severity="success" sx={{ width: "100%" }}>
                            Password set successfully! Redirecting to login...
                        </Alert>
                    )}

                    {setPasswordMutation.isError && (
                        <Alert severity="error" sx={{ width: "100%" }}>
                            {getErrorMessage(error)}
                        </Alert>
                    )}

                    {/* ── Form ──────────────────────────────────────────────────── */}
                    {!success && (
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            className="flex w-full flex-col gap-5"
                            noValidate
                        >
                            <TextField
                                id="new-password"
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                                autoFocus
                                autoComplete="new-password"
                                error={isPasswordTooShort}
                                helperText={isPasswordTooShort ? "Password must be at least 8 characters" : ""}
                                disabled={loading}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    aria-label="toggle password visibility"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <TextField
                                id="confirm-password"
                                label="Confirm Password"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                fullWidth
                                autoComplete="new-password"
                                error={isPasswordMismatch}
                                helperText={isPasswordMismatch ? "Passwords do not match" : ""}
                                disabled={loading}
                            />

                            <Button
                                id="set-password-submit"
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isSubmitDisabled}
                                sx={{
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    "Activate Account"
                                )}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={1500}
                onClose={() => setSnackbarOpen(false)}
                message="Password set successfully."
            />
        </Box>
    );
};

export default SetPasswordPage;

import { useState, useEffect } from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
    createSeat,
    updateSeat,
    type Seat,
    type CreateSeatPayload,
    type UpdateSeatPayload,
} from "../../api/admin.seat.api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SeatFormDialogProps {
    open: boolean;
    onClose: () => void;
    mode: "create" | "edit";
    /** Provide the full Seat row when mode === 'edit'. */
    initialData?: Seat;
}

// ─── Component ────────────────────────────────────────────────────────────────

const SeatFormDialog = ({
    open,
    onClose,
    mode,
    initialData,
}: SeatFormDialogProps) => {
    const queryClient = useQueryClient();

    // ── Local state ───────────────────────────────────────────────────────
    const [seatNumber, setSeatNumber] = useState(initialData?.seat_number ?? "");
    const [error, setError] = useState<string | null>(null);

    // ── Snackbar ──────────────────────────────────────────────────────────
    const [snack, setSnack] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    const showSnack = (message: string, severity: "success" | "error") =>
        setSnack({ open: true, message, severity });

    // ── Reset form whenever the dialog opens ──────────────────────────────
    useEffect(() => {
        if (open) {
            setSeatNumber(initialData?.seat_number ?? "");
            setError(null);
        }
    }, [open, initialData]);

    // ── Mutations ─────────────────────────────────────────────────────────

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: ["seats"] });

    const createMutation = useMutation({
        mutationFn: (payload: CreateSeatPayload) => createSeat(payload),
        onSuccess: () => {
            invalidate();
            showSnack("Seat created successfully.", "success");
            onClose();
        },
        onError: (err: AxiosError<{ detail?: string }>) => {
            const detail = err.response?.data?.detail ?? "Failed to create seat.";
            showSnack(detail, "error");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateSeatPayload;
        }) => updateSeat(id, payload),
        onSuccess: () => {
            invalidate();
            showSnack("Seat updated successfully.", "success");
            onClose();
        },
        onError: (err: AxiosError<{ detail?: string }>) => {
            const detail = err.response?.data?.detail ?? "Failed to update seat.";
            showSnack(detail, "error");
        },
    });

    const isPending = createMutation.isPending || updateMutation.isPending;

    // ── Submit ────────────────────────────────────────────────────────────

    const handleSubmit = () => {
        const trimmed = seatNumber.trim().toUpperCase();

        if (!trimmed) {
            setError("Seat number is required.");
            return;
        }

        if (mode === "create") {
            createMutation.mutate({ seat_number: trimmed });
        } else {
            if (!initialData?.id) return;
            updateMutation.mutate({
                id: initialData.id,
                payload: { seat_number: trimmed },
            });
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    return (
        <>
            <Dialog
                open={open}
                onClose={isPending ? undefined : onClose}
                fullWidth
                maxWidth="xs"
                disableEscapeKeyDown={isPending}
            >
                {/* ── Title ── */}
                <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
                    {mode === "create" ? "Create Seat" : "Edit Seat"}
                </DialogTitle>

                {/* ── Fields ── */}
                <DialogContent>
                    <Box className="flex flex-col gap-4 pt-2">
                        <Typography variant="body2" color="text.secondary">
                            Enter a unique identifier for this seat (e.g., WS-01).
                        </Typography>
                        <TextField
                            id="seat-number-field"
                            label="Seat Number"
                            size="small"
                            fullWidth
                            required
                            autoFocus
                            value={seatNumber}
                            onChange={(e) => {
                                setSeatNumber(e.target.value);
                                if (error) setError(null);
                            }}
                            error={!!error}
                            helperText={error}
                            disabled={isPending}
                            placeholder="e.g. WS-01"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !isPending) {
                                    handleSubmit();
                                }
                            }}
                        />
                    </Box>
                </DialogContent>

                {/* ── Actions ── */}
                <DialogActions className="px-6 pb-4">
                    <Button
                        onClick={onClose}
                        disabled={isPending}
                        sx={{ textTransform: "none" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        id="seat-form-submit"
                        variant="contained"
                        disableElevation
                        disabled={isPending}
                        onClick={handleSubmit}
                        sx={{ textTransform: "none", fontWeight: 600, minWidth: 100 }}
                    >
                        {isPending
                            ? mode === "create"
                                ? "Creating…"
                                : "Saving…"
                            : mode === "create"
                                ? "Create"
                                : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Snackbar ── */}
            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={() => setSnack((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity={snack.severity}
                    variant="filled"
                    onClose={() => setSnack((s) => ({ ...s, open: false }))}
                    sx={{ width: "100%" }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default SeatFormDialog;

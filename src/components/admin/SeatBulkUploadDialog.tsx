import { useState, useRef, useEffect } from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Snackbar,
    Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
    bulkUploadSeats,
    type BulkUploadResponse,
} from "../../api/admin.seat.api";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const AUTO_CLOSE_MS = 1500;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SeatBulkUploadDialogProps {
    open: boolean;
    onClose: () => void;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const validateFile = (file: File): string | null => {
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    // Type check — accept text/csv, application/vnd.ms-excel, or .csv extension
    const isCsvType = type.includes("csv") || type === "application/vnd.ms-excel";
    const isCsvExt = name.endsWith(".csv");

    if (!isCsvType && !isCsvExt) {
        return "Only CSV files are allowed.";
    }

    if (file.size > MAX_FILE_SIZE) {
        return `File size must be under 5 MB. Selected file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`;
    }

    return null; // valid
};

// ─── Component ────────────────────────────────────────────────────────────────

const SeatBulkUploadDialog = ({ open, onClose }: SeatBulkUploadDialogProps) => {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [result, setResult] = useState<BulkUploadResponse | null>(null);

    // ── Snackbar ──────────────────────────────────────────────────────
    const [snack, setSnack] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    const showSnack = (message: string, severity: "success" | "error") =>
        setSnack({ open: true, message, severity });

    // ── Cleanup auto-close timer on unmount ───────────────────────────
    useEffect(() => {
        return () => {
            if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
        };
    }, []);

    // ── Reset state when dialog opens ─────────────────────────────────
    useEffect(() => {
        if (open) {
            setSelectedFile(null);
            setFileError(null);
            setResult(null);
        }
    }, [open]);

    const handleClose = () => {
        if (uploadMutation.isPending) return;
        if (autoCloseTimer.current) {
            clearTimeout(autoCloseTimer.current);
            autoCloseTimer.current = null;
        }
        setSelectedFile(null);
        setFileError(null);
        setResult(null);
        onClose();
    };

    // ── File selection ────────────────────────────────────────────────
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        e.target.value = ""; // allow re-selecting same file

        if (!file) return;

        const error = validateFile(file);
        if (error) {
            setFileError(error);
            setSelectedFile(null);
            return;
        }

        setFileError(null);
        setSelectedFile(file);
        setResult(null);
    };

    // ── Upload mutation ───────────────────────────────────────────────
    const uploadMutation = useMutation({
        mutationFn: (file: File) => bulkUploadSeats(file),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["seats"] });
            setResult(data);

            // Build snackbar message
            const parts: string[] = [];
            if (data.successful_creations > 0) {
                parts.push(`${data.successful_creations} seat${data.successful_creations === 1 ? "" : "s"} created`);
            }
            if (data.failed_rows > 0) {
                parts.push(`${data.failed_rows} failed`);
            }
            if (data.skipped_rows > 0) {
                parts.push(`${data.skipped_rows} skipped`);
            }

            const message = parts.length > 0
                ? `${parts.join(", ")}.`
                : "Upload completed — no rows processed.";

            showSnack(message, data.failed_rows > 0 ? "error" : "success");

            // Auto-close after 1.5 s
            autoCloseTimer.current = setTimeout(() => {
                handleClose();
            }, AUTO_CLOSE_MS);
        },
        onError: (err: AxiosError<{ detail?: string }>) => {
            const detail =
                err.response?.data?.detail ?? "Failed to upload CSV.";
            showSnack(detail, "error");
        },
    });

    const handleUpload = () => {
        if (!selectedFile) return;

        // Re-validate before calling API
        const error = validateFile(selectedFile);
        if (error) {
            setFileError(error);
            return;
        }

        uploadMutation.mutate(selectedFile);
    };

    // ─────────────────────────────────────────────────────────────────
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                disableEscapeKeyDown={uploadMutation.isPending}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Bulk Upload Seats
                </DialogTitle>

                <DialogContent>
                    <Box className="flex flex-col gap-4 pt-1">
                        {/* Instructions */}
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Upload a CSV file with only <strong>seat_number</strong> column.
                            </Typography>
                            <Box
                                sx={{
                                    mt: 1,
                                    p: 1.5,
                                    bgcolor: "grey.50",
                                    borderRadius: 1,
                                    border: "1px dashed",
                                    borderColor: "divider",
                                    fontFamily: "monospace",
                                    fontSize: "0.75rem",
                                }}
                            >
                                <div style={{ color: "#666" }}>seat_number</div>
                                <div>S-101</div>
                                <div>S-102</div>
                                <div>S-103</div>
                            </Box>
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                            Max file size: 5 MB · Accepted format: .csv
                        </Typography>

                        {/* File picker area */}
                        <Box
                            onClick={() =>
                                !uploadMutation.isPending &&
                                fileInputRef.current?.click()
                            }
                            sx={{
                                border: "2px dashed",
                                borderColor: fileError
                                    ? "error.main"
                                    : "divider",
                                borderRadius: 2,
                                p: 3,
                                textAlign: "center",
                                cursor: uploadMutation.isPending
                                    ? "default"
                                    : "pointer",
                                "&:hover": uploadMutation.isPending
                                    ? {}
                                    : {
                                        borderColor: "primary.main",
                                        bgcolor: "action.hover",
                                    },
                            }}
                        >
                            {selectedFile ? (
                                <Box className="flex flex-col items-center gap-1">
                                    <InsertDriveFileIcon
                                        sx={{ fontSize: 36, color: "primary.main" }}
                                    />
                                    <Typography variant="body2" fontWeight={500}>
                                        {selectedFile.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {(selectedFile.size / 1024).toFixed(1)}{" "}
                                        KB — Click to change
                                    </Typography>
                                </Box>
                            ) : (
                                <Box className="flex flex-col items-center gap-1">
                                    <UploadFileIcon
                                        sx={{
                                            fontSize: 36,
                                            color: fileError
                                                ? "error.main"
                                                : "text.secondary",
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        color={
                                            fileError
                                                ? "error.main"
                                                : "text.secondary"
                                        }
                                    >
                                        Click to select a CSV file
                                    </Typography>
                                </Box>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Box>

                        {/* File validation error */}
                        {fileError && (
                            <Typography
                                variant="body2"
                                color="error.main"
                                sx={{ mt: -1 }}
                            >
                                {fileError}
                            </Typography>
                        )}

                        {/* Progress bar */}
                        {uploadMutation.isPending && (
                            <LinearProgress sx={{ borderRadius: 1 }} />
                        )}

                        {/* Result summary */}
                        {result && (
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: "grey.50",
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    className="mb-2"
                                >
                                    Upload Summary
                                </Typography>

                                <Box className="grid grid-cols-2 gap-y-1">
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Total rows
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {result.total_rows}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Created
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                        color="success.main"
                                    >
                                        {result.successful_creations}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Skipped (duplicates)
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                        color="warning.main"
                                    >
                                        {result.skipped_rows}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Failed
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                        color="error.main"
                                    >
                                        {result.failed_rows}
                                    </Typography>
                                </Box>

                                {result.failed_rows > 0 && (
                                    <Alert
                                        severity="warning"
                                        variant="outlined"
                                        sx={{ mt: 2 }}
                                    >
                                        {result.failed_rows} row
                                        {result.failed_rows > 1 ? "s" : ""}{" "}
                                        failed to import. Check the CSV and
                                        re-upload the failed rows.
                                    </Alert>
                                )}
                            </Box>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions className="px-6 pb-4">
                    <Button
                        onClick={handleClose}
                        disabled={uploadMutation.isPending}
                        sx={{ textTransform: "none" }}
                    >
                        {result ? "Close" : "Cancel"}
                    </Button>

                    {!result && (
                        <Button
                            id="seat-bulk-upload-submit"
                            variant="contained"
                            disableElevation
                            disabled={
                                !selectedFile || uploadMutation.isPending
                            }
                            onClick={handleUpload}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                minWidth: 100,
                            }}
                        >
                            {uploadMutation.isPending
                                ? "Uploading…"
                                : "Upload"}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* ── Snackbar ── */}
            <Snackbar
                open={snack.open}
                autoHideDuration={5000}
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

export default SeatBulkUploadDialog;

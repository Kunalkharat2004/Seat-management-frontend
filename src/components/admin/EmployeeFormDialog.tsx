import { useState, useEffect } from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
    createEmployee,
    updateEmployee,
    type Employee,
    type CreateEmployeePayload,
    type UpdateEmployeePayload,
} from "../../api/admin.employee.api";
import { employeeKeys } from "../../hooks/useEmployees";

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLES = ["admin", "employee"] as const;
const STATUSES = ["active", "inactive"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmployeeFormDialogProps {
    open: boolean;
    onClose: () => void;
    mode: "create" | "edit";
    /** Provide the full Employee row when mode === 'edit'. */
    initialData?: Employee;
}

// ─── Internal form shape ──────────────────────────────────────────────────────

interface FormValues {
    employee_id: string;
    name: string;
    email: string;
    role: string;
    status: string;
}

interface FormErrors {
    employee_id?: string;
    name?: string;
    email?: string;
    role?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const defaultValues = (initial?: Employee): FormValues => ({
    employee_id: initial?.employee_id ?? "",
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    role: initial?.role ?? "employee",
    status: initial?.status ?? "active",
});

const validate = (values: FormValues, mode: "create" | "edit"): FormErrors => {
    const errors: FormErrors = {};

    if (mode === "create" && !values.employee_id.trim()) {
        errors.employee_id = "Employee ID is required.";
    }

    if (!values.name.trim()) {
        errors.name = "Full name is required.";
    }

    if (!values.email.trim()) {
        errors.email = "Email is required.";
    } else if (!EMAIL_RE.test(values.email.trim())) {
        errors.email = "Enter a valid email address.";
    }

    if (!values.role) {
        errors.role = "Role is required.";
    }

    return errors;
};

const hasErrors = (errors: FormErrors) => Object.keys(errors).length > 0;

// ─── Component ────────────────────────────────────────────────────────────────

const EmployeeFormDialog = ({
    open,
    onClose,
    mode,
    initialData,
}: EmployeeFormDialogProps) => {
    const queryClient = useQueryClient();

    // ── Local state ───────────────────────────────────────────────────────
    const [values, setValues] = useState<FormValues>(defaultValues(initialData));
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Partial<Record<keyof FormErrors, boolean>>>({});

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
            setValues(defaultValues(initialData));
            setErrors({});
            setTouched({});
        }
    }, [open, initialData]);

    // ── Mutations ─────────────────────────────────────────────────────────

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: employeeKeys.all });

    const createMutation = useMutation({
        mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
        onSuccess: () => {
            invalidate();
            showSnack("Employee created successfully.", "success");
            onClose();
        },
        onError: (err: AxiosError<{ detail?: string }>) => {
            const detail =
                err.response?.data?.detail ?? "Failed to create employee.";
            showSnack(detail, "error");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateEmployeePayload;
        }) => updateEmployee(id, payload),
        onSuccess: () => {
            invalidate();
            showSnack("Employee updated successfully.", "success");
            onClose();
        },
        onError: (err: AxiosError<{ detail?: string }>) => {
            const detail =
                err.response?.data?.detail ?? "Failed to update employee.";
            showSnack(detail, "error");
        },
    });

    const isPending = createMutation.isPending || updateMutation.isPending;

    // ── Field change helpers ──────────────────────────────────────────────

    const handleTextChange =
        (field: keyof FormValues) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const next = { ...values, [field]: e.target.value };
                setValues(next);
                // Re-validate the changed field only if already touched
                if (touched[field as keyof FormErrors]) {
                    setErrors(validate(next, mode));
                }
            };

    const handleSelectChange =
        (field: keyof FormValues) => (e: SelectChangeEvent<string>) => {
            const next = { ...values, [field]: e.target.value };
            setValues(next);
            if (touched[field as keyof FormErrors]) {
                setErrors(validate(next, mode));
            }
        };

    const handleBlur = (field: keyof FormErrors) => () => {
        setTouched((t) => ({ ...t, [field]: true }));
        setErrors(validate(values, mode));
    };

    // ── Submit ────────────────────────────────────────────────────────────

    const handleSubmit = () => {
        // Mark everything touched so all errors show
        const allTouched: Partial<Record<keyof FormErrors, boolean>> = {
            employee_id: true,
            name: true,
            email: true,
            role: true,
        };
        setTouched(allTouched);

        const validationErrors = validate(values, mode);
        setErrors(validationErrors);

        if (hasErrors(validationErrors)) return;

        if (mode === "create") {
            createMutation.mutate({
                employee_id: values.employee_id.trim(),
                name: values.name.trim(),
                email: values.email.trim(),
                role: values.role,
            });
        } else {
            if (!initialData?.id) return;
            updateMutation.mutate({
                id: initialData.id,
                payload: {
                    name: values.name.trim(),
                    email: values.email.trim(),
                    role: values.role,
                    status: values.status,
                },
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
                maxWidth="sm"
                // Prevent accidental close while submitting
                disableEscapeKeyDown={isPending}
            >
                {/* ── Title ── */}
                <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
                    {mode === "create" ? "Create Employee" : "Edit Employee"}
                    {mode === "edit" && initialData && (
                        <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                        >
                            — {initialData.employee_id}
                        </Typography>
                    )}
                </DialogTitle>

                {/* ── Fields ── */}
                <DialogContent>
                    <Box className="flex flex-col gap-4 pt-2">

                        {/* Employee ID — create only */}
                        {mode === "create" && (
                            <TextField
                                id="form-employee-id"
                                label="Employee ID"
                                size="small"
                                fullWidth
                                required
                                value={values.employee_id}
                                onChange={handleTextChange("employee_id")}
                                onBlur={handleBlur("employee_id")}
                                error={!!errors.employee_id}
                                helperText={errors.employee_id}
                                disabled={isPending}
                            />
                        )}

                        {/* Full Name */}
                        <TextField
                            id="form-name"
                            label="Full Name"
                            size="small"
                            fullWidth
                            required
                            value={values.name}
                            onChange={handleTextChange("name")}
                            onBlur={handleBlur("name")}
                            error={!!errors.name}
                            helperText={errors.name}
                            disabled={isPending}
                        />

                        {/* Email */}
                        <TextField
                            id="form-email"
                            label="Email"
                            type="email"
                            size="small"
                            fullWidth
                            required
                            value={values.email}
                            onChange={handleTextChange("email")}
                            onBlur={handleBlur("email")}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={isPending}
                        />

                        {/* Role */}
                        <FormControl
                            size="small"
                            fullWidth
                            required
                            error={!!errors.role}
                            disabled={isPending}
                        >
                            <InputLabel id="form-role-label">Role</InputLabel>
                            <Select
                                labelId="form-role-label"
                                id="form-role"
                                label="Role"
                                value={values.role}
                                onChange={handleSelectChange("role")}
                                onBlur={handleBlur("role")}
                            >
                                {ROLES.map((r) => (
                                    <MenuItem
                                        key={r}
                                        value={r}
                                        sx={{ textTransform: "capitalize" }}
                                    >
                                        {r}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.role && (
                                <FormHelperText>{errors.role}</FormHelperText>
                            )}
                        </FormControl>

                        {/* Status — edit mode only */}
                        {mode === "edit" && (
                            <FormControl
                                size="small"
                                fullWidth
                                disabled={isPending}
                            >
                                <InputLabel id="form-status-label">
                                    Status
                                </InputLabel>
                                <Select
                                    labelId="form-status-label"
                                    id="form-status"
                                    label="Status"
                                    value={values.status}
                                    onChange={handleSelectChange("status")}
                                >
                                    {STATUSES.map((s) => (
                                        <MenuItem
                                            key={s}
                                            value={s}
                                            sx={{ textTransform: "capitalize" }}
                                        >
                                            {s}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
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
                        id="employee-form-submit"
                        variant="contained"
                        disableElevation
                        disabled={isPending}
                        onClick={handleSubmit}
                        sx={{ textTransform: "none", fontWeight: 600, minWidth: 120 }}
                    >
                        {isPending
                            ? mode === "create"
                                ? "Creating…"
                                : "Saving…"
                            : mode === "create"
                                ? "Create"
                                : "Save Changes"}
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

export default EmployeeFormDialog;

import { useState, useCallback } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    OutlinedInput,
    Select,
    Tooltip,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EditIcon from "@mui/icons-material/Edit";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useEmployees, employeeKeys } from "../../hooks/useEmployees";
import {
    deleteEmployee,
    updateEmployee,
    type Employee,
} from "../../api/admin.employee.api";
import EmployeeFormDialog from "../../components/admin/EmployeeFormDialog";
import BulkUploadDialog from "../../components/admin/BulkUploadDialog";

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLES = ["admin", "employee"] as const;
const STATUSES = ["active", "inactive"] as const;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// ─── Chip helpers ─────────────────────────────────────────────────────────────

const roleColor = (role: string) =>
    role === "admin" ? "primary" : "default";

const statusColor = (status: string): "success" | "error" | "default" =>
    status === "active" ? "success" : status === "inactive" ? "error" : "default";

// ─── Component ───────────────────────────────────────────────────────────────

const EmployeesPage = () => {
    const queryClient = useQueryClient();

    // ── Pagination ────────────────────────────────────────────────────────
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });

    // ── Filter state ──────────────────────────────────────────────────────
    // searchInput drives the <input> immediately (no lag).
    // debouncedSearch feeds the query key — refetch fires after 300 ms silence.
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 300);

    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // ── Form dialog state (create / edit) ─────────────────────────────────
    const [formDialog, setFormDialog] = useState<{
        open: boolean;
        mode: "create" | "edit";
        employee?: Employee;
    }>({ open: false, mode: "create" });

    // ── Add-employee menu anchor ──────────────────────────────────────────
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const menuOpen = Boolean(menuAnchor);

    // ── Bulk upload dialog ────────────────────────────────────────────────
    const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

    // ── Per-row loading tracker ───────────────────────────────────────────
    // Stores the ID of the row currently being toggled so only that row's
    // button shows a spinner while the mutation is in-flight.
    const [togglingId, setTogglingId] = useState<string | null>(null);

    // ── Query params ──────────────────────────────────────────────────────
    const queryParams = {
        page: paginationModel.page + 1, // DataGrid is 0-indexed, backend is 1-indexed
        page_size: paginationModel.pageSize,
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
    };

    const { data, isFetching } = useEmployees(queryParams);

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: employeeKeys.all });

    // ── Deactivate mutation — DELETE /admin/employees/:id (soft-delete) ───
    const deactivateMutation = useMutation({
        mutationFn: (id: string) => deleteEmployee(id),
        onSuccess: () => {
            invalidate();
            setTogglingId(null);
        },
        onError: () => setTogglingId(null),
    });

    // ── Activate mutation — PATCH /admin/employees/:id { status: "active" }
    const activateMutation = useMutation({
        mutationFn: (id: string) => updateEmployee(id, { status: "active" }),
        onSuccess: () => {
            invalidate();
            setTogglingId(null);
        },
        onError: () => setTogglingId(null),
    });

    // ── Action handlers ───────────────────────────────────────────────────

    const handleOpenCreate = () => {
        setMenuAnchor(null);
        setFormDialog({ open: true, mode: "create", employee: undefined });
    };

    const handleOpenBulkUpload = () => {
        setMenuAnchor(null);
        setBulkUploadOpen(true);
    };
    const handleOpenEdit = useCallback(
        (emp: Employee) =>
            setFormDialog({ open: true, mode: "edit", employee: emp }),
        [],
    );

    const handleCloseForm = () =>
        setFormDialog((d) => ({ ...d, open: false }));

    /** Called directly from the row action button — no confirm dialog. */
    const handleToggleStatus = useCallback((emp: Employee) => {
        setTogglingId(emp.id);
        if (emp.status === "active") {
            deactivateMutation.mutate(emp.id);
        } else {
            activateMutation.mutate(emp.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── DataGrid columns ──────────────────────────────────────────────────

    const columns: GridColDef<Employee>[] = [
        {
            field: "employee_id",
            headerName: "Employee ID",
            width: 140,
            sortable: false,
        },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            minWidth: 160,
            sortable: false,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            minWidth: 200,
            sortable: false,
        },
        {
            field: "role",
            headerName: "Role",
            width: 120,
            sortable: false,
            renderCell: ({ value }) => (
                <Chip
                    label={value}
                    color={roleColor(value)}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "capitalize", fontWeight: 500 }}
                />
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            sortable: false,
            renderCell: ({ value }) => (
                <Chip
                    label={value}
                    color={statusColor(value)}
                    size="small"
                    sx={{ textTransform: "capitalize", fontWeight: 500 }}
                />
            ),
        },
        {
            field: "created_at",
            headerName: "Created At",
            width: 180,
            sortable: false,
            valueFormatter: (value: string) =>
                value
                    ? new Date(value).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })
                    : "—",
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 140,
            sortable: false,
            filterable: false,
            align: "center",
            headerAlign: "center",
            renderCell: ({ row }) => {
                const isToggling = togglingId === row.id;
                const isActive = row.status === "active";

                return (
                    <Box className="flex items-center gap-1">
                        {/* Edit */}
                        <Tooltip title="Edit">
                            <IconButton
                                size="small"
                                onClick={() => handleOpenEdit(row)}
                                disabled={isToggling}
                                aria-label={`edit-${row.employee_id}`}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {/* Deactivate / Activate */}
                        <Tooltip title={isActive ? "Deactivate" : "Activate"}>
                            {/* Span lets Tooltip work even when the button is disabled */}
                            <span>
                                <IconButton
                                    size="small"
                                    color={isActive ? "error" : "success"}
                                    onClick={() => handleToggleStatus(row)}
                                    disabled={isToggling}
                                    aria-label={
                                        isActive
                                            ? `deactivate-${row.employee_id}`
                                            : `activate-${row.employee_id}`
                                    }
                                >
                                    {isToggling ? (
                                        <CircularProgress
                                            size={16}
                                            color={isActive ? "error" : "success"}
                                        />
                                    ) : isActive ? (
                                        <PersonOffIcon fontSize="small" />
                                    ) : (
                                        <PersonIcon fontSize="small" />
                                    )}
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                );
            },
        },
    ];

    // ─────────────────────────────────────────────────────────────────────
    return (
        <Box className="flex flex-col gap-5">
            {/* ── Page title ── */}
            <Typography variant="h5" fontWeight={600}>
                Employees
            </Typography>

            {/* ── Action bar ── */}
            <Box className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <OutlinedInput
                    id="employee-search"
                    size="small"
                    placeholder="Search name or email…"
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                        setPaginationModel((m) => ({ ...m, page: 0 }));
                    }}
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    }
                    sx={{ width: 240, bgcolor: "background.paper" }}
                />

                {/* Role filter */}
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel id="role-filter-label">Role</InputLabel>
                    <Select
                        labelId="role-filter-label"
                        id="role-filter"
                        label="Role"
                        value={roleFilter}
                        onChange={(e: SelectChangeEvent) => {
                            setRoleFilter(e.target.value);
                            setPaginationModel((m) => ({ ...m, page: 0 }));
                        }}
                        sx={{ bgcolor: "background.paper" }}
                    >
                        <MenuItem value="">All roles</MenuItem>
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
                </FormControl>

                {/* Status filter */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                        labelId="status-filter-label"
                        id="status-filter"
                        label="Status"
                        value={statusFilter}
                        onChange={(e: SelectChangeEvent) => {
                            setStatusFilter(e.target.value);
                            setPaginationModel((m) => ({ ...m, page: 0 }));
                        }}
                        sx={{ bgcolor: "background.paper" }}
                    >
                        <MenuItem value="">All statuses</MenuItem>
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

                {/* Spacer */}
                <Box className="flex-1" />

                {/* Add Employee dropdown */}
                <Button
                    id="add-employee-menu-btn"
                    variant="contained"
                    startIcon={<AddIcon />}
                    endIcon={<ArrowDropDownIcon />}
                    onClick={(e) => setMenuAnchor(e.currentTarget)}
                    disableElevation
                    sx={{ textTransform: "none", fontWeight: 600 }}
                >
                    Add Employee
                </Button>

                <Menu
                    anchorEl={menuAnchor}
                    open={menuOpen}
                    onClose={() => setMenuAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    slotProps={{
                        paper: {
                            sx: { minWidth: 200, mt: 0.5 },
                        },
                    }}
                >
                    <MenuItem onClick={handleOpenCreate}>
                        <ListItemIcon>
                            <PersonAddIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Add Single Employee</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={handleOpenBulkUpload}>
                        <ListItemIcon>
                            <UploadFileIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Upload CSV</ListItemText>
                    </MenuItem>
                </Menu>
            </Box>

            {/* ── DataGrid ── */}
            <Box
                sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                    bgcolor: "background.paper",
                }}
            >
                <DataGrid
                    rows={data?.items ?? []}
                    columns={columns}
                    rowCount={data?.total ?? 0}
                    loading={isFetching}
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    autoHeight
                    sx={{
                        border: "none",
                        "& .MuiDataGrid-columnHeaders": {
                            bgcolor: "grey.50",
                            fontWeight: 700,
                        },
                        "& .MuiDataGrid-row:hover": {
                            bgcolor: "action.hover",
                        },
                        "& .MuiDataGrid-cell": {
                            alignItems: "center",
                            display: "flex",
                        },
                    }}
                />
            </Box>

            {/* ════════════════════════════════════════════════════════════
                EMPLOYEE FORM DIALOG  (create / edit)
                Owns its own mutations, validation, and snackbar feedback.
            ════════════════════════════════════════════════════════════ */}
            <EmployeeFormDialog
                open={formDialog.open}
                onClose={handleCloseForm}
                mode={formDialog.mode}
                initialData={formDialog.employee}
            />

            {/* ════════════════════════════════════════════════════════════
                BULK UPLOAD DIALOG
            ════════════════════════════════════════════════════════════ */}
            <BulkUploadDialog
                open={bulkUploadOpen}
                onClose={() => setBulkUploadOpen(false)}
            />
        </Box>
    );
};

export default EmployeesPage;

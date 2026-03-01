import { useState, useCallback } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    OutlinedInput,
    Snackbar,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useSeats } from "../../hooks/useSeats";
import { useDebounce } from "../../hooks/useDebounce";
import { deleteSeat, type Seat } from "../../api/admin.seat.api";
import SeatFormDialog from "../../components/admin/SeatFormDialog";
import DeleteConfirmDialog from "../../components/admin/DeleteConfirmDialog";
import SeatBulkUploadDialog from "../../components/admin/SeatBulkUploadDialog";

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// ─── Component ───────────────────────────────────────────────────────────────

const SeatsPage = () => {
    const queryClient = useQueryClient();

    // ── Pagination & Search State ─────────────────────────────────────────
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });

    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 300);

    // ── Dialog State ──────────────────────────────────────────────────────
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState<Seat | undefined>(undefined);
    const [mode, setMode] = useState<"create" | "edit">("create");

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [seatToDelete, setSeatToDelete] = useState<Seat | null>(null);

    const [isBulkOpen, setIsBulkOpen] = useState(false);

    // ── Menu State ────────────────────────────────────────────────────────
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(menuAnchor);

    // ── Feedback State ────────────────────────────────────────────────────
    const [snack, setSnack] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    const [deletingId, setDeletingId] = useState<string | null>(null);

    // ── Hooks ─────────────────────────────────────────────────────────────
    const { data, isFetching, isError } = useSeats({
        page: paginationModel.page + 1, // DataGrid is 0-indexed, Backend is 1-indexed
        page_size: paginationModel.pageSize,
        search: debouncedSearch || undefined,
    });

    const showSnack = (message: string, severity: "success" | "error") =>
        setSnack({ open: true, message, severity });

    // ── Mutations ──────────────────────────────────────────────────────────

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteSeat(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["seats"] });
            showSnack("Seat deleted successfully.", "success");
            setIsDeleteOpen(false);
            setSeatToDelete(null);
            setDeletingId(null);
        },
        onError: (err: AxiosError<{ detail?: string }>) => {
            const detail = err.response?.data?.detail ?? "Failed to delete seat.";
            showSnack(detail, "error");
            setDeletingId(null);
        },
    });

    // ── Handlers ───────────────────────────────────────────────────────────

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleOpenCreate = () => {
        setMode("create");
        setSelectedSeat(undefined);
        setIsFormOpen(true);
        handleMenuClose();
    };

    const handleOpenBulk = () => {
        setIsBulkOpen(true);
        handleMenuClose();
    };

    const handleOpenEdit = useCallback((seat: Seat) => {
        setMode("edit");
        setSelectedSeat(seat);
        setIsFormOpen(true);
    }, []);

    const handleDeleteClick = useCallback((seat: Seat) => {
        setSeatToDelete(seat);
        setIsDeleteOpen(true);
    }, []);

    const handleConfirmDelete = () => {
        if (!seatToDelete) return;
        setDeletingId(seatToDelete.id);
        deleteMutation.mutate(seatToDelete.id);
    };

    // ── Columns ───────────────────────────────────────────────────────────
    const columns: GridColDef<Seat>[] = [
        {
            field: "seat_number",
            headerName: "Seat Number",
            flex: 1,
            minWidth: 150,
            sortable: false,
        },
        {
            field: "created_at",
            headerName: "Created At",
            width: 200,
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
            width: 120,
            sortable: false,
            filterable: false,
            align: "center",
            headerAlign: "center",
            renderCell: ({ row }) => {
                const isDeleting = deletingId === row.id;

                return (
                    <Box className="flex items-center gap-1">
                        <Tooltip title="Edit">
                            <IconButton
                                size="small"
                                onClick={() => handleOpenEdit(row)}
                                disabled={isDeleting}
                                aria-label={`edit-seat-${row.seat_number}`}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(row)}
                                disabled={isDeleting}
                                aria-label={`delete-seat-${row.seat_number}`}
                            >
                                {isDeleting ? (
                                    <CircularProgress size={16} color="error" />
                                ) : (
                                    <DeleteIcon fontSize="small" />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Box>
                );
            },
        },
    ];

    return (
        <Box className="flex flex-col gap-5">
            {/* ── Page Title & Action Bar ── */}
            <Box className="flex flex-wrap items-center justify-between gap-3">
                <Typography variant="h5" fontWeight={600}>
                    Seats
                </Typography>

                <Box className="flex items-center gap-3">
                    {/* Search Field */}
                    <OutlinedInput
                        size="small"
                        placeholder="Search seat number..."
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
                        sx={{ width: 280, bgcolor: "background.paper" }}
                    />

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        endIcon={<KeyboardArrowDownIcon />}
                        disableElevation
                        sx={{ textTransform: "none", fontWeight: 600 }}
                        onClick={handleMenuOpen}
                    >
                        Create Seat
                    </Button>
                    <Menu
                        anchorEl={menuAnchor}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem onClick={handleOpenCreate}>
                            Add Single Seat
                        </MenuItem>
                        <MenuItem onClick={handleOpenBulk}>
                            Upload CSV
                        </MenuItem>
                    </Menu>
                </Box>
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

            {isError && (
                <Typography color="error" variant="body2">
                    Failed to load seats. Please try again.
                </Typography>
            )}

            {/* ── Dialogs & Feedback ── */}
            <SeatFormDialog
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                mode={mode}
                initialData={selectedSeat}
            />

            <SeatBulkUploadDialog
                open={isBulkOpen}
                onClose={() => setIsBulkOpen(false)}
            />

            <DeleteConfirmDialog
                open={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Seat"
                description={`Are you sure you want to delete seat ${seatToDelete?.seat_number}? This action cannot be undone.`}
                loading={deleteMutation.isPending}
            />

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
        </Box>
    );
};

export default SeatsPage;



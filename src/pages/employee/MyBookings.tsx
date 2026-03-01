import { useState } from 'react';
import { 
    Box, 
    Typography, 
    Chip, 
    Button, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    TextField, 
    Paper,
    Stack
} from '@mui/material';
import { 
    DataGrid, 
    GridActionsCellItem,
} from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import CancelIcon from '@mui/icons-material/Cancel';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useMyBookings } from '../../hooks/useMyBookings';
import { useCancelBooking } from '../../hooks/useCancelBooking';
import { useCheckInBooking } from '../../hooks/useCheckInBooking';

const MyBookings = () => {
    // ─── State for Filtering & Pagination ───────────────────────────────────
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('');

    const todayDate = new Date().toISOString().split('T')[0];

    // ─── Queries & Mutations ────────────────────────────────────────────────
    const { data: bookingData, isLoading, isFetching } = useMyBookings({
        page,
        page_size: pageSize,
        status: statusFilter || undefined,
        date: dateFilter || undefined,
    });

    const cancelMutation = useCancelBooking();
    const checkInMutation = useCheckInBooking();

    // ─── Columns Definition ──────────────────────────────────────────────────
    const columns: GridColDef[] = [
        { 
            field: 'booking_date', 
            headerName: 'Booking Date', 
            flex: 1,
            minWidth: 150 
        },
        { 
            field: 'seat_number', 
            headerName: 'Seat #', 
            flex: 1,
            minWidth: 120 
        },
        { 
            field: 'status', 
            headerName: 'Status', 
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                const status = params.value as string;
                let color: 'primary' | 'success' | 'error' | 'default' = 'default';
                
                if (status === 'confirmed') color = 'primary';
                if (status === 'checked_in') color = 'success';
                if (status === 'cancelled' || status === 'expired') color = 'error';

                return (
                    <Chip 
                        label={status.toUpperCase()} 
                        color={color} 
                        size="small" 
                        variant="outlined" 
                    />
                );
            }
        },
        { 
            field: 'check_in_time', 
            headerName: 'Check-in Time', 
            flex: 1,
            minWidth: 200,
            valueFormatter: (value) => value ? new Date(value as string).toLocaleString() : '-'
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            flex: 1,
            minWidth: 200,
            getActions: (params) => {
                const booking = params.row;
                const canCancel = booking.status === 'confirmed';
                const canCheckIn = booking.status === 'confirmed' && booking.booking_date === todayDate;

                const actions = [];

                if (canCheckIn) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<HowToRegIcon sx={{ color: 'success.main' }} />}
                            label="Check-in"
                            onClick={() => checkInMutation.mutate(booking.id)}
                        />
                    );
                }

                if (canCancel) {
                    actions.push(
                        <GridActionsCellItem
                            icon={<CancelIcon sx={{ color: 'error.main' }} />}
                            label="Cancel"
                            onClick={() => cancelMutation.mutate(booking.id)}
                        />
                    );
                }

                return actions;
            }
        }
    ];

    return (
        <Box sx={{ height: '100%', width: '100%', p: { xs: 2, md: 4 } }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                My Seat Bookings
            </Typography>

            {/* ─── Filters Row ─────────────────────────────────────────────────── */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Status Filter</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status Filter"
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1); // Reset to first page on filter change
                            }}
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="confirmed">Confirmed</MenuItem>
                            <MenuItem value="checked_in">Checked In</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="expired">Expired</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Date Filter"
                        type="date"
                        size="small"
                        value={dateFilter}
                        onChange={(e) => {
                            setDateFilter(e.target.value);
                            setPage(1);
                        }}
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 200 }}
                    />
                    
                    <Button 
                        variant="text" 
                        size="small" 
                        onClick={() => {
                            setStatusFilter('');
                            setDateFilter('');
                            setPage(1);
                        }}
                    >
                        Reset Filters
                    </Button>
                </Stack>
            </Paper>

            {/* ─── DataGrid ────────────────────────────────────────────────────── */}
            <Box sx={{ height: 'calc(100vh - 350px)', width: '100%' }}>
                <DataGrid
                    rows={bookingData?.items || []}
                    columns={columns}
                    paginationMode="server"
                    rowCount={bookingData?.total || 0}
                    loading={isLoading || isFetching}
                    paginationModel={{
                        page: page - 1,
                        pageSize: pageSize,
                    }}
                    onPaginationModelChange={(model) => {
                        setPage(model.page + 1);
                        setPageSize(model.pageSize);
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell:focus': { outline: 'none' },
                        backgroundColor: 'background.paper'
                    }}
                />
            </Box>
        </Box>
    );
};

export default MyBookings;

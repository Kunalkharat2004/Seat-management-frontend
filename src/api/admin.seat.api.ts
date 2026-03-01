import api from "./axios";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Seat {
    id: string;
    seat_number: string;
    created_at: string;
}

export interface PaginatedSeatResponse {
    items: Seat[];
    total: number;
    page: number;
    page_size: number;
}

export interface GetSeatsParams {
    page: number;
    page_size: number;
    search?: string;
}

export interface CreateSeatPayload {
    seat_number: string;
}

export interface UpdateSeatPayload {
    seat_number: string;
}

export interface BulkUploadResponse {
    total_rows: number;
    successful_creations: number;
    skipped_rows: number;
    failed_rows: number;
}

// ─── API Functions ───────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of seats.
 * GET /admin/seats
 */
export const getSeats = async (
    params: GetSeatsParams,
): Promise<PaginatedSeatResponse> => {
    const { data } = await api.get<PaginatedSeatResponse>("/admin/seats", {
        params,
    });
    return data;
};

/**
 * Create a new seat.
 * POST /admin/seats
 */
export const createSeat = async (payload: CreateSeatPayload): Promise<Seat> => {
    const { data } = await api.post<Seat>("/admin/seats", payload);
    return data;
};

/**
 * Update an existing seat.
 * PATCH /admin/seats/:id
 */
export const updateSeat = async (
    id: string,
    payload: UpdateSeatPayload,
): Promise<Seat> => {
    const { data } = await api.patch<Seat>(`/admin/seats/${id}`, payload);
    return data;
};

/**
 * Delete a seat.
 * DELETE /admin/seats/:id
 */
export const deleteSeat = async (
    id: string,
): Promise<{ message: string; seat_id: string }> => {
    const { data } = await api.delete<{ message: string; seat_id: string }>(
        `/admin/seats/${id}`,
    );
    return data;
};

/**
 * Bulk upload seats from a file.
 * POST /admin/seats/bulk-upload
 */
export const bulkUploadSeats = async (file: File): Promise<BulkUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<BulkUploadResponse>(
        "/admin/seats/bulk-upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );
    return data;
};

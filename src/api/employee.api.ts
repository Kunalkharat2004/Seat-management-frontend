import api from "./axios";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Seat {
    id: string;
    seat_number: string;
}

export interface SeatAvailability {
    seat_id: string;
    seat_number: string;
    status: "available" | "confirmed" | "checked_in";
}

export interface BookingResponse {
    message: string;
    booking_id: string;
    seat_id?: string;
    booking_date?: string;
    status: string;
    check_in_time?: string;
}

export interface CreateBookingPayload {
    seat_id: string;
    booking_date: string;
}

export interface MyBooking {
    id: string;
    seat_id: string;
    seat_number: string;
    booking_date: string;
    status: 'confirmed' | 'checked_in' | 'expired' | 'cancelled';
    check_in_time: string | null;
    created_at: string;
}

export interface PaginatedMyBookings {
    items: MyBooking[];
    total: number;
    page: number;
    page_size: number;
}

// ─── API Functions ───────────────────────────────────────────────────────────

// -----------------------------------
// SEATS
// -----------------------------------

/**
 * Fetch all available seats in the system.
 * GET /seats
 */
export const getAllSeats = async (): Promise<Seat[]> => {
    const { data } = await api.get<Seat[]>("/seats");
    return data;
};

/**
 * Fetch seat availability for a specific date.
 * GET /seats/availability?date=YYYY-MM-DD
 */
export const getSeatAvailability = async (
    date: string,
): Promise<SeatAvailability[]> => {
    const { data } = await api.get<SeatAvailability[]>("/seats/availability", {
        params: { date },
    });
    return data;
};

// -----------------------------------
// BOOKINGS
// -----------------------------------

/**
 * Fetch current user's bookings.
 * GET /bookings/me
 */
export const getMyBookings = async (params: {
    page: number;
    page_size: number;
    status?: string;
    date?: string;
}): Promise<PaginatedMyBookings> => {
    const { data } = await api.get<PaginatedMyBookings>("/bookings/me", {
        params,
    });
    return data;
};

/**
 * Create a new seat booking.
 * POST /bookings
 */
export const createBooking = async (
    data: CreateBookingPayload,
): Promise<BookingResponse> => {
    const { data: responseData } = await api.post<BookingResponse>(
        "/bookings",
        data,
    );
    return responseData;
};

/**
 * Cancel an existing booking.
 * POST /bookings/{booking_id}/cancel
 */
export const cancelBooking = async (
    booking_id: string,
): Promise<BookingResponse> => {
    const { data } = await api.post<BookingResponse>(
        `/bookings/${booking_id}/cancel`,
    );
    return data;
};

/**
 * Check-in to an existing booking.
 * POST /bookings/{booking_id}/check-in
 */
export const checkInBooking = async (
    booking_id: string,
): Promise<BookingResponse> => {
    const { data } = await api.post<BookingResponse>(
        `/bookings/${booking_id}/check-in`,
    );
    return data;
};

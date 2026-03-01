import api from "./axios";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DashboardMetrics {
    total_employees: number;
    active_employees: number;
    inactive_employees: number;
    total_seats: number;
    today_bookings: number;
    today_checked_in: number;
    today_confirmed: number;
}

// ─── API Functions ───────────────────────────────────────────────────────────

/**
 * Fetch dashboard metrics for administrators.
 * GET /admin/dashboard/metrics
 */
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
    const { data } = await api.get<DashboardMetrics>("/admin/dashboard/metrics");
    return data;
};

import { Route, Routes, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import AdminLayout from "../layouts/AdminLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import MyBookings from "../pages/employee/MyBookings";
import RequireAuth from "./RequireAuth";
import EmployeesPage from "../pages/admin/EmployeesPage";
import SeatsPage from "../pages/admin/SeatsPage";

// ─── App Routes ──────────────────────────────────────────────────────────────

const AppRoutes = () => {
    return (
        <Routes>
            {/* ── Public ──────────────────────────────────────────────────── */}
            <Route path="/login" element={<LoginPage />} />

            {/* ── Admin (protected) ───────────────────────────────────────── */}
            <Route
                path="/admin"
                element={
                    <RequireAuth allowedRoles={["admin"]}>
                        <AdminLayout />
                    </RequireAuth>
                }
            >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="employees" element={<EmployeesPage />} />
                <Route path="seats" element={<SeatsPage />} />
            </Route>

            {/* ── Employee (protected) ────────────────────────────────────── */}
            <Route
                path="/employee"
                element={
                    <RequireAuth allowedRoles={["employee"]}>
                        <EmployeeLayout />
                    </RequireAuth>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="bookings" element={<MyBookings />} />
            </Route>

            {/* ── Fallback ────────────────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;

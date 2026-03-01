import { Route, Routes, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import RequireAuth from "./RequireAuth";
import EmployeesPage from "../pages/admin/EmployeesPage";

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
                <Route path="seats" element={<div>Seats — coming soon</div>} />
            </Route>

            {/* ── Employee (protected) ────────────────────────────────────── */}
            <Route
                path="/employee/*"
                element={
                    <RequireAuth allowedRoles={["employee"]}>
                        <Routes>
                            <Route path="dashboard" element={<EmployeeDashboard />} />
                        </Routes>
                    </RequireAuth>
                }
            />

            {/* ── Fallback ────────────────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;

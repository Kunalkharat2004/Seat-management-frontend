import { Route, Routes, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import RequireAuth from "./RequireAuth";

// ─── App Routes ──────────────────────────────────────────────────────────────

const AppRoutes = () => {
    return (
        <Routes>
            {/* ── Public ──────────────────────────────────────────────────── */}
            <Route path="/login" element={<LoginPage />} />

            {/* ── Admin (protected) ───────────────────────────────────────── */}
            <Route
                path="/admin/*"
                element={
                    <RequireAuth allowedRoles={["admin"]}>
                        <Routes>
                            <Route path="dashboard" element={<AdminDashboard />} />
                        </Routes>
                    </RequireAuth>
                }
            />

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

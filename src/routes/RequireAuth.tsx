import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";

// ─── Props ───────────────────────────────────────────────────────────────────

interface RequireAuthProps {
    children: ReactNode;
    /** If provided, the user's role must be in this list. */
    allowedRoles?: string[];
}

// ─── Component ───────────────────────────────────────────────────────────────

const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
    const location = useLocation();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const userRole = useAuthStore((s) => s.user?.role);

    // 1. Not logged in → redirect to /login (preserve attempted URL)
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Role check (only when allowedRoles is specified)
    if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. Authorised → render children
    return <>{children}</>;
};

export default RequireAuth;

import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/auth.store";
import { useCurrentUser } from "./hooks/useAuth";

const App = () => {
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const logout = useAuthStore((s) => s.logout);

  const { data: profile, isSuccess, isError } = useCurrentUser();

  // ── Hydrate user profile on page refresh ──────────────────────────────────
  useEffect(() => {
    if (!isHydrating) return;

    if (isSuccess && profile) {
      setUser({
        id: profile.id,
        employee_id: profile.employee_id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        status: profile.status,
      });
      setHydrated();
    }

    if (isError) {
      // Token is invalid / expired → clean up
      logout();
    }
  }, [isHydrating, isSuccess, isError, profile, setUser, setHydrated, logout]);

  // ── Show spinner while restoring session ──────────────────────────────────
  if (isHydrating) {
    return (
      <Box className="flex min-h-screen items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
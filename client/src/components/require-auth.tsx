import useAuthStore from "../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <span>Loading ....</span>;
  if (!isAuthenticated) return <Navigate to="/auth" />;
  if (isAuthenticated) return <Outlet />;
}

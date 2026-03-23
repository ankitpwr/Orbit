import useAuthStore from "../store/useAuthStore";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  if (isLoading) return <span>Loading ....</span>;
  if (!isAuthenticated) return <Navigate to="/auth" />;
  if (isAuthenticated) return <Outlet />;
}

import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const auth = async () => {
      const res = await checkAuth();
      if (!res.success) {
        toast.error(res.message, { position: "bottom-right" });
      }
      //else navigate
    };

    auth();
  }, []);

  if (isLoading) return <span>Loading ....</span>;
  if (!isAuthenticated && !isLoading) {
    console.log("auth failed", isAuthenticated);
    return <Navigate to="/" />;
  }
  if (isAuthenticated) return <Outlet />;
}

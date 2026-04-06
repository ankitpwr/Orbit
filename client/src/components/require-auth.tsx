import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

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

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner className="size-12" />
      </div>
    );
  if (!isAuthenticated && !isLoading) {
    console.log("auth failed", isAuthenticated);
    return <Navigate to="/" />;
  }
  if (isAuthenticated) return <Outlet />;
}

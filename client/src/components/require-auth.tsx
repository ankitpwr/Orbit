import React, { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { Outlet, useNavigate } from "react-router-dom";

export default function RequireAuth() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) return <span>Loading ....</span>;
  if (!isAuthenticated) navigate("/auth");
  if (isAuthenticated) return <Outlet />;
}

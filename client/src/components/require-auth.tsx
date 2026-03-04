import React, { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { Outlet, useNavigate } from "react-router-dom";

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  if (isLoading) return <span>Loading ....</span>;
  if (!isAuthenticated) navigate("/auth");
  if (isAuthenticated) return <Outlet />;
}

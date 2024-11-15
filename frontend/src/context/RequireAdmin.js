import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAdmin = () => {
  const { isAdmin, isLoading } = useAuth();
  console.log("RequireAdmin - isAdmin:", isAdmin);

  if (isLoading) {
    return null; // 로딩 중일 때는 아무것도 렌더링하지 않음
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;

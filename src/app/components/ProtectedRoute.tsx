import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks";

export default function ProtectedRoute() {
  const token = useAppSelector((s) => s.auth.token);
  console.log("token is ", token);
  const location = useLocation();
  console.log(location);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

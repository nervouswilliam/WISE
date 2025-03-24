import { JSX, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const auth = useContext(AuthContext);
  return auth?.isAuthenticated ? children : <Navigate to="/login" replace />;
}
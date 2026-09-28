import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  const roles = allowedRoles || (allowedRole ? [allowedRole] : null);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    if (user.role === "RECRUITER") {
      return <Navigate to="/recruiter-dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;

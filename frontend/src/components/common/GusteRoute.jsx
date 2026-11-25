import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  // Already logged in → Dashboard
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default GuestRoute;

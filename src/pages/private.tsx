import { Outlet } from "react-router-dom";
import { AuthContext } from "@/contexts/Auth.tsx";
import LoginPage from "@/pages/login.tsx";
import { useContext } from "react";

const PrivateRoute = () => {
  const { session } = useContext(AuthContext);
  if (!session) return <LoginPage />;
  return <Outlet />;
};

export default PrivateRoute;

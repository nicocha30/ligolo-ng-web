import {Outlet} from "react-router-dom";
import {useAuth} from "@/authprovider.tsx";
import LoginPage from "@/pages/login.tsx";

const PrivateRoute = () => {
    const user = useAuth();
    if (!user?.authenticated) return <LoginPage/>;
    return <Outlet/>;
};

export default PrivateRoute;
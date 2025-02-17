import { Route, Routes } from "react-router-dom";
import InterfacesPage from "@/pages/interfaces.tsx";
import ListenersPage from "@/pages/listeners.tsx";
import LoginPage from "@/pages/login.tsx";
import PrivateRoute from "@/pages/private.tsx";
import AgentPage from "@/pages/agents.tsx";

function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<PrivateRoute />}>
        <Route element={<AgentPage />} path="/" />
        <Route element={<InterfacesPage />} path="/interfaces" />
        <Route element={<ListenersPage />} path="/listeners" />
      </Route>
    </Routes>
  );
}

export default App;

import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import InterfacesPage from "@/pages/interfaces/index.tsx";
import ListenersPage from "@/pages/listeners/index.tsx";
import LoginPage from "@/pages/login.tsx";
import PrivateRoute from "@/pages/private.tsx";
import AgentPage from "@/pages/agents/index.tsx";
import ErrorPage from "@/pages/error.tsx";
import { PageNotFoundError } from "@/errors/pages.ts";
import LoadingPage from "@/pages/loading.tsx";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  if (isLoading) return <LoadingPage />;

  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<PrivateRoute />}>
        <Route element={<AgentPage />} path="/" />
        <Route element={<InterfacesPage />} path="/interfaces" />
        <Route element={<ListenersPage />} path="/listeners" />
      </Route>
      <Route element={<ErrorPage error={new PageNotFoundError()} />} path="*" />
    </Routes>
  );
}

export default App;

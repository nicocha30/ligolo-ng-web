import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InvalidCredentialsError } from "@/errors/login.ts";
import { UnknownHttpError } from "@/errors";

interface AuthProviderContextType {
  api: string;
  authToken: string;
  loginApi: (
    apiUrl: string,
    username: string,
    password: string,
  ) => Promise<void>;
  logOut: () => void;
  authenticated: boolean;
}

const AuthContext = createContext<AuthProviderContextType | null>(null);
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, setApi] = useState(
    localStorage.getItem("apiUrl") || "http://127.0.0.1:8080",
  );
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || "",
  );
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  const loginApi = async (
    apiUrl: string,
    username: string,
    password: string,
  ) => {
    try {
      const response = await fetch(`${apiUrl}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      });

      const jsonData = await response.json();
      // TODO validation schema

      if (!jsonData.token) throw new InvalidCredentialsError();

      setAuthToken(jsonData.token);
      setApi(apiUrl);
      localStorage.setItem("apiUrl", apiUrl);
      localStorage.setItem("authToken", jsonData.token);
      window.location.reload();
    } catch (error) {
      throw UnknownHttpError.fromError(error);
    }
  };

  useEffect(() => {
    fetch(`${api}/ping`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authToken}`,
      },
    })
      .then((response: Response) => response.json())
      .then((result) => {
        setAuthenticated(result.message == "pong");
      });
  }, [api]);

  const logOut = () => {
    sessionStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ api, authToken, authenticated, loginApi, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
